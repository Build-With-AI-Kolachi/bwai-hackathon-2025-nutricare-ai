import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, CheckCircle, Globe, LogIn, ArrowLeft, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Pricing = () => {
  const { language, setLanguage } = useLanguage();

  const content = {
    en: {
      title: "NutriCare AI",
      subtitle: "Choose Your Health Plan",
      description: "Select the perfect plan for your nutritional journey",
      signIn: "Sign In",
      getStarted: "Get Started",
      mostPopular: "Most Popular",
      disclaimer: "⚠️ All plans provide AI-generated suggestions for informational purposes only. Always consult healthcare professionals for medical decisions.",
      plans: [
        {
          name: "Basic",
          price: "$9.99",
          period: "/month",
          description: "Perfect for individuals starting their health journey",
          features: [
            "Up to 50 food scans per month",
            "Basic health scoring",
            "Standard food recommendations",
            "Email support",
            "Access to mobile app"
          ],
          popular: false
        },
        {
          name: "Pro",
          price: "$19.99",
          period: "/month",
          description: "Ideal for serious health management",
          features: [
            "Unlimited food scans",
            "Advanced health analytics",
            "Personalized meal planning",
            "AI chat assistant",
            "Priority email support",
            "Export health reports",
            "Multi-language support"
          ],
          popular: true
        },
        {
          name: "Family",
          price: "$29.99",
          period: "/month",
          description: "Best value for families and groups",
          features: [
            "Everything in Pro",
            "Up to 5 family members",
            "Shared meal planning",
            "Family health insights",
            "Dedicated account manager",
            "Phone support",
            "Custom dietary programs"
          ],
          popular: false
        }
      ]
    },
    ur: {
      title: "نیوٹری کیئر اے آئی",
      subtitle: "اپنا صحت پلان منتخب کریں",
      description: "اپنے غذائی سفر کے لیے بہترین پلان منتخب کریں",
      signIn: "سائن ان",
      getStarted: "شروع کریں",
      mostPopular: "سب سے مقبول",
      disclaimer: "⚠️ تمام پلانز صرف معلومات کے لیے اے آئی سے تیار کردہ تجاویز فراہم کرتے ہیں۔ طبی فیصلوں کے لیے ہمیشہ ہیلتھ کیئر پروفیشنلز سے مشورہ کریں۔",
      plans: [
        {
          name: "بنیادی",
          price: "$9.99",
          period: "/ماہ",
          description: "اپنے صحت کے سفر کا آغاز کرنے والے افراد کے لیے بہترین",
          features: [
            "ماہانہ 50 کھانے کے اسکین تک",
            "بنیادی صحت اسکورنگ",
            "معیاری کھانے کی سفارشات",
            "ای میل سپورٹ",
            "موبائل ایپ تک رسائی"
          ],
          popular: false
        },
        {
          name: "پرو",
          price: "$19.99",
          period: "/ماہ",
          description: "سنجیدہ صحت کے انتظام کے لیے مثالی",
          features: [
            "لامحدود کھانے کے اسکین",
            "ایڈوانس صحت کا تجزیہ",
            "ذاتی کھانے کی منصوبہ بندی",
            "اے آئی چیٹ اسسٹنٹ",
            "ترجیحی ای میل سپورٹ",
            "صحت رپورٹس ایکسپورٹ کریں",
            "کثیر لسانی سپورٹ"
          ],
          popular: true
        },
        {
          name: "خاندانی",
          price: "$29.99",
          period: "/ماہ",
          description: "خاندانوں اور گروپس کے لیے بہترین قیمت",
          features: [
            "پرو کی تمام خصوصیات",
            "5 خاندانی ممبران تک",
            "مشترکہ کھانے کی منصوبہ بندی",
            "خاندانی صحت کی بصیرت",
            "مخصوص اکاؤنٹ منیجر",
            "فون سپورٹ",
            "کسٹم غذائی پروگرام"
          ],
          popular: false
        }
      ]
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            {language === "en" ? "Simple, Transparent Pricing" : "آسان، شفاف قیمت"}
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {currentContent.subtitle}
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            {currentContent.description}
          </p>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-16">
            <p className="text-sm text-amber-800">
              {currentContent.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {currentContent.plans.map((plan, index) => (
              <Card key={index} className={`relative p-8 ${plan.popular ? 'ring-2 ring-blue-500 bg-white' : 'bg-white/80'} backdrop-blur-sm hover:shadow-lg transition-all`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      {currentContent.mostPopular}
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <SignedOut>
                  <SignInButton mode="modal">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                      size="lg"
                    >
                      {currentContent.getStarted}
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <Link to="/app">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                      size="lg"
                    >
                      {currentContent.getStarted}
                    </Button>
                  </Link>
                </SignedIn>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Frequently Asked Questions" : "اکثر پوچھے جانے والے سوالات"}
            </h3>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h4 className="font-semibold text-lg mb-2">
                {language === "en" ? "Is this a substitute for medical advice?" : "کیا یہ طبی مشورے کا متبادل ہے؟"}
              </h4>
              <p className="text-gray-600">
                {language === "en" 
                  ? "No, NutriCare AI provides informational suggestions only. Always consult healthcare professionals for medical decisions."
                  : "نہیں، نیوٹری کیئر اے آئی صرف معلوماتی تجاویز فراہم کرتا ہے۔ طبی فیصلوں کے لیے ہمیشہ ہیلتھ کیئر پروفیشنلز سے مشورہ کریں۔"
                }
              </p>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h4 className="font-semibold text-lg mb-2">
                {language === "en" ? "Can I cancel my subscription anytime?" : "کیا میں کسی بھی وقت اپنی سبسکرپشن منسوخ کر سکتا ہوں؟"}
              </h4>
              <p className="text-gray-600">
                {language === "en"
                  ? "Yes, you can cancel your subscription at any time. No long-term commitments required."
                  : "جی ہاں، آپ کسی بھی وقت اپنی سبسکرپشن منسوخ کر سکتے ہیں۔ کوئی طویل مدتی عہد کی ضرورت نہیں۔"
                }
              </p>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h4 className="font-semibold text-lg mb-2">
                {language === "en" ? "Is my health data secure?" : "کیا میرا صحت کا ڈیٹا محفوظ ہے؟"}
              </h4>
              <p className="text-gray-600">
                {language === "en"
                  ? "Yes, we use industry-standard encryption and follow strict privacy protocols to protect your health information."
                  : "جی ہاں، ہم آپ کی صحت کی معلومات کی حفاظت کے لیے انڈسٹری معیار کی انکرپشن اور سخت پرائیویسی پروٹوکول استعمال کرتے ہیں۔"
                }
              </p>
            </Card>
          </div>
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

export default Pricing;
