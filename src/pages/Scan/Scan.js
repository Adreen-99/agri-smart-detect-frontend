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
    setError(error.message || 'Failed to analyze image. Please try again.');
  }
  
  setIsAnalyzing(false);
};