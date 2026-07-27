import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

// Initialize the new Google Gen AI SDK
// Automatically uses process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
}); 

// Define the exact list of villages to prevent LLM hallucinations
const MASTER_VILLAGES = [
  "Agiaon Bazar", "Piro", "Garhani", "Charpokhari", "Tarari",
  "Sahar", "Brahmpur", "Shahpur", "Behea", "Jagdispur"
  // Add all 30 villages here...
];

export async function POST(request: Request) {
  try {
    console.log("Received request for handwritten register extraction");
    // 1. Read the FormData from the incoming request
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file uploaded' }, 
        { status: 400 }
      );
    }

    // 2. Convert File to a Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // 3. Pre-process the image with sharp for better OCR readability
    const processedBuffer = await sharp(imageBuffer)
      .rotate()       // Auto-orient based on EXIF
      .normalize()    // Boost contrast for faint ink
      .sharpen()      // Crisp up handwritten pen strokes
      .jpeg({ quality: 90 })
      .toBuffer();

    const base64Data = processedBuffer.toString('base64');

    // 4. Define the prompt with strict rules
    const prompt = `You are a high-precision OCR engine for Indian handwritten register sheets.
Extract all handwritten rows from this register page.

MASTER VILLAGES (Strict Match):
${MASTER_VILLAGES.join(', ')}

RULES:
1. Map village shortcuts (e.g., "आ०", "आ० बाजार", "A.Bazar") to the exact Master Village entry.
2. Weight must be a clean numeric decimal (e.g., 10.6).
3. Provide normalized bounding box coordinates box_2d [ymin, xmin, ymax, xmax] from 0 to 1000 for each row.`;

    // 5. Call Gemini 2.5 Flash using the SDK
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { 
          inlineData: { 
            data: base64Data, 
            mimeType: 'image/jpeg' 
          } 
        },
        prompt
      ],
      config: {
        // Enforce pure JSON output to prevent markdown formatting
        responseMimeType: 'application/json',
        // Define the strict JSON schema the model must follow
        responseSchema: {
          type: 'OBJECT',
          properties: {
            data: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  sn: { type: 'INTEGER' },
                  name_english: { type: 'STRING' },
                  name_hindi: { type: 'STRING' },
                  village_english: { type: 'STRING' },
                  village_hindi: { type: 'STRING' },
                  weight: { type: 'NUMBER' },
                  confidence: { 
                    type: 'STRING', 
                    enum: ["HIGH", "MEDIUM", "LOW"] 
                  },
                  box_2d: {
                    type: 'ARRAY',
                    items: { type: 'INTEGER' },
                    description: "[ymin, xmin, ymax, xmax] 0-1000 normalized coordinates"
                  }
                },
                required: ["sn", "name_english", "name_hindi", "village_english", "village_hindi", "weight", "confidence", "box_2d"],
              }
            }
          },
          required: ["data"]
        }
      }
    });

    // 6. Parse the LLM output securely
    const resultText = response.text || '{"data": []}';
    const parsedData = JSON.parse(resultText);

    // 7. Return the data to the client
    return NextResponse.json({
      success: true,
      records: parsedData.data,
      enhancedImage: `data:image/jpeg;base64,${base64Data}`
    });

  } catch (error: any) {
    console.error("API Extraction Failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error occurred during extraction' },
      { status: 500 }
    );
  }
}