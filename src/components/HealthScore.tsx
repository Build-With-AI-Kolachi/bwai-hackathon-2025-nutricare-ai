import { Card } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Shield, AlertTriangle, X } from "lucide-react";
import { FoodAnalysisResult, MedicalData } from "../pages/App";

interface HealthScoreProps {
  result: FoodAnalysisResult;
  medicalProfile: MedicalData;
}

export const HealthScore = ({ result, medicalProfile }: HealthScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 70) return "bg-green-100";
    if (score >= 40) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreText = (score: number) => {
    if (score >= 70) return "Healthy Choice";
    if (score >= 40) return "Moderate Risk";
    return "High Risk";
  };

  const checkNutrientLimits = () => {
    const alerts = [];
    
    if (result.sodium > medicalProfile.sodiumLimit) {
      alerts.push({
        type: "sodium",
        message: `Sodium (${result.sodium}mg) exceeds your daily limit of ${medicalProfile.sodiumLimit}mg`,
        severity: "high"
      });
    }
    
    if (result.sugar > medicalProfile.sugarLimit) {
      alerts.push({
        type: "sugar",
        message: `Sugar (${result.sugar}g) exceeds your daily limit of ${medicalProfile.sugarLimit}g`,
        severity: "high"
      });
    }
    
    if (result.calories > medicalProfile.targetCalories * 0.4) {
      alerts.push({
        type: "calories",
        message: `High calorie content (${result.calories}) for a single meal`,
        severity: "medium"
      });
    }

    return alerts;
  };

  const nutritionAlerts = checkNutrientLimits();

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Health Score</h3>
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        
        <div className="text-center space-y-4">
          <div className={`text-6xl font-bold ${getScoreColor(result.healthScore)}`}>
            {result.healthScore}
          </div>
          <div className={`inline-block px-4 py-2 rounded-full ${getScoreBackground(result.healthScore)}`}>
            <span className={`font-semibold ${getScoreColor(result.healthScore)}`}>
              {getScoreText(result.healthScore)}
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Based on your health conditions: {medicalProfile.conditions.join(", ") || "None specified"}
          </p>
        </div>
      </Card>

      {/* Risks and Warnings */}
      {(result.risks.length > 0 || result.warnings.length > 0 || nutritionAlerts.length > 0) && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Health Alerts</h3>
          <div className="space-y-3">
            {/* Critical Warnings */}
            {result.warnings.map((warning, index) => (
              <Alert key={`warning-${index}`} variant="destructive">
                <X className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {warning}
                </AlertDescription>
              </Alert>
            ))}

            {/* Nutrition Limit Alerts */}
            {nutritionAlerts.map((alert, index) => (
              <Alert key={`alert-${index}`} variant={alert.severity === "high" ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}

            {/* General Risks */}
            {result.risks.map((risk, index) => (
              <Alert key={`risk-${index}`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {risk}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      {/* Condition-Specific Advice */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Personalized Advice</h3>
        <div className="space-y-3">
          {medicalProfile.conditions.map((condition) => (
            <div key={condition} className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                {condition}
              </Badge>
              <p className="text-sm text-gray-600 flex-1">
                {getConditionAdvice(condition, result)}
              </p>
            </div>
          ))}
          {medicalProfile.conditions.length === 0 && (
            <p className="text-gray-500 text-sm">
              No specific health conditions specified. Consider adding your conditions for more personalized advice.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

const getConditionAdvice = (condition: string, result: FoodAnalysisResult): string => {
  switch (condition) {
    case "Type 1 Diabetes":
    case "Type 2 Diabetes":
      return result.sugar > 15 
        ? "High sugar content may require insulin adjustment. Monitor blood glucose closely."
        : "Moderate sugar content. Consider pairing with protein to slow glucose absorption.";
    
    case "High Blood Pressure":
      return result.sodium > 1000
        ? "High sodium content may raise blood pressure. Consider alternatives or reduce portion size."
        : "Moderate sodium levels. Stay hydrated and monitor your blood pressure.";
    
    case "Kidney Disease":
      return result.sodium > 800 || result.protein > 25
        ? "High sodium/protein may strain kidneys. Consult your nephrologist about portion sizes."
        : "Reasonable levels for kidney health. Continue monitoring fluid intake.";
    
    case "Heart Disease":
      return result.calories > 600
        ? "High calorie content. Consider a smaller portion or more physical activity today."
        : "Moderate calorie content supports heart health when part of balanced diet.";
    
    default:
      return "Continue following your healthcare provider's dietary recommendations.";
  }
};
