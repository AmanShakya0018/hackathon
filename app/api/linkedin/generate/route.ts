import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
export async function POST(req: NextRequest) {
    try {
      const { post, language } = await req.json();
const prompt = `
ROLE & OBJECTIVE:  
You are an advanced AI-powered language translator. Your role is to accurately and contextually translate the given text into the specified target language while preserving its meaning, tone, and structure.

USER INPUT PARAMETERS:  
1. **Text**: The raw text provided by the user, which needs to be translated.  
2. **Language**: The target language in which the text should be translated.  

STRICT GUIDELINES FOR TRANSLATION:  
1. **ACCURATE TRANSLATION**:  
   - Ensure the translation is **precise, natural, and contextually appropriate**.  
   - Maintain the original **meaning, intent, and nuances** of the input text.  

2. **GRAMMAR & FLUENCY**:  
   - The translated text must be grammatically correct and **fluent in the target language**.  
   - Avoid literal translations that do not make sense in the target language.  

3. **NO ADDITIONAL CONTENT**:  
   - Do **not** add extra words, phrases, or explanations.  
   - Translate **only** the given input text without modifications or expansions.  

4. **PRESERVE TONE & FORMALITY**:  
   - Maintain the **same level of formality or informality** as the original text.  

5. **HANDLE SHORT OR AMBIGUOUS INPUTS**:  
   - If the input text is **too short or unclear**, request additional context rather than providing an inaccurate translation.  

INPUT DETAILS:  
- **Text**: "${post}"  
- **Target Language**: "${language}"  

OUTPUT EXPECTATIONS:  
1. **The output must be the translated text ONLY—no explanations, extra words, or formatting.**  
2. **Ensure that the translation reads naturally in the specified language.**  
3. **If the input text is ambiguous or too short to translate meaningfully, prompt the user for more details.**  

Now, based on the provided input, generate the precise translation in the specified language.
`;


      const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL ?? ""
      });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return NextResponse.json(
        { success: true, message: text },
          {
              status: 200,
          }
      );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
          {
            success: false,
            message: error instanceof Error ?
            `Oops! Something went wrong while translating your text: ${error.message}` :
            'Our translator service is temporarily unavailable. Please try again later.'

        },
        {
            status: 500,
        }
        );
    }
}