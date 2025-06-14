import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { MedicalProfile } from "../components/MedicalProfile";
import { FoodAnalysis } from "../components/FoodAnalysis";
import { HealthScore } from "../components/HealthScore";
import { AlternativeSuggestions } from "../components/AlternativeSuggestions";
import { AIChat } from "../components/AIChat";
import { Button } from "../components/ui/button";
import { Camera, Heart, Shield, ArrowLeft, Globe, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export interface MedicalData {
  conditions: string[];
  medications: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  targetCalories: number;
  sodiumLimit: number;
  sugarLimit: number;
  age: number;
  weight: number;
  height: number;
}

export interface FoodAnalysisResult {
  foodName: string;
  calories: number;
  sodium: number;
  sugar: number;
  carbs: number;
  protein: number;
  fiber: number;
  healthScore: number;
  risks: string[];
  warnings: string[];
}

const AppPage = () => {
  const { language, setLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState<"profile" | "analysis">("profile");
  const [medicalProfile, setMedicalProfile] = useState<MedicalData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleProfileComplete = (profile: MedicalData) => {
    setMedicalProfile(profile);
    setCurrentStep("analysis");
  };

  const handleAnalysisComplete = (result: FoodAnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    setUploadedImage(imageUrl);
    setShowChat(true);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setUploadedImage(null);
    setShowChat(false);
  };

  const content = {
    en: {
      title: "NutriCare AI",
      subtitle: "Your AI-Powered Nutrition Guardian",
      setupProfile: "Set Up Your Health Profile",
      setupDesc: "Tell us about your health conditions and dietary needs so we can provide personalized nutrition advice for every meal.",
      analyzeFood: "Analyze Your Food",
      analyzeDesc: "Upload a photo of your meal and get instant health insights tailored to your medical conditions.",
      editProfile: "Edit Health Profile",
      analyzeNew: "Analyze New Food",
      yourFood: "Your Food",
      signIn: "Sign In",
      disclaimer: "⚠️ This application provides AI-generated nutritional suggestions for informational purposes only. Always consult with your healthcare provider before making any dietary changes or medical decisions."
    },
    ur: {
      title: "نیوٹری کیئر اے آئی",
      subtitle: "آپ کا اے آئی سے چلنے والا غذائی محافظ",
      setupProfile: "اپنا صحت پروفائل سیٹ اپ کریں",
      setupDesc: "اپنی صحت کی حالت اور غذائی ضروریات کے بارے میں بتائیں تاکہ ہم ہر کھانے کے لیے ذاتی غذائی مشورے فراہم کر سکیں۔",
      analyzeFood: "اپنا کھانا تجزیہ کریں",
      analyzeDesc: "اپنے کھانے کی تصویر اپ لوڈ کریں اور اپنی طبی حالات کے مطابق فوری صحت کی بصیرت حاصل کریں۔",
      editProfile: "صحت پروفائل میں تبدیلی",
      analyzeNew: "نیا کھانا تجزیہ کریں",
      yourFood: "آپ کا کھانا",
      signIn: "سائن ان",
      disclaimer: "⚠️ یہ ایپلیکیشن صرف معلومات کے لیے اے آئی سے تیار کردہ غذائی تجاویز فراہم کرتی ہے۔ کوئی بھی غذائی تبدیلی یا طبی فیصلہ کرنے سے پہلے ہمیشہ اپنے ہیلتھ کیئر فراہم کنندہ سے مشورہ کریں۔"
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === "en" ? "Back" : "واپس"}
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {currentContent.title}
                  </h1>
                  <p className="text-sm text-gray-600">{currentContent.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "ur" : "en")}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === "en" ? "اردو" : "English"}
              </Button>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    {currentContent.signIn}
                  </Button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <p className="text-sm text-amber-800 text-center">
            {currentContent.disclaimer}
          </p>
        </div>
      </div>

      <SignedOut>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6 max-w-md">
            <Shield className="h-20 w-20 text-blue-600 mx-auto" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === "en" ? "Sign In Required" : "سائن ان کی ضرورت"}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {language === "en" 
                  ? "Please sign in to access your personalized nutrition analysis" 
                  : "اپنے ذاتی غذائی تجزیے تک رسائی کے لیے براہ کرم سائن ان کریں"
                }
              </p>
              <SignInButton mode="modal">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <LogIn className="h-5 w-5 mr-2" />
                  {currentContent.signIn}
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {currentStep === "profile" ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentContent.setupProfile}
                </h2>
                <p className="text-lg text-gray-600">
                  {currentContent.setupDesc}
                </p>
              </div>
              <MedicalProfile onComplete={handleProfileComplete} />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("profile")}
                >
                  {currentContent.editProfile}
                </Button>
                {analysisResult && (
                  <Button onClick={resetAnalysis} variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    {currentContent.analyzeNew}
                  </Button>
                )}
              </div>

              {!analysisResult ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Food Analysis Section */}
                  <div>
                    <div className="text-center mb-8">
                      <Camera className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {currentContent.analyzeFood}
                      </h2>
                      <p className="text-lg text-gray-600">
                        {currentContent.analyzeDesc}
                      </p>
                    </div>
                    <FoodAnalysis 
                      medicalProfile={medicalProfile!} 
                      onAnalysisComplete={handleAnalysisComplete}
                    />
                  </div>

                  {/* AI Chat Section */}
                  <div>
                    <AIChat 
                      medicalProfile={medicalProfile!}
                      className="h-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Food Image and Basic Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border p-6 mb-6">
                      <h3 className="text-lg font-semibold mb-4">{currentContent.yourFood}</h3>
                      {uploadedImage && (
                        <img 
                          src={uploadedImage} 
                          alt="Analyzed food" 
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {analysisResult.foodName}
                      </h4>
                      
                      {/* Nutrition Facts */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Calories</span>
                          <span className="font-medium">{analysisResult.calories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sodium</span>
                          <span className="font-medium">{analysisResult.sodium}mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sugar</span>
                          <span className="font-medium">{analysisResult.sugar}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Carbs</span>
                          <span className="font-medium">{analysisResult.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Protein</span>
                          <span className="font-medium">{analysisResult.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fiber</span>
                          <span className="font-medium">{analysisResult.fiber}g</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Chat Integration */}
                    {showChat && (
                      <AIChat 
                        medicalProfile={medicalProfile!} 
                        analysisResult={analysisResult}
                      />
                    )}
                  </div>

                  {/* Health Score and Analysis */}
                  <div className="lg:col-span-2 space-y-6">
                    <HealthScore 
                      result={analysisResult} 
                      medicalProfile={medicalProfile!}
                    />
                    <AlternativeSuggestions 
                      currentFood={analysisResult}
                      medicalProfile={medicalProfile!}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </SignedIn>
    </div>
  );
};

export default AppPage;
