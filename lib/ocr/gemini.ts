import { GoogleGenAI, Type } from '@google/genai';
import { VILLAGE_REFERENCE } from './villages';

export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
}

export interface ExtractedRow {
    serialNo: number;
    customerNameEn: string;
    customerNameHi: string;
    villageEn: string;
    villageHi: string;
    weight: number;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    box_2d: number[];
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_CASCADE = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
];

const SYSTEM_INSTRUCTION = `You are a high-precision OCR engine specialized for Indian handwritten grinding mill (Atta Chakki / Flour Mill / Mustard Oil Mill) customer register pages.

TASK: Extract every handwritten row from this ledger page into structured JSON.

CRITICAL RULES — READ CAREFULLY:
1. SERIAL NUMBER (serialNo): Read the row number exactly as written. It is always an integer (1, 2, 3...).

2. CUSTOMER NAME:
   - "customerNameEn": Transliterate the Hindi handwritten name into English (Roman script). Example: "राम प्रसाद" → "Ram Prasad".
   - "customerNameHi": Write the original Hindi text exactly as it appears in the handwriting.
   - DO NOT guess or invent names. If truly unreadable, write "अस्पष्ट" (Hindi) / "Unclear" (English).

3. VILLAGE NAME — THIS IS THE MOST IMPORTANT FIELD:
   You MUST map the village to one of the MASTER VILLAGE entries below. Handwriting often uses abbreviations, shortcuts (like "अ०" for "अगिऑँव बाजार"), or smudged text.
   - "villageEn": The EXACT English name from the master list.
   - "villageHi": The EXACT Hindi name from the master list.
   - Match using the shortcuts/aliases provided. For example: "अ०" → "Agiaon Bazar" / "अगिऑँव बाजार", "ति०" → "Tiwari Dih" / "तिवारी डिह".
   - If you cannot confidently match, output your best reading of the handwritten text.

MASTER VILLAGE LIST (use ONLY these names in output):
${VILLAGE_REFERENCE}

4. WEIGHT:
   - Extract as a clean decimal number in KG (e.g., 10.520, 25.150, 50.0).
   - Common weights range from 5 to 100 KG. If a value seems extreme, re-read carefully.
   - If the unit is quintal (Q), multiply by 100 to convert to KG.

5. CONFIDENCE:
   - "HIGH": Text is clearly legible.
   - "MEDIUM": Partially legible, some guessing involved.
   - "LOW": Mostly illegible, high uncertainty.

6. BOUNDING BOX (box_2d): Provide normalized [ymin, xmin, ymax, xmax] coordinates from 0 to 1000 for each row's location in the image.

HANDWRITING TIPS:
- "०" (zero with a dot) after a character usually means an abbreviation (e.g., "अ०" = short for अगिऑँव).
- Smudged or overlapping strokes are common — use context from neighboring rows.
- DO NOT hallucinate or invent data. If a cell is empty or unreadable, use empty string or 0.`;

const OCR_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        data: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    serialNo: { type: Type.INTEGER },
                    customerNameEn: { type: Type.STRING },
                    customerNameHi: { type: Type.STRING },
                    villageEn: { type: Type.STRING },
                    villageHi: { type: Type.STRING },
                    weight: { type: Type.NUMBER },
                    confidence: {
                        type: Type.STRING,
                        enum: ['HIGH', 'MEDIUM', 'LOW'],
                    },
                    box_2d: {
                        type: Type.ARRAY,
                        items: { type: Type.INTEGER },
                        minItems: 4,
                        maxItems: 4,
                        description: '[ymin, xmin, ymax, xmax] normalized coordinates',
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
};

export async function extractLedgerRows(base64Image: string): Promise<{ records: ExtractedRow[]; usedModel: string; usage: TokenUsage; }> {
    let lastError: Error | null = null;

    for (const model of MODEL_CASCADE) {
        try {
            console.log(`[OCR Pipeline] Attempting extraction with model: ${model}`);

            const response = await ai.models.generateContent({
                model,
                contents: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: 'image/jpeg',
                        },
                    },
                    "Extract all handwritten rows from this ledger image into JSON format following the system rules.",
                ],
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: OCR_SCHEMA,
                },
            });

            const rawText = response.text || '{"data": []}';
            const parsed = JSON.parse(rawText);

            const usage: TokenUsage = {
                inputTokens: response.usageMetadata?.promptTokenCount || 0,
                outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
                totalTokens: response.usageMetadata?.totalTokenCount || 0,
            };

            return {
                records: parsed.data || [],
                usedModel: model,
                usage,
            };
        } catch (err: any) {
            console.warn(`[OCR Pipeline] Model ${model} failed or rate limited:`, err.message || err);
            lastError = err;
        }
    }
    throw new Error(`All OCR models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}