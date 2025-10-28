const PLANT_ID_API_KEY = process.env.REACT_APP_PLANT_ID_API_KEY; // API key for disease identification
const PLANT_ID_API_URL = 'https://api.plant.id/v2/identify';

export const plantApi = {
  async identifyPlant(imageFile) {
    const formData = new FormData();
    formData.append('images', imageFile);
    formData.append('modifiers', 'crops_fast');
    formData.append('plant_language', 'en');
    formData.append('plant_details', 
      'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods'
    );

    try {
      const response = await fetch(PLANT_ID_API_URL, {
        method: 'POST',
        headers: {
          'Api-Key': PLANT_ID_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parsePlantResponse(data);
    } catch (error) {
      console.error('Plant identification error:', error);
      throw new Error('Failed to identify plant. Please try again.');
    }
  },

  parsePlantResponse(data) {
    if (!data.suggestions || data.suggestions.length === 0) {
      throw new Error('No plant identification results found.');
    }

    const bestMatch = data.suggestions[0];
    
    // Check for disease indicators
    const isHealthy = this.checkPlantHealth(bestMatch);
    
    return {
      plantName: bestMatch.plant_name,
      probability: bestMatch.probability,
      isHealthy: isHealthy,
      disease: isHealthy ? null : this.identifyDisease(bestMatch),
      confidence: bestMatch.probability * 100,
      details: {
        commonNames: bestMatch.plant_details?.common_names || [],
        description: bestMatch.plant_details?.description?.value,
        taxonomy: bestMatch.plant_details?.taxonomy,
      },
      treatment: this.getTreatmentRecommendations(bestMatch),
      similarImages: bestMatch.similar_images || []
    };
  },

  checkPlantHealth(plantSuggestion) {
    const plantName = plantSuggestion.plant_name.toLowerCase();
    const description = plantSuggestion.plant_details?.description?.value?.toLowerCase() || '';
    
    // Disease indicators (simplified - in real app, use more sophisticated detection)
    const diseaseIndicators = [
      'spot', 'rot', 'blight', 'mildew', 'rust', 'mosaic', 'wilt', 
      'canker', 'gall', 'scab', 'yellow', 'brown', 'black', 'fungus'
    ];
    
    return !diseaseIndicators.some(indicator => 
      plantName.includes(indicator) || description.includes(indicator)
    );
  },

  identifyDisease(plantSuggestion) {
    const plantName = plantSuggestion.plant_name.toLowerCase();
    
    // Simple disease mapping (expand based on your needs)
    const diseaseMap = {
      'rust': 'Leaf Rust',
      'mildew': 'Powdery Mildew',
      'blight': 'Leaf Blight',
      'spot': 'Leaf Spot',
      'mosaic': 'Mosaic Virus'
    };

    for (const [key, disease] of Object.entries(diseaseMap)) {
      if (plantName.includes(key)) {
        return disease;
      }
    }

    return 'Unknown Plant Disease';
  },

  getTreatmentRecommendations(plantSuggestion) {
    const disease = this.identifyDisease(plantSuggestion);
    
    const treatments = {
      'Leaf Rust': 'Apply fungicide containing chlorothalonil. Remove and destroy infected leaves. Improve air circulation.',
      'Powdery Mildew': 'Use sulfur-based fungicide. Avoid overhead watering. Ensure proper plant spacing.',
      'Leaf Blight': 'Apply copper-based fungicide. Remove infected plant parts. Practice crop rotation.',
      'Leaf Spot': 'Use fungicidal sprays. Remove affected leaves. Avoid wetting foliage when watering.',
      'Mosaic Virus': 'Remove and destroy infected plants. Control aphid populations. Use virus-free seeds.',
      'Unknown Plant Disease': 'Consult with agricultural expert. Isolate affected plants. Improve overall plant health.',
      'Healthy': 'No treatment needed. Continue regular maintenance and monitoring.'
    };

    return treatments[disease] || treatments['Unknown Plant Disease'];
  }
};