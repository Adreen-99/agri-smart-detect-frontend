import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const Scan = () => {
  // ✅ Define all state variables
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [crops, setCrops] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  // Fetch crops on component mount
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const cropsData = await api.getCrops();
        setCrops(cropsData);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };
    fetchCrops();
  }, []);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // ✅ Updated analyzeImage function to send JSON payload to /reports
  const analyzeImage = async () => {
    if (!selectedImage || !imageFile || !selectedCrop) return;

    setIsAnalyzing(true);
    setError("");

    try {
      // Convert image to base64
      const imageData = await fileToBase64(imageFile);

      // Prepare payload as per backend expectations
      const scanData = {
        image_data: imageData,
        crop_id: parseInt(selectedCrop),
        user_id: 1, // Assuming user ID is 1 for now, adjust as needed
      };

      // Use api service to save scan result
      const data = await api.saveScanResult(scanData);
      setAnalysisResult(data);
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

      <div>
        <label>Select Crop:</label>
        <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
          <option value="">Choose a crop</option>
          {crops.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {crop.name}
            </option>
          ))}
        </select>
      </div>

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

      <button onClick={analyzeImage} disabled={isAnalyzing || !selectedCrop}>
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
