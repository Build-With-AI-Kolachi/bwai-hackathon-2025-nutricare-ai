import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, ArrowRight } from "lucide-react";
import { FoodAnalysisResult, MedicalData } from "../pages/App";

interface AlternativeSuggestionsProps {
  currentFood: FoodAnalysisResult;
  medicalProfile: MedicalData;
}

interface AlternativeFood {
  name: string;
  healthScore: number;
  calories: number;
  sodium: number;
  sugar: number;
  benefits: string[];
  description: string;
}

export const AlternativeSuggestions = ({ currentFood, medicalProfile }: AlternativeSuggestionsProps) => {
  const generateAlternatives = (): AlternativeFood[] => {
    const alternatives: AlternativeFood[] = [];
    
    // Base alternatives that are generally healthier
    const baseAlternatives = [
      {
        name: "Grilled Chicken Salad",
        healthScore: 85,
        calories: 320,
        sodium: 480,
        sugar: 4,
        benefits: ["High protein", "Low sodium", "Rich in fiber"],
        description: "Fresh greens with grilled chicken breast, cherry tomatoes, and light vinaigrette"
      },
      {
        name: "Quinoa Buddha Bowl",
        healthScore: 88,
        calories: 380,
        sodium: 290,
        sugar: 6,
        benefits: ["Complete protein", "High fiber", "Low sodium"],
        description: "Quinoa with roasted vegetables, avocado, and tahini dressing"
      },
      {
        name: "Baked Salmon with Vegetables",
        healthScore: 92,
        calories: 420,
        sodium: 350,
        sugar: 3,
        benefits: ["Omega-3 fatty acids", "Heart healthy", "Anti-inflammatory"],
        description: "Fresh salmon fillet with steamed broccoli and sweet potato"
      },
      {
        name: "Turkey and Avocado Wrap",
        healthScore: 78,
        calories: 340,
        sodium: 520,
        sugar: 5,
        benefits: ["Lean protein", "Healthy fats", "Balanced nutrients"],
        description: "Whole wheat wrap with sliced turkey, avocado, and mixed greens"
      },
      {
        name: "Vegetable Stir-Fry with Brown Rice",
        healthScore: 82,
        calories: 290,
        sodium: 380,
        sugar: 8,
        benefits: ["High fiber", "Low calorie", "Nutrient dense"],
        description: "Mixed vegetables stir-fried with minimal oil over brown rice"
      }
    ];

    // Filter and customize based on medical conditions
    return baseAlternatives
      .filter(alt => alt.healthScore > currentFood.healthScore)
      .map(alt => ({
        ...alt,
        benefits: customizeBenefits(alt.benefits, medicalProfile)
      }))
      .slice(0, 3);
  };

  const customizeBenefits = (benefits: string[], profile: MedicalData): string[] => {
    const customBenefits = [...benefits];
    
    if (profile.conditions.includes("High Blood Pressure")) {
      customBenefits.push("Blood pressure friendly");
    }
    
    if (profile.conditions.includes("Type 2 Diabetes")) {
      customBenefits.push("Diabetic friendly");
    }
    
    if (profile.conditions.includes("Heart Disease")) {
      customBenefits.push("Heart healthy");
    }
    
    return customBenefits;
  };

  const alternatives = generateAlternatives();

  if (alternatives.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Great Choice!</h3>
        <p className="text-gray-600">
          This food aligns well with your health goals. Keep up the good work!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Healthier Alternatives</h3>
      <p className="text-gray-600 mb-6">
        Based on your health profile, here are some better options that could improve your health score:
      </p>
      
      <div className="space-y-4">
        {alternatives.map((alternative, index) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{alternative.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{alternative.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>{alternative.calories} cal</span>
                  <span>{alternative.sodium}mg sodium</span>
                  <span>{alternative.sugar}g sugar</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {alternative.benefits.map((benefit, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-center ml-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-green-600">{alternative.healthScore}</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span>+{alternative.healthScore - currentFood.healthScore}</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-blue-800">
          Small changes can make a big difference! Try swapping just one meal per day with a healthier alternative 
          to see improvements in your overall health score.
        </p>
      </div>
    </Card>
  );
};
