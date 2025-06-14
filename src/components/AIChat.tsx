import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Send, Bot, User, Maximize2, Upload, X } from "lucide-react";
import { MedicalData, FoodAnalysisResult } from "../pages/App";
import { useLanguage } from "../contexts/LanguageContext";

interface AIChatProps {
  medicalProfile: MedicalData;
  analysisResult?: FoodAnalysisResult;
  className?: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  image?: string;
  timestamp: Date;
}

export const AIChat = ({ medicalProfile, analysisResult, className = "" }: AIChatProps) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = {
    en: {
      title: "AI Nutrition Assistant",
      placeholder: "Ask about nutrition, health risks, or get personalized advice...",
      send: "Send",
      thinking: "AI is thinking...",
      fullscreen: "Open Fullscreen Chat",
      uploadImage: "Upload Image",
      predefinedQuestions: [
        "What are healthy meal alternatives for my condition?",
        "How can I reduce sodium in my diet?",
        "What foods should I avoid with my health profile?",
        "Give me a personalized meal plan for today"
      ]
    },
    ur: {
      title: "اے آئی غذائی مشیر",
      placeholder: "غذائیت، صحت کے خطرات، یا ذاتی مشورے کے بارے میں پوچھیں...",
      send: "بھیجیں",
      thinking: "اے آئی سوچ رہا ہے...",
      fullscreen: "فل اسکرین چیٹ کھولیں",
      uploadImage: "تصویر اپ لوڈ کریں",
      predefinedQuestions: [
        "میری حالت کے لیے صحت مند کھانے کے متبادل کیا ہیں؟",
        "میں اپنی خوراک میں سوڈیم کیسے کم کروں؟",
        "میرے صحت پروفائل کے ساتھ مجھے کون سے کھانے سے بچنا چاہیے؟",
        "آج کے لیے مجھے ذاتی کھانے کا منصوبہ دیں"
      ]
    }
  };

  const currentContent = content[language];

  // Generate intelligent AI responses based on user input and medical profile
  const generateAIResponse = (userInput: string, hasImage: boolean): string => {
    const input = userInput.toLowerCase();
    const conditions = medicalProfile.conditions;
    const hasConditions = conditions && conditions.length > 0;
    
    // Responses based on common nutrition questions
    if (input.includes('meal plan') || input.includes('diet plan')) {
      const bmi = medicalProfile.weight / Math.pow(medicalProfile.height / 100, 2);
      const calories = medicalProfile.targetCalories;
      return `Based on your profile (BMI: ${bmi.toFixed(1)}, Target: ${calories} calories/day), here's a personalized meal plan:

**Breakfast:** Oatmeal with berries and nuts (300 cal)
**Lunch:** Grilled chicken salad with olive oil dressing (400 cal)
**Dinner:** Baked salmon with steamed vegetables (450 cal)
**Snacks:** Greek yogurt and apple slices (150 cal)

${hasConditions ? `Considering your conditions (${conditions.join(', ')}), focus on anti-inflammatory foods and limit processed items.` : 'This balanced approach supports your health goals.'}`;
    }

    if (input.includes('sodium') || input.includes('salt')) {
      return `To reduce sodium in your diet (current limit: ${medicalProfile.sodiumLimit}mg/day):

• Cook at home using fresh herbs and spices instead of salt
• Read nutrition labels - aim for <140mg sodium per serving
• Choose fresh fruits and vegetables over canned versions
• Limit processed foods, deli meats, and restaurant meals
• Use lemon juice, garlic, and herbs for flavor

${hasConditions && conditions.some(c => c.toLowerCase().includes('pressure')) ? 'This is especially important for managing blood pressure.' : ''}`;
    }

    if (input.includes('sugar') || input.includes('sweet')) {
      return `Managing sugar intake (your limit: ${medicalProfile.sugarLimit}g/day):

• Replace sugary drinks with water, herbal tea, or sparkling water
• Choose whole fruits over fruit juices
• Read labels for hidden sugars (high fructose corn syrup, sucrose)
• Use natural sweeteners like stevia or monk fruit
• Focus on complex carbohydrates over simple sugars

${hasConditions && conditions.some(c => c.toLowerCase().includes('diabetes')) ? 'Blood sugar control is crucial for diabetes management.' : ''}`;
    }

    if (input.includes('weight') || input.includes('lose') || input.includes('gain')) {
      const bmi = medicalProfile.weight / Math.pow(medicalProfile.height / 100, 2);
      const status = bmi < 18.5 ? 'underweight' : bmi > 25 ? 'overweight' : 'normal weight';
      
      return `Based on your current BMI of ${bmi.toFixed(1)} (${status}):

• Create a moderate calorie deficit/surplus of 300-500 calories daily
• Focus on protein (1g per kg body weight minimum)
• Include strength training to preserve muscle mass
• Stay hydrated and get adequate sleep
• Track progress with measurements, not just weight

Your target calories (${medicalProfile.targetCalories}/day) should support healthy ${bmi > 25 ? 'weight loss' : bmi < 18.5 ? 'weight gain' : 'weight maintenance'}.`;
    }

    if (input.includes('avoid') || input.includes('bad')) {
      let avoidFoods = ['Highly processed foods', 'Trans fats', 'Excessive refined sugar', 'High sodium processed meats'];
      
      if (hasConditions) {
        if (conditions.some(c => c.toLowerCase().includes('diabetes'))) {
          avoidFoods.push('Sugary beverages', 'White bread and refined grains');
        }
        if (conditions.some(c => c.toLowerCase().includes('pressure'))) {
          avoidFoods.push('Canned soups', 'Pickled foods', 'Excessive caffeine');
        }
        if (conditions.some(c => c.toLowerCase().includes('heart'))) {
          avoidFoods.push('Saturated fats', 'Fried foods');
        }
      }

      return `Foods to limit or avoid with your health profile:

${avoidFoods.map(food => `• ${food}`).join('\n')}

${medicalProfile.allergies?.length > 0 ? `\nAlso avoid your known allergens: ${medicalProfile.allergies.join(', ')}` : ''}

Focus on whole, unprocessed foods that support your health goals.`;
    }

    if (input.includes('healthy') || input.includes('good') || input.includes('alternative')) {
      return `Healthy food recommendations for your profile:

**Proteins:** Lean chicken, fish, legumes, Greek yogurt
**Carbs:** Quinoa, brown rice, sweet potatoes, oats
**Fats:** Avocado, nuts, olive oil, fatty fish
**Vegetables:** Leafy greens, colorful bell peppers, broccoli
**Fruits:** Berries, apples, citrus fruits

${hasConditions ? `These choices support managing ${conditions.join(' and ')}.` : 'These nutrient-dense options support overall health.'}

${hasImage ? 'I can see you\'ve uploaded an image - this helps me provide more specific guidance!' : ''}`;
    }

    if (input.includes('exercise') || input.includes('workout')) {
      const age = medicalProfile.age;
      return `Exercise recommendations for your age (${age}) and health profile:

**Cardio:** 150 minutes moderate intensity per week
**Strength:** 2-3 sessions targeting major muscle groups
**Flexibility:** Daily stretching or yoga
**Balance:** Especially important if over 65

Start gradually and increase intensity slowly. ${hasConditions ? 'Consult your healthcare provider before starting new exercise programs.' : 'Listen to your body and rest when needed.'}`;
    }

    // Default personalized response
    return `Thank you for your question about "${userInput}". Based on your health profile:

• Age: ${medicalProfile.age} years
• Target calories: ${medicalProfile.targetCalories}/day
• Sodium limit: ${medicalProfile.sodiumLimit}mg/day
• Current conditions: ${hasConditions ? conditions.join(', ') : 'None reported'}

${hasImage ? 'I can see the image you uploaded. ' : ''}For personalized nutrition advice tailored to your specific situation, I recommend focusing on whole foods, staying within your calorie and sodium targets, and maintaining a balanced approach to nutrition.

${analysisResult ? `Based on your recent food analysis of ${analysisResult.foodName}, ` : ''}Would you like specific recommendations for meal planning, food alternatives, or nutritional strategies?`;
  };

  // Focus input on mount and keep it focused
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handlePredefinedQuestion = useCallback((question: string) => {
    setInputValue(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const currentInput = inputValue.trim();
    const currentImage = uploadedImage;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput,
      image: currentImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Clear input immediately to prevent focus issues
    setInputValue("");
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    // Generate AI response after a realistic delay
    setTimeout(() => {
      const aiResponseContent = generateAIResponse(currentInput, !!currentImage);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Keep focus on input after AI response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, 1500);
  }, [inputValue, isLoading, uploadedImage, medicalProfile, analysisResult]);

  const ChatContent = ({ isFullscreen = false }: { isFullscreen?: boolean }) => (
    <div className={`flex flex-col ${isFullscreen ? 'h-[80vh]' : 'h-96'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          {currentContent.title}
        </h3>
        {!isFullscreen && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>{currentContent.fullscreen}</SheetTitle>
              </SheetHeader>
              <ChatContent isFullscreen={true} />
            </SheetContent>
          </Sheet>
        )}
      </div>
      
      {/* Predefined Questions */}
      {messages.length === 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-sm text-gray-600 mb-2">
            {language === "en" ? "Quick questions:" : "فوری سوالات:"}
          </p>
          <div className="grid gap-2">
            {currentContent.predefinedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-2 text-xs"
                onClick={() => handlePredefinedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">
              {language === "en" 
                ? "Start a conversation about nutrition and health" 
                : "غذائیت اور صحت کے بارے میں بات چیت شروع کریں"
              }
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {message.image && (
                <img 
                  src={message.image} 
                  alt="User uploaded" 
                  className="w-full max-w-xs h-32 object-cover rounded mb-2"
                />
              )}
              <div className="text-sm whitespace-pre-line">{message.content}</div>
            </div>
            
            {message.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-green-600" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-600">{currentContent.thinking}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Image Preview */}
      {uploadedImage && (
        <div className="mb-3 relative inline-block">
          <img 
            src={uploadedImage} 
            alt="Upload preview" 
            className="h-16 w-16 object-cover rounded border"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={currentContent.placeholder}
            disabled={isLoading}
            className="flex-1"
            autoComplete="off"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">{currentContent.uploadImage}</span>
          </Button>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !inputValue.trim()}
          size="sm"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">{currentContent.send}</span>
        </Button>
      </form>
    </div>
  );

  return (
    <Card className={`p-6 ${className}`}>
      <ChatContent />
    </Card>
  );
};
