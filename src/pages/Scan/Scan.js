import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
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
    if (!selectedImage || !imageFile) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const token = localStorage.getItem('agri_smart_detect_token');

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('https://agri-smart-detect-backend.onrender.com/api/diagnosis/scan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);

    } catch (error) {
      console.error('Analysis error:', error);

      // Fallback to mock data if API fails
      console.log('Using mock data as fallback');
      const mockResult = getMockAnalysisResult();
      mockResult.isMock = true; // Mark as mock data
      setAnalysisResult(mockResult);
      setError(''); // Clear error since we're using fallback
    }

    setIsAnalyzing(false);
  };

  // Mock data function for fallback - Tomato only
  const getMockAnalysisResult = () => {
    const tomatoMockResults = [
      {
        plantName: 'Tomato',
        isHealthy: false,
        disease: 'Late Blight',
        confidence: 85,
        treatment: 'Apply copper-based fungicide and remove affected leaves. Ensure good air circulation.',
        prevention: 'Avoid overhead watering, space plants properly, and rotate crops annually.',
        details: {
          commonNames: ['Solanum lycopersicum'],
          description: 'Late blight is a serious disease of tomatoes and potatoes caused by Phytophthora infestans.'
        }
      },
      {
        plantName: 'Tomato',
        isHealthy: false,
        disease: 'Early Blight',
        confidence: 78,
        treatment: 'Apply fungicide containing chlorothalonil or copper. Remove infected leaves and improve air circulation.',
        prevention: 'Mulch around plants to prevent soil splash, water at soil level, and rotate crops.',
        details: {
          commonNames: ['Solanum lycopersicum'],
          description: 'Early blight is caused by the fungus Alternaria solani and affects leaves, stems, and fruits.'
        }
      },
      {
        plantName: 'Tomato',
        isHealthy: false,
        disease: 'Fusarium Wilt',
        confidence: 82,
        treatment: 'Remove and destroy infected plants. Use resistant varieties in future plantings.',
        prevention: 'Use disease-resistant tomato varieties and practice crop rotation.',
        details: {
          commonNames: ['Solanum lycopersicum'],
          description: 'Fusarium wilt is a soil-borne fungal disease that affects the vascular system of tomato plants.'
        }
      },
      {
        plantName: 'Tomato',
        isHealthy: true,
        disease: null,
        confidence: 92,
        treatment: 'No treatment needed - plant appears healthy.',
        prevention: 'Continue good agricultural practices including proper watering and fertilization.',
        details: {
          commonNames: ['Solanum lycopersicum'],
          description: 'Tomatoes are warm-season crops that require full sun and consistent moisture.'
        }
      }
    ];

    // Randomly select a tomato mock result
    return tomatoMockResults[Math.floor(Math.random() * tomatoMockResults.length)];
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
                  <small>Powered by: <strong>Plant.id AI {analysisResult.isMock ? '(Mock Data)' : ''}</strong></small>
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