import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Camera, Brain, Shield, Star, CheckCircle, Globe, LogIn, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language, setLanguage } = useLanguage();

  const content = {
    en: {
      title: "NutriCare AI",
      subtitle: "Your AI-Powered Nutrition Guardian",
      description: "Revolutionizing health management for patients with diabetes, blood pressure, and kidney conditions through intelligent food analysis.",
      cta: "Start Your Health Journey",
      signIn: "Sign In",
      features: {
        title: "Smart Features for Better Health",
        items: [
          {
            icon: Camera,
            title: "Food Image Analysis",
            description: "Upload photos of your meals for instant nutritional breakdown and health impact assessment."
          },
          {
            icon: Brain,
            title: "AI Health Assistant",
            description: "Get personalized advice based on your medical conditions, medications, and dietary restrictions."
          },
          {
            icon: Shield,
            title: "Risk Assessment",
            description: "Identify potential health risks and receive warnings about foods that may worsen your conditions."
          }
        ]
      },
      benefits: {
        title: "Why Choose NutriCare AI?",
        items: [
          "Personalized nutrition advice based on your medical profile",
          "Real-time food analysis with health scoring",
          "Alternative food suggestions for better health outcomes",
          "Multi-language support (English & Urdu)",
          "Professional disclaimer ensures you consult healthcare providers"
        ]
      },
      testimonials: {
        title: "What Our Users Say",
        items: [
          {
            name: "Ahmed Khan",
            condition: "Type 2 Diabetes",
            quote: "NutriCare AI helps me make better food choices every day. The instant analysis is incredible!"
          },
          {
            name: "Sarah Ali",
            condition: "Hypertension",
            quote: "Finally, an app that understands my dietary restrictions and gives practical advice."
          }
        ]
      },
      disclaimer: "⚠️ Important: This application provides AI-generated nutritional suggestions for informational purposes only. Always consult with your healthcare provider or registered dietitian before making any dietary changes or medical decisions. This tool is not a substitute for professional medical advice."
    },
    ur: {
      title: "نیوٹری کیئر اے آئی",
      subtitle: "آپ کا اے آئی سے چلنے والا غذائی محافظ",
      description: "ذیابیطس، بلڈ پریشر، اور گردے کی بیماریوں کے مریضوں کے لیے ذریعے صحت کی دیکھ بھال میں انقلاب۔",
      cta: "اپنا صحت کا سفر شروع کریں",
      signIn: "سائن ان",
      features: {
        title: "بہتر صحت کے لیے ذہین خصوصیات",
        items: [
          {
            icon: Camera,
            title: "کھانے کی تصویر کا تجزیہ",
            description: "فوری غذائی تفصیلات اور صحت پر اثرات کے لیے اپنے کھانے کی تصاویر اپ لوڈ کریں۔"
          },
          {
            icon: Brain,
            title: "اے آئی صحت مشیر",
            description: "اپنی طبی حالات، ادویات، اور غذائی پابندیوں کی بنیاد پر ذاتی مشورے حاصل کریں۔"
          },
          {
            icon: Shield,
            title: "خطرے کا جائزہ",
            description: "ممکنہ صحتی خطرات کی شناخت کریں اور ایسے کھانوں کے بارے میں انتباہات حاصل کریں جو آپ کی حالت خراب کر سکتے ہیں۔"
          }
        ]
      },
      benefits: {
        title: "نیوٹری کیئر اے آئی کیوں منتخب کریں؟",
        items: [
          "آپ کے طبی پروفائل کی بنیاد پر ذاتی غذائی مشورے",
          "صحت کے اسکور کے ساتھ ریئل ٹائم کھانے کا تجزیہ",
          "بہتر صحت کے نتائج کے لیے متبادل کھانوں کی تجاویز",
          "کثیر لسانی سپورٹ (انگریزی اور اردو)",
          "پیشہ ورانہ اعلان یقینی بناتا ہے کہ آپ ہیلتھ کیئر فراہم کنندگان سے مشورہ کریں"
        ]
      },
      testimonials: {
        title: "ہمارے صارفین کیا کہتے ہیں",
        items: [
          {
            name: "احمد خان",
            condition: "ٹائپ 2 ذیابیطس",
            quote: "نیوٹری کیئر اے آئی مجھے روزانہ بہتر کھانے کے انتخاب میں مدد کرتا ہے۔ فوری تجزیہ ناقابل یقین ہے!"
          },
          {
            name: "سارہ علی",
            condition: "ہائی بلڈ پریشر",
            quote: "آخر کار، ایک ایپ جو میری غذائی پابندیوں کو سمجھتی ہے اور عملی مشورے دیتی ہے۔"
          }
        ]
      },
      disclaimer: "⚠️ اہم: یہ ایپلیکیشن صرف معلومات کے لیے اے آئی سے تیار کردہ غذائی تجاویز فراہم کرتی ہے۔ کوئی بھی غذائی تبدیلی یا طبی فیصلہ کرنے سے پہلے ہمیشہ اپنے ہیلتھ کیئر فراہم کنندہ یا رجسٹرڈ ڈائیٹیشن سے مشورہ کریں۔ یہ ٹول پیشہ ورانہ طبی مشورے کا متبادل نہیں ہے۔"
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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

              <Link to="/pricing">
                <Button variant="ghost" size="sm">
                  {language === "en" ? "Pricing" : "قیمت"}
                </Button>
              </Link>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    {currentContent.signIn}
                  </Button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <Link to="/app">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    {language === "en" ? "Go to App" : "ایپ پر جائیں"}
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              {language === "en" ? "AI-Powered Health Technology" : "اے آئی سے چلنے والی صحت ٹیکنالوجی"}
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {currentContent.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {currentContent.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                  <Heart className="h-5 w-5 mr-2" />
                  {currentContent.cta}
                </Button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <Link to="/app">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                  <Heart className="h-5 w-5 mr-2" />
                  {currentContent.cta}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </SignedIn>
            
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                {language === "en" ? "View Pricing" : "قیمت دیکھیں"}
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-4xl mx-auto">
            <p className="text-sm text-amber-800 leading-relaxed">
              {currentContent.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              {currentContent.features.title}
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {currentContent.features.items.map((feature, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-8">
                {currentContent.benefits.title}
              </h3>
              <div className="space-y-4">
                {currentContent.benefits.items.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-6">
                  {language === "en" ? "Perfect for:" : "کے لیے بہترین:"}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-blue-200" />
                    <span>{language === "en" ? "Diabetes patients" : "ذیابیطس کے مریض"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-blue-200" />
                    <span>{language === "en" ? "Hypertension management" : "ہائی بلڈ پریشر کا انتظام"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-blue-200" />
                    <span>{language === "en" ? "Kidney disease care" : "گردے کی بیماری کی دیکھ بھال"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-blue-200" />
                    <span>{language === "en" ? "General wellness" : "عمومی صحت"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              {currentContent.testimonials.title}
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {currentContent.testimonials.items.map((testimonial, index) => (
              <Card key={index} className="p-8 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.condition}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-4xl font-bold mb-6">
            {language === "en" 
              ? "Ready to Transform Your Health Journey?" 
              : "اپنے صحت کے سفر کو تبدیل کرنے کے لیے تیار ہیں؟"
            }
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            {language === "en"
              ? "Join thousands of users who are making better food choices with AI assistance."
              : "ہزاروں صارفین کے ساتھ شامل ہوں جو اے آئی کی مدد سے بہتر کھانے کے انتخاب کر رہے ہیں۔"
            }
          </p>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Heart className="h-5 w-5 mr-2" />
                {currentContent.cta}
              </Button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link to="/app">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Heart className="h-5 w-5 mr-2" />
                {language === "en" ? "Go to App" : "ایپ پر جائیں"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-2xl font-bold">{currentContent.title}</h4>
          </div>
          <p className="text-gray-400 mb-6">
            {currentContent.subtitle}
          </p>
          <p className="text-sm text-gray-500">
            {language === "en" 
              ? "© 2024 NutriCare AI. All rights reserved. Always consult healthcare professionals."
              : "© 2024 نیوٹری کیئر اے آئی۔ تمام حقوق محفوظ ہیں۔ ہمیشہ ہیلتھ کیئر پروفیشنلز سے مشورہ کریں۔"
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
