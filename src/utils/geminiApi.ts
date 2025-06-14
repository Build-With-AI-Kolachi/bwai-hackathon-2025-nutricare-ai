
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MedicalData, FoodAnalysisResult } from '../pages/App';

// Use environment variable or prompt user for API key
const getApiKey = () => {
  // Try to get from localStorage first (user input)
  const userApiKey = localStorage.getItem('gemini_api_key');
  if (userApiKey) {
    return userApiKey;
  }
  
  // Fallback to hardcoded key (should be replaced with proper secret management)
  return 'AIzaSyDnwu18Zik6uHScBc7YMsNK3AYCGothsME';
};

export const generateAIResponse = async (
  userInput: string,
  medicalProfile: MedicalData,
  analysisResult?: FoodAnalysisResult,
  imageData?: string,
  language: 'en' | 'ur' = 'en'
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('No API key available');
    }

    console.log('Generating AI response for:', userInput);
    console.log('Has image:', !!imageData);
    console.log('Using API key (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Choose model based on whether we have an image
    const modelName = imageData ? 'gemini-1.5-flash' : 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemPrompt = language === 'en' 
      ? `You are a helpful AI nutrition assistant. Provide personalized nutrition advice based on the user's medical profile. Be concise, helpful, and focus on practical advice.

User's Medical Profile:
- Age: ${medicalProfile.age} years
- Weight: ${medicalProfile.weight} kg
- Height: ${medicalProfile.height} cm
- Target Calories: ${medicalProfile.targetCalories}/day
- Sodium Limit: ${medicalProfile.sodiumLimit}mg/day
- Sugar Limit: ${medicalProfile.sugarLimit}g/day
- Health Conditions: ${medicalProfile.conditions?.length ? medicalProfile.conditions.join(', ') : 'None'}
- Allergies: ${medicalProfile.allergies?.length ? medicalProfile.allergies.join(', ') : 'None'}
${analysisResult ? `- Recent Food Analysis: ${analysisResult.foodName} (${analysisResult.calories} calories, ${analysisResult.healthScore}/100 health score)` : ''}
${imageData ? '- User has uploaded an image for analysis' : ''}

${imageData ? 'Analyze the food in the uploaded image and provide personalized advice based on their medical profile.' : 'Provide advice in English.'} Keep responses under 300 words and focus on actionable recommendations.`
      : `آپ ایک مددگار اے آئی غذائی مشیر ہیں۔ صارف کے طبی پروفائل کی بنیاد پر ذاتی غذائی مشورہ فراہم کریں۔ مختصر، مددگار رہیں اور عملی مشورے پر توجہ دیں۔

صارف کا طبی پروفائل:
- عمر: ${medicalProfile.age} سال
- وزن: ${medicalProfile.weight} کلو
- قد: ${medicalProfile.height} سینٹی میٹر
- ہدف کیلوریز: ${medicalProfile.targetCalories}/دن
- سوڈیم کی حد: ${medicalProfile.sodiumLimit}mg/دن
- چینی کی حد: ${medicalProfile.sugarLimit}g/دن
- صحت کی حالات: ${medicalProfile.conditions?.length ? medicalProfile.conditions.join(', ') : 'کوئی نہیں'}
- الرجی: ${medicalProfile.allergies?.length ? medicalProfile.allergies.join(', ') : 'کوئی نہیں'}
${analysisResult ? `- حالیہ کھانے کا تجزیہ: ${analysisResult.foodName} (${analysisResult.calories} کیلوریز، ${analysisResult.healthScore}/100 صحت کا اسکور)` : ''}
${imageData ? '- صارف نے تجزیے کے لیے ایک تصویر اپ لوڈ کی ہے' : ''}

${imageData ? 'اپ لوڈ کی گئی تصویر میں موجود کھانے کا تجزیہ کریں اور ان کے طبی پروفائل کی بنیاد پر ذاتی مشورہ فراہم کریں۔' : 'اردو میں مشورہ فراہم کریں۔'} جوابات 300 الفاظ سے کم رکھیں اور قابل عمل سفارشات پر توجہ دیں۔`;

    console.log('Sending request to Gemini...');
    
    let result;
    if (imageData) {
      // Ensure proper image format for Gemini
      let imageBase64 = imageData;
      let mimeType = "image/jpeg";
      
      // Handle data URL format
      if (imageData.startsWith('data:')) {
        const [header, base64] = imageData.split(',');
        imageBase64 = base64;
        
        // Determine MIME type from header
        if (header.includes('image/png')) {
          mimeType = "image/png";
        } else if (header.includes('image/webp')) {
          mimeType = "image/webp";
        } else if (header.includes('image/gif')) {
          mimeType = "image/gif";
        }
      }
      
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      };
      
      console.log('Sending image with MIME type:', mimeType);
      
      result = await model.generateContent([
        systemPrompt + "\n\nUser Question: " + userInput,
        imagePart
      ]);
    } else {
      result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${userInput}`);
    }
    
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini:', text.substring(0, 200) + '...');
    return text;
  } catch (error) {
    console.error('Gemini API Error Details:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's an API key issue
    if (error instanceof Error && (error.message.includes('API key') || error.message.includes('unauthorized'))) {
      const fallbackResponse = language === 'en' 
        ? `API key issue detected. Please check your Gemini API key configuration. The system is currently unable to connect to the AI service.

For immediate help with your question "${userInput}", here's general advice:

For sodium reduction (your limit: ${medicalProfile.sodiumLimit}mg/day):
• Cook at home using fresh herbs and spices
• Read nutrition labels - look for <140mg per serving
• Choose fresh vegetables over canned

Please verify your API key and try again.`
        : `API key کا مسئلہ ہے۔ برائے کرم اپنی Gemini API key کی configuration چیک کریں۔

آپ کے سوال "${userInput}" کے لیے عمومی مشورہ:

سوڈیم کمی کے لیے (آپ کی حد: ${medicalProfile.sodiumLimit}mg/دن):
• گھر میں تازہ جڑی بوٹیوں کا استعمال کریں
• غذائی لیبل پڑھیں

برائے کرم اپنی API key چیک کرکے دوبارہ کوشش کریں۔`;
      
      return fallbackResponse;
    }
    
    // Provide a fallback response with useful information
    const fallbackResponse = language === 'en' 
      ? `Connection issue detected. While I'm having connectivity problems, here's some general advice for "${userInput}":

For sodium reduction (your limit: ${medicalProfile.sodiumLimit}mg/day):
• Cook at home using fresh herbs and spices
• Read nutrition labels - look for <140mg per serving
• Choose fresh vegetables over canned
• Limit processed and restaurant foods
• Use lemon, garlic, and herbs for flavor

${medicalProfile.conditions?.some(c => c.toLowerCase().includes('pressure')) ? 'This is especially important for blood pressure management.' : ''}

Please try your question again in a moment.`
      : `کنکٹیویٹی کا مسئلہ ہے۔ "${userInput}" کے لیے عمومی مشورہ:

سوڈیم کمی کے لیے (آپ کی حد: ${medicalProfile.sodiumLimit}mg/دن):
• گھر میں تازہ جڑی بوٹیوں کا استعمال کریں
• غذائی لیبل پڑھیں
• تازہ سبزیاں منتخب کریں

برائے کرم ایک لمحے میں دوبارہ کوشش کریں۔`;

    return fallbackResponse;
  }
};
