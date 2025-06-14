
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { MedicalData, FoodAnalysisResult } from "../pages/App";
import { useLanguage } from "../contexts/LanguageContext";
import { generateAIResponse } from "../utils/geminiApi";

interface FoodAnalysisProps {
  medicalProfile: MedicalData;
  onAnalysisComplete: (result: FoodAnalysisResult, imageUrl: string) => void;
}

export const FoodAnalysis = ({ medicalProfile, onAnalysisComplete }: FoodAnalysisProps) => {
  const { language } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const content = {
    en: {
      uploadTitle: "Upload Food Image",
      uploadDesc: "Take a photo or upload an image of your meal",
      chooseImage: "Choose Image",
      chooseDifferent: "Choose Different Image",
      analyze: "Analyze Food",
      analyzing: "Analyzing...",
      uploadFirst: "Please upload an image first",
      analysisComplete: "Food analysis complete!",
      analysisError: "Failed to analyze food. Please try again."
    },
    ur: {
      uploadTitle: "کھانے کی تصویر اپ لوڈ کریں",
      uploadDesc: "اپنے کھانے کی تصویر لیں یا اپ لوڈ کریں",
      chooseImage: "تصویر منتخب کریں",
      chooseDifferent: "مختلف تصویر منتخب کریں",
      analyze: "کھانے کا تجزیہ کریں",
      analyzing: "تجزیہ ہو رہا ہے...",
      uploadFirst: "براہ کرم پہلے تصویر اپ لوڈ کریں",
      analysisComplete: "کھانے کا تجزیہ مکمل!",
      analysisError: "کھانے کا تجزیہ نہیں ہو سکا۔ براہ کرم دوبارہ کوشش کریں۔"
    }
  };

  const currentContent = content[language];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseAIResponse = (aiResponse: string): FoodAnalysisResult => {
    // Try to extract structured data from AI response
    // This is a fallback parser in case the AI doesn't return perfect JSON
    const defaultResult: FoodAnalysisResult = {
      foodName: "Unknown Food",
      calories: 0,
      sodium: 0,
      sugar: 0,
      carbs: 0,
      protein: 0,
      fiber: 0,
      healthScore: 50,
      risks: [],
      warnings: []
    };

    try {
      // Look for JSON in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { ...defaultResult, ...parsed };
      }

      // If no JSON, try to extract key information
      const lines = aiResponse.toLowerCase().split('\n');
      const result = { ...defaultResult };

      lines.forEach(line => {
        if (line.includes('calories')) {
          const match = line.match(/(\d+)/);
          if (match) result.calories = parseInt(match[1]);
        }
        if (line.includes('sodium')) {
          const match = line.match(/(\d+)/);
          if (match) result.sodium = parseInt(match[1]);
        }
        if (line.includes('sugar')) {
          const match = line.match(/(\d+)/);
          if (match) result.sugar = parseInt(match[1]);
        }
        if (line.includes('carbs') || line.includes('carbohydrate')) {
          const match = line.match(/(\d+)/);
          if (match) result.carbs = parseInt(match[1]);
        }
        if (line.includes('protein')) {
          const match = line.match(/(\d+)/);
          if (match) result.protein = parseInt(match[1]);
        }
        if (line.includes('fiber')) {
          const match = line.match(/(\d+)/);
          if (match) result.fiber = parseInt(match[1]);
        }
      });

      // Extract food name from first few words
      const firstLine = aiResponse.split('\n')[0];
      if (firstLine && firstLine.length > 0) {
        result.foodName = firstLine.substring(0, 50).replace(/[^\w\s]/gi, '').trim();
      }

      // Calculate health score based on medical profile
      result.healthScore = calculateHealthScore(result, medicalProfile);

      // Generate risks and warnings
      result.risks = generateRisks(result, medicalProfile);
      result.warnings = generateWarnings(result, medicalProfile);

      return result;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return defaultResult;
    }
  };

  const calculateHealthScore = (nutritionData: FoodAnalysisResult, profile: MedicalData): number => {
    let score = 100;

    // Penalize based on medical conditions
    if (profile.conditions.includes("High Blood Pressure") && nutritionData.sodium > 600) {
      score -= 30;
    }
    if (profile.conditions.includes("Type 2 Diabetes") && nutritionData.sugar > 25) {
      score -= 25;
    }
    if (nutritionData.calories > profile.targetCalories * 0.4) {
      score -= 20;
    }

    return Math.max(10, Math.min(100, score));
  };

  const generateRisks = (nutritionData: FoodAnalysisResult, profile: MedicalData): string[] => {
    const risks: string[] = [];

    if (nutritionData.sodium > profile.sodiumLimit * 0.5) {
      risks.push("High sodium content");
    }
    if (nutritionData.sugar > profile.sugarLimit * 0.5) {
      risks.push("High sugar content");
    }
    if (nutritionData.calories > profile.targetCalories * 0.4) {
      risks.push("High calorie content");
    }

    return risks;
  };

  const generateWarnings = (nutritionData: FoodAnalysisResult, profile: MedicalData): string[] => {
    const warnings: string[] = [];

    if (profile.conditions.includes("Type 2 Diabetes") && nutritionData.sugar > 20) {
      warnings.push("May cause blood sugar spike");
    }
    if (profile.conditions.includes("High Blood Pressure") && nutritionData.sodium > 800) {
      warnings.push("May increase blood pressure");
    }

    return warnings;
  };

  const analyzeFood = async () => {
    if (!selectedImage) {
      toast.error(currentContent.uploadFirst);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const analysisPrompt = language === 'en' 
        ? `Please analyze this food image and provide detailed nutritional information. Return the analysis in this exact JSON format:

{
  "foodName": "Name of the food item",
  "calories": estimated_calories_number,
  "sodium": estimated_sodium_in_mg,
  "sugar": estimated_sugar_in_grams,
  "carbs": estimated_carbs_in_grams,
  "protein": estimated_protein_in_grams,
  "fiber": estimated_fiber_in_grams
}

Be as accurate as possible with the nutritional estimates based on what you can see in the image. If you can see multiple food items, provide the total for the entire meal.`
        : `براہ کرم اس کھانے کی تصویر کا تجزیہ کریں اور تفصیلی غذائی معلومات فراہم کریں۔ تجزیہ اس بالکل JSON فارمیٹ میں واپس کریں:

{
  "foodName": "کھانے کی اشیاء کا نام",
  "calories": estimated_calories_number,
  "sodium": estimated_sodium_in_mg,
  "sugar": estimated_sugar_in_grams,
  "carbs": estimated_carbs_in_grams,
  "protein": estimated_protein_in_grams,
  "fiber": estimated_fiber_in_grams
}

تصویر میں جو کچھ آپ دیکھ سکتے ہیں اس کی بنیاد پر غذائی تخمینے میں جتنا درست ہو سکیں۔ اگر آپ متعدد کھانے کی اشیاء دیکھ سکتے ہیں تو پورے کھانے کا کل فراہم کریں۔`;

      // Use Gemini AI for actual food analysis
      const aiResponse = await generateAIResponse(
        analysisPrompt,
        medicalProfile,
        undefined,
        selectedImage,
        language
      );

      console.log('AI Analysis Response:', aiResponse);

      // Parse the AI response into structured data
      const result = parseAIResponse(aiResponse);
      
      setIsAnalyzing(false);
      onAnalysisComplete(result, selectedImage);
      toast.success(currentContent.analysisComplete);
    } catch (error) {
      console.error('Food analysis error:', error);
      setIsAnalyzing(false);
      toast.error(currentContent.analysisError);
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center space-y-6">
        {!selectedImage ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {currentContent.uploadTitle}
            </h3>
            <p className="text-gray-500 mb-4">
              {currentContent.uploadDesc}
            </p>
            <label htmlFor="food-upload" className="cursor-pointer">
              <Button asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {currentContent.chooseImage}
                </span>
              </Button>
            </label>
            <input
              id="food-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-w-md mx-auto">
              <img 
                src={selectedImage} 
                alt="Selected food" 
                className="w-full h-64 object-cover rounded-lg border"
              />
            </div>
            <div className="flex gap-3 justify-center">
              <label htmlFor="food-upload-new" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>{currentContent.chooseDifferent}</span>
                </Button>
              </label>
              <input
                id="food-upload-new"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                onClick={analyzeFood} 
                disabled={isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {currentContent.analyzing}
                  </>
                ) : (
                  currentContent.analyze
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
