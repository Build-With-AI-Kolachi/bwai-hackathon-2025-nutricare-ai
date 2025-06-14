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

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      image: uploadedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    const currentImage = uploadedImage;
    
    setInputValue("");
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const contextInfo = analysisResult 
        ? `your food analysis of ${analysisResult.foodName}` 
        : "your health profile";
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Based on your question about "${currentInput}" and ${contextInfo}, considering your health profile (age ${medicalProfile.age}, weight ${medicalProfile.weight}kg, height ${medicalProfile.height}cm, conditions: ${medicalProfile.conditions.join(', ') || 'None'}), I recommend consulting with your healthcare provider for personalized medical advice. ${currentImage ? 'I can see the image you uploaded - this helps provide more specific guidance.' : ''}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Keep focus on input after AI response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, 2000);
  }, [inputValue, isLoading, analysisResult, medicalProfile, uploadedImage]);

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
              <p className="text-sm">{message.content}</p>
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
