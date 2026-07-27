import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Initialize the new Google Gen AI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the exact list of villages to prevent LLM hallucinations
const MASTER_VILLAGES = [
  "Agiaon Bazar", "Piro", "Garhani", "Charpokhari", "Tarari",
  "Sahar", "Brahmpur", "Shahpur", "Behea", "Jagdispur", "Arrah",
  "Bihia", "Sandesh", "Udwantnagar", "Koilwar", "Barhara"
];

export async function POST(request: Request) {
  try {
    console.log("Received request for Grinding Ledger OCR extraction");

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file uploaded' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Pre-process image with sharp for enhanced handwritten text contrast
    const processedBuffer = await sharp(imageBuffer)
      .rotate()
      .normalize()
      .sharpen()
      .jpeg({ quality: 92 })
      .toBuffer();

    const base64Data = processedBuffer.toString('base64');

    // Prompt specifically tailored for Grinding Ledger
    const prompt = `You are a high-precision OCR engine for Indian grinding mill (Atta/Flour/Mustard Oil mill) handwritten customer register sheets.
Extract all handwritten rows from this grinding ledger page into a structured JSON list.

MASTER VILLAGES (Strict Match):
${MASTER_VILLAGES.join(', ')}

RULES:
1. Extract serial number (sn / serialNo) as an integer.
2. Extract customer name in English transliteration (customerNameEn) and original Hindi text (customerNameHi).
3. Map village abbreviations or Hindi shortcuts (e.g., "आ०", "आ० बाजार", "A.Bazar") to the closest Master Village entry for villageEn and written Hindi for villageHi.
4. Extract weight as a clean numeric decimal (e.g., 10.5, 25.0, 50.0). If unit is in kg or quintal, extract pure numeric value.
5. Provide confidence score as HIGH, MEDIUM, or LOW based on legibility.
6. Provide normalized bounding box coordinates box_2d [ymin, xmin, ymax, xmax] from 0 to 1000 for each row.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        },
        prompt,
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            data: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  serialNo: { type: 'INTEGER' },
                  customerNameEn: { type: 'STRING' },
                  customerNameHi: { type: 'STRING' },
                  villageEn: { type: 'STRING' },
                  villageHi: { type: 'STRING' },
                  weight: { type: 'NUMBER' },
                  confidence: {
                    type: 'STRING',
                    enum: ['HIGH', 'MEDIUM', 'LOW'],
                  },
                  box_2d: {
                    type: 'ARRAY',
                    items: { type: 'INTEGER' },
                    description: '[ymin, xmin, ymax, xmax] 0-1000 normalized coordinates',
                  },
                },
                required: [
                  'serialNo',
                  'customerNameEn',
                  'customerNameHi',
                  'villageEn',
                  'villageHi',
                  'weight',
                  'confidence',
                  'box_2d',
                ],
              },
            },
          },
          required: ['data'],
        },
      },
    });

    const resultText = response.text || '{"data": []}';
    const parsedData = JSON.parse(resultText);

    // Format records with both standard keys and backwards compatible OCR keys
    const formattedRecords = (parsedData.data || []).map((item: any, idx: number) => ({
      serialNo: item.serialNo || item.sn || idx + 1,
      sn: item.serialNo || item.sn || idx + 1,
      customerNameEn: item.customerNameEn || item.name_english || 'Unknown',
      name_english: item.customerNameEn || item.name_english || 'Unknown',
      customerNameHi: item.customerNameHi || item.name_hindi || 'अज्ञात',
      name_hindi: item.customerNameHi || item.name_hindi || 'अज्ञात',
      villageEn: item.villageEn || item.village_english || 'Unknown',
      village_english: item.villageEn || item.village_english || 'Unknown',
      villageHi: item.villageHi || item.village_hindi || 'अज्ञात',
      village_hindi: item.villageHi || item.village_hindi || 'अज्ञात',
      weight: typeof item.weight === 'number' ? item.weight : Number(item.weight) || 0,
      confidence: item.confidence || 'HIGH',
      box_2d: item.box_2d || [0, 0, 0, 0],
    }));

    return NextResponse.json({
      success: true,
      records: formattedRecords,
      enhancedImage: `data:image/jpeg;base64,${base64Data}`,
    });
  } catch (error: any) {
    console.error('Grinding Ledger OCR API Failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error occurred during OCR extraction',
      },
      { status: 500 }
    );
  }
}
