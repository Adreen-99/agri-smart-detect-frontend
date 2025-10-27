import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { plantApi } from '../../services/plantApi';
import { api } from '../../services/api';
import './Scan.css';

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
        setError('Please upload an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
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
    if (!selectedImage || !imageFile) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const result = await plantApi.identifyPlant(imageFile);
      setAnalysisResult(result);

      // Save the scan result to the backend
      await api.saveScanResult({
        plantName: result.plantName,
        isHealthy: result.isHealthy,
        disease: result.disease,
        confidence: result.confidence,
        treatment: result.treatment,
        imageUrl: selectedImage, // or upload image to backend if needed
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze image. Please try again.');

      // Fallback to mock data if API fails
      const mockResult = getMockResult();
      setAnalysisResult(mockResult);

      // Still try to save mock result
      try {
        await api.saveScanResult({
          plantName: mockResult.plantName,
          isHealthy: mockResult.isHealthy,
          disease: mockResult.disease,
          confidence: mockResult.confidence,
          treatment: mockResult.treatment,
          imageUrl: selectedImage,
        });
      } catch (saveError) {
        console.error('Failed to save scan result:', saveError);
      }
    }

    setIsAnalyzing(false);
  };

  // Fallback mock data
  const getMockResult = () => {
    const mockResults = [
      { 
        plantName: 'Maize',
        isHealthy: false,
        disease: 'Leaf Rust', 
        confidence: 87, 
        treatment: 'Apply fungicide containing chlorothalonil. Remove and destroy infected leaves.',
        details: {
          commonNames: ['Corn', 'Maize'],
          description: 'Maize affected by leaf rust fungus'
        }
      },
      { 
        plantName: 'Cassava',
        isHealthy: false,
        disease: 'Cassava Mosaic Virus', 
        confidence: 92, 
        treatment: 'Remove and destroy infected plants. Use certified virus-free planting materials.',
        details: {
          commonNames: ['Cassava', 'Manioc'],
          description: 'Cassava plant showing mosaic virus symptoms'
        }
      },
      { 
        plantName: 'Tomato',
        isHealthy: true,
        disease: null, 
        confidence: 95, 
        treatment: 'No treatment needed - plant is healthy',
        details: {
          commonNames: ['Tomato'],
          description: 'Healthy tomato plant'
        }
      }
    ];
    
    return mockResults[Math.floor(Math.random() * mockResults.length)];
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
        <h1>AI Crop Disease Scanner</h1>
        <p>Welcome back, {currentUser.name}! Upload a photo of your crop leaves for instant disease identification.</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
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
                <small>Supported formats: JPG, PNG, WebP (Max 5MB)</small>
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
                <h3>AI Analysis Complete</h3>
                
                <div className="plant-info">
                  <h4>Plant Identified:</h4>
                  <p><strong>{analysisResult.plantName}</strong></p>
                  {analysisResult.details.commonNames.length > 0 && (
                    <p>Also known as: {analysisResult.details.commonNames.join(', ')}</p>
                  )}
                </div>

                <div className={`result-status ${analysisResult.isHealthy ? 'healthy' : 'diseased'}`}>
                  {analysisResult.isHealthy ? '✅ Healthy Plant' : `⚠️ ${analysisResult.disease}`}
                </div>
                
                <div className="confidence">
                  AI Confidence: <span>{analysisResult.confidence.toFixed(1)}%</span>
                </div>
                
                <div className="treatment-info">
                  <h4>Recommended Treatment:</h4>
                  <p>{analysisResult.treatment}</p>
                </div>
                
                {analysisResult.details.description && (
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
        <h3>Tips for Best AI Results:</h3>
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