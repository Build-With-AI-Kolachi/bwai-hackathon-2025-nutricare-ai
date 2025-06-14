import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { MedicalData, FoodAnalysisResult } from "../pages/App";

interface FoodAnalysisProps {
  medicalProfile: MedicalData;
  onAnalysisComplete: (result: FoodAnalysisResult, imageUrl: string) => void;
}

export const FoodAnalysis = ({ medicalProfile, onAnalysisComplete }: FoodAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const analyzeFood = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis (in real app, this would call an AI service)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock analysis result based on medical profile
    const mockFoods = [
      {
        foodName: "Fried Chicken Sandwich",
        calories: 850,
        sodium: 1420,
        sugar: 8,
        carbs: 45,
        protein: 32,
        fiber: 2,
        healthScore: medicalProfile.conditions.includes("High Blood Pressure") ? 25 : 45,
        risks: medicalProfile.conditions.includes("High Blood Pressure") 
          ? ["High sodium content", "Excessive calories"]
          : ["High calorie content"],
        warnings: medicalProfile.conditions.includes("Type 2 Diabetes")
          ? ["May cause blood sugar spike"]
          : []
      },
      {
        foodName: "Grilled Salmon Salad",
        calories: 420,
        sodium: 380,
        sugar: 6,
        carbs: 15,
        protein: 35,
        fiber: 8,
        healthScore: 85,
        risks: [],
        warnings: []
      },
      {
        foodName: "Chocolate Cake",
        calories: 520,
        sodium: 290,
        sugar: 45,
        carbs: 68,
        protein: 6,
        fiber: 3,
        healthScore: medicalProfile.conditions.includes("Type 2 Diabetes") ? 15 : 30,
        risks: medicalProfile.conditions.includes("Type 2 Diabetes")
          ? ["Very high sugar content", "High carbohydrates"]
          : ["High sugar content"],
        warnings: medicalProfile.conditions.includes("Type 2 Diabetes")
          ? ["Will significantly raise blood glucose"]
          : []
      }
    ];

    // Select random food for demo
    const result = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    
    setIsAnalyzing(false);
    onAnalysisComplete(result, selectedImage);
    toast.success("Food analysis complete!");
  };

  return (
    <Card className="p-6">
      <div className="text-center space-y-6">
        {!selectedImage ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Upload Food Image
            </h3>
            <p className="text-gray-500 mb-4">
              Take a photo or upload an image of your meal
            </p>
            <label htmlFor="food-upload" className="cursor-pointer">
              <Button asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
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
                  <span>Choose Different Image</span>
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
                    Analyzing...
                  </>
                ) : (
                  "Analyze Food"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
