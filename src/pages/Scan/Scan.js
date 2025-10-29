import React, { useState } from "react";

const Scan = () => {
  // ✅ Define all state variables
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  // ✅ Your existing analyzeImage function (now uses defined states)
  const analyzeImage = async () => {
    if (!selectedImage || !imageFile) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const token = localStorage.getItem("agri_smart_detect_token");

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        "https://agri-smart-detect-backend.onrender.com/api/diagnosis/scan",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      setError(error.message || "Failed to analyze image. Please try again.");
    }

    setIsAnalyzing(false);
  };

  // ✅ Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // ✅ Render
  return (
    <div>
      <h1>Scan Image</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {selectedImage && (
        <div>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: "200px", marginTop: "10px" }}
          />
        </div>
      )}

      <button onClick={analyzeImage} disabled={isAnalyzing}>
        {isAnalyzing ? "Analyzing..." : "Analyze Image"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {analysisResult && (
        <div>
          <h2>Analysis Result</h2>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Scan;
