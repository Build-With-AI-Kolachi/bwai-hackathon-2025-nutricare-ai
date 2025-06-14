
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { MedicalData } from "../pages/App";
import { useLanguage } from "../contexts/LanguageContext";

interface MedicalProfileProps {
  onComplete: (profile: MedicalData) => void;
}

export const MedicalProfile = ({ onComplete }: MedicalProfileProps) => {
  const { language } = useLanguage();
  const [conditions, setConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [sodiumLimit, setSodiumLimit] = useState(2300);
  const [sugarLimit, setSugarLimit] = useState(50);
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const content = {
    en: {
      healthConditions: "Health Conditions",
      foodAllergies: "Food Allergies",
      dietaryPreferences: "Dietary Preferences",
      dailyTargets: "Daily Targets",
      personalInfo: "Personal Information",
      targetCalories: "Target Calories",
      sodiumLimit: "Sodium Limit (mg)",
      sugarLimit: "Sugar Limit (g)",
      age: "Age (years)",
      weight: "Weight (kg)",
      height: "Height (cm)",
      saveProfile: "Save Profile & Continue"
    },
    ur: {
      healthConditions: "صحت کی حالت",
      foodAllergies: "کھانے کی الرجی",
      dietaryPreferences: "غذائی ترجیحات",
      dailyTargets: "روزانہ اہداف",
      personalInfo: "ذاتی معلومات",
      targetCalories: "ہدف کیلوریز",
      sodiumLimit: "سوڈیم کی حد (mg)",
      sugarLimit: "چینی کی حد (g)",
      age: "عمر (سال)",
      weight: "وزن (kg)",
      height: "قد (cm)",
      saveProfile: "پروفائل محفوظ کریں اور جاری رکھیں"
    }
  };

  const currentContent = content[language];

  const commonConditions = [
    "Type 1 Diabetes",
    "Type 2 Diabetes", 
    "High Blood Pressure",
    "Kidney Disease",
    "Heart Disease",
    "High Cholesterol",
    "Obesity"
  ];

  const commonAllergies = [
    "Nuts",
    "Dairy",
    "Gluten",
    "Shellfish",
    "Eggs",
    "Soy"
  ];

  const commonRestrictions = [
    "Vegetarian",
    "Vegan",
    "Low Sodium",
    "Low Sugar",
    "Low Carb",
    "Halal",
    "Kosher"
  ];

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setConditions([...conditions, condition]);
    } else {
      setConditions(conditions.filter(c => c !== condition));
    }
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    if (checked) {
      setAllergies([...allergies, allergy]);
    } else {
      setAllergies(allergies.filter(a => a !== allergy));
    }
  };

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    if (checked) {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    } else {
      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile: MedicalData = {
      conditions,
      medications,
      allergies,
      dietaryRestrictions,
      targetCalories,
      sodiumLimit,
      sugarLimit,
      age,
      weight,
      height
    };

    onComplete(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{currentContent.personalInfo}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age">{currentContent.age}</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min="1"
              max="120"
            />
          </div>
          <div>
            <Label htmlFor="weight">{currentContent.weight}</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min="20"
              max="300"
              step="0.1"
            />
          </div>
          <div>
            <Label htmlFor="height">{currentContent.height}</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="50"
              max="250"
            />
          </div>
        </div>
      </Card>

      {/* Health Conditions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{currentContent.healthConditions}</h3>
        <div className="grid grid-cols-2 gap-4">
          {commonConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={conditions.includes(condition)}
                onCheckedChange={(checked) => 
                  handleConditionChange(condition, checked as boolean)
                }
              />
              <Label htmlFor={condition} className="text-sm font-medium">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Allergies */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{currentContent.foodAllergies}</h3>
        <div className="grid grid-cols-3 gap-4">
          {commonAllergies.map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={allergy}
                checked={allergies.includes(allergy)}
                onCheckedChange={(checked) => 
                  handleAllergyChange(allergy, checked as boolean)
                }
              />
              <Label htmlFor={allergy} className="text-sm font-medium">
                {allergy}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Dietary Restrictions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{currentContent.dietaryPreferences}</h3>
        <div className="grid grid-cols-2 gap-4">
          {commonRestrictions.map((restriction) => (
            <div key={restriction} className="flex items-center space-x-2">
              <Checkbox
                id={restriction}
                checked={dietaryRestrictions.includes(restriction)}
                onCheckedChange={(checked) => 
                  handleRestrictionChange(restriction, checked as boolean)
                }
              />
              <Label htmlFor={restriction} className="text-sm font-medium">
                {restriction}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Targets */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{currentContent.dailyTargets}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="calories">{currentContent.targetCalories}</Label>
            <Input
              id="calories"
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              min="1000"
              max="4000"
            />
          </div>
          <div>
            <Label htmlFor="sodium">{currentContent.sodiumLimit}</Label>
            <Input
              id="sodium"
              type="number"
              value={sodiumLimit}
              onChange={(e) => setSodiumLimit(Number(e.target.value))}
              min="1000"
              max="5000"
            />
          </div>
          <div>
            <Label htmlFor="sugar">{currentContent.sugarLimit}</Label>
            <Input
              id="sugar"
              type="number"
              value={sugarLimit}
              onChange={(e) => setSugarLimit(Number(e.target.value))}
              min="10"
              max="100"
            />
          </div>
        </div>
      </Card>

      <Button type="submit" className="w-full" size="lg">
        {currentContent.saveProfile}
      </Button>
    </form>
  );
};
