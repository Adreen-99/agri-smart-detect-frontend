import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Scan.css';

const API_BASE_URL = 'https://clean-backend-6rgv.onrender.com';

const Scan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG, WebP)');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      setError('');
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || !imageFile) {
      setError('Please select an image first');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);
    
    try {
      const token = localStorage.getItem('agri_smart_detect_token');
      
      if (!token) {
        throw new Error('Please login to analyze images');
      }
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      console.log('Sending request to:', `${API_BASE_URL}/api/diagnosis/scan`);
      console.log('Token present:', !!token);
      
      const response = await fetch(`${API_BASE_URL}/api/diagnosis/scan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Analysis failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.msg || errorData.message || 'Analysis failed';
          console.error('Error response:', errorData);
        } catch (e) {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Success response:', data);
      
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setImageFile(null);
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="scan-page">
      <div className="scan-header">
        <h1>Crop Disease Scanner</h1>
        <p>Welcome back, {currentUser.name}! Upload a photo of your crop leaves for instant disease identification.</p>
        
        {/* Show API Status */}
        <div className="api-status">
          <div className="status-indicator active">
            ✅ AI Powered by Plant.id
          </div>
          <p className="status-help">
            Using real AI plant identification with your Plant.id API key
          </p>
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <strong>Error:</strong> {error}
          </div>
          <button 
            className="error-close" 
            onClick={() => setError('')}
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="scanner-container">
        <div className="upload-section">
          <div 
            className="upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <div className="image-preview">
                <img src={selectedImage} alt="Selected crop" />
                <button className="change-image-btn" onClick={(e) => {
                  e.stopPropagation();
                  resetScan();
                }}>
                  Change Image
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📷</div>
                <p>Click to upload an image of crop leaves</p>
                <small>Supported formats: JPG, PNG, WebP (Max 10MB)</small>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {selectedImage && (
          <div className="analysis-section">
            <button 
              className="analyze-btn"
              onClick={analyzeImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner"></div>
                  Analyzing with AI...
                </>
              ) : (
                'Analyze with AI'
              )}
            </button>

            {analysisResult && (
              <div className="result-card">
                <h3>Analysis Complete</h3>
                
                {/* Show API source */}
                <div className="api-source">
                  <small>Powered by: <strong>Plant.id AI</strong></small>
                </div>
                
                <div className="plant-info">
                  <h4>Plant Identified:</h4>
                  <p><strong>{analysisResult.plantName}</strong></p>
                  {analysisResult.details?.commonNames?.length > 0 && (
                    <p>Also known as: {analysisResult.details.commonNames.join(', ')}</p>
                  )}
                </div>

                <div className={`result-status ${analysisResult.isHealthy ? 'healthy' : 'diseased'}`}>
                  {analysisResult.isHealthy ? '✅ Healthy Plant' : `⚠️ ${analysisResult.disease}`}
                </div>
                
                <div className="confidence">
                  AI Confidence: <span>{analysisResult.confidence}%</span>
                </div>
                
                <div className="treatment-info">
                  <h4>Recommended Treatment:</h4>
                  <p>{analysisResult.treatment}</p>
                </div>
                
                {analysisResult.disease && analysisResult.prevention && (
                  <div className="prevention-info">
                    <h4>Prevention Tips:</h4>
                    <p>{analysisResult.prevention}</p>
                  </div>
                )}
                
                {analysisResult.details?.description && (
                  <div className="description-info">
                    <h4>Description:</h4>
                    <p>{analysisResult.details.description}</p>
                  </div>
                )}
                
                <button className="new-scan-btn" onClick={resetScan}>
                  Scan Another Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="scan-tips">
        <h3>Tips for Best Results:</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">☀️</div>
            <p>Take photos in good natural lighting</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <p>Focus clearly on the affected leaves</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📐</div>
            <p>Include multiple angles if possible</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🌿</div>
            <p>Capture both healthy and affected areas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
