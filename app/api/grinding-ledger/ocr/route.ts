import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Initialize the new Google Gen AI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ─── Master Village Registry ─────────────────────────────────────────────────
// Each entry: { en, hi, aliases[] }
// aliases include short-names, abbreviations, alternate spellings, and Hindi shortcuts
// that commonly appear in handwritten registers.
const MASTER_VILLAGES: {
  en: string;
  hi: string;
  aliases: string[];
}[] = [
  {
    en: 'Agiaon Bazar',
    hi: 'अगिऑँव बाजार',
    aliases: ['अ०', 'आ०', 'आ० बाजार', 'अगिआँव', 'अगिआँव बाजार',],
  },
  {
    en: 'Chhawani',
    hi: 'छवनी',
    aliases: ['चौ०', 'छ०', 'चौ०छ०', 'चौ० छवनी', 'छावनी'],
  },
  {
    en: 'Amehta',
    hi: 'अमेहता',
    aliases: ['अमेहत',],
  },
  {
    en: 'Nadhi',
    hi: 'नाढ़ी',
    aliases: ['नाड़ी', 'नाधी', 'ना०'],
  },
  {
    en: 'Dhanpura',
    hi: 'धनपुरा',
    aliases: ['धनपूरा', 'ध०'],
  },
  {
    en: 'Pitro',
    hi: 'पिटरो',
    aliases: ['पीटरो', 'पि०'],
  },
  {
    en: 'Jogradih',
    hi: 'जोगराडिह',
    aliases: ['जोगरा डिह', 'जो०', 'Jo.'],
  },
  {
    en: 'Salakhna',
    hi: 'सलाखना',
    aliases: ['सलखना', 'स०'],
  },
  {
    en: 'Baghaur Narayanpur',
    hi: 'बघउड़ नारायणपुर',
    aliases: ['ब०', 'न०', 'बघउड़', 'नारायणपुर','बघउर', 'बघउर नारायणपुर'],
  },
  {
    en: 'Hathdihan',
    hi: 'हथडिहाँ',
    aliases: ['ह०', 'हथ०'],
  },
  {
    en: 'Anua',
    hi: 'अनुआ',
    aliases: ['अनुवा', 'अ०नु०'],
  },
  {
    en: 'Tiwari Dih',
    hi: 'तिवारी डिह',
    aliases: ['ति०', 'तिवारीडिह', 'तिवारी'],
  },
  {
    en: 'Parmanpur',
    hi: 'प्रमाण पुर',
    aliases: ['परमानपुर', 'प्रमाणपुर', 'प०', 'Parman Pur'],
  },
  {
    en: 'Pachfhedwa',
    hi: 'पांचफ़ेडवा',
    aliases: [ 'पांचफेडवा', 'पाँचफेडवा', 'पां०'],
  },
  {
    en: 'Dehri Tola',
    hi: 'डिहरी टोला',
    aliases: ['डिहरीटोला', 'डी०'],
  },
  {
    en: 'Latthan',
    hi: 'लट्ठान',
    aliases: [ 'लठान', 'ल०'],
  },
  {
    en: 'Pipra Dih',
    hi: 'पिपरा डिह',
    aliases: [ 'पिपराडिह', 'पि०डि०'],
  },
  {
    en: 'Koath',
    hi: 'कोआथ',
    aliases: [ 'को०', 'कोअथ'],
  },
  {
    en: 'Kothuwa',
    hi: 'कोठुआ',
    aliases: ['कोबुऑँ', 'कोठुवा', 'कोठु०'],
  },
  {
    en: 'Baroda Tola',
    hi: 'बड़ौडा टोला',
    aliases: ['बड़ौदा टोला', 'बड़ौडा', 'ब०टो०'],
  },
  {
    en: 'Gogsar',
    hi: 'गोगसड़',
    aliases: ['गोगसर', 'गो०'],
  },
  {
    en: 'Moti Dih',
    hi: 'मोति डिह',
    aliases: ['मोतीडिह', 'मोती डिह', 'मो०'],
  },
  {
    en: 'Telar',
    hi: 'तेलाड़',
    aliases: ['तेलाड', 'ते०'],
  },
  {
    en: 'Prema Rai Ke Tola',
    hi: 'प्रेमा राय के टोला',
    aliases: ['प्रेमा राय', 'प्रेमा राय टोला', 'प्रे०'],
  },
  {
    en: 'Chimni Par',
    hi: 'चिमनी पर',
    aliases: ['चिमनीपर', 'चि०'],
  },
  {
    en: 'Ganpat Tola',
    hi: 'गणपत टोला',
    aliases: ['गणपतटोला', 'ग०टो०'],
  },
];

// ─── Build lookup indexes for fast matching ──────────────────────────────────
// Lowercase English name → village entry
const enLookup = new Map<string, (typeof MASTER_VILLAGES)[number]>();
// Hindi name → village entry
const hiLookup = new Map<string, (typeof MASTER_VILLAGES)[number]>();
// All aliases (lowercased / trimmed) → village entry
const aliasLookup = new Map<string, (typeof MASTER_VILLAGES)[number]>();

for (const v of MASTER_VILLAGES) {
  enLookup.set(v.en.toLowerCase(), v);
  hiLookup.set(v.hi, v);
  for (const a of v.aliases) {
    aliasLookup.set(a.toLowerCase().trim(), v);
    // Also add without dots/periods for abbreviated forms like "अ०" → "अ"
    aliasLookup.set(a.replace(/[०.]/g, '').toLowerCase().trim(), v);
  }
}

// ─── Levenshtein distance for fuzzy matching ─────────────────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

// ─── Resolve a raw village string to the best master match ───────────────────
// Priority: exact en match → exact hi match → exact alias match → fuzzy match → raw fallback
function resolveVillage(rawEn: string, rawHi: string): { en: string; hi: string; matched: boolean } {
  const normEn = rawEn.trim().toLowerCase();
  const normHi = rawHi.trim();

  // 1. Exact English name match
  if (enLookup.has(normEn)) {
    const v = enLookup.get(normEn)!;
    return { en: v.en, hi: v.hi, matched: true };
  }

  // 2. Exact Hindi name match
  if (hiLookup.has(normHi)) {
    const v = hiLookup.get(normHi)!;
    return { en: v.en, hi: v.hi, matched: true };
  }

  // 3. Alias match (English input)
  if (aliasLookup.has(normEn)) {
    const v = aliasLookup.get(normEn)!;
    return { en: v.en, hi: v.hi, matched: true };
  }

  // 4. Alias match (Hindi input)
  if (aliasLookup.has(normHi)) {
    const v = aliasLookup.get(normHi)!;
    return { en: v.en, hi: v.hi, matched: true };
  }

  // 5. Alias match without dots/periods (Hindi abbreviated forms)
  const normHiNoDots = normHi.replace(/[०.]/g, '').trim();
  if (normHiNoDots && aliasLookup.has(normHiNoDots)) {
    const v = aliasLookup.get(normHiNoDots)!;
    return { en: v.en, hi: v.hi, matched: true };
  }

  // 6. Fuzzy match — find the closest English name by Levenshtein distance
  //    Only accept if distance <= 40% of the master name length (tight threshold)
  let bestMatch: (typeof MASTER_VILLAGES)[number] | null = null;
  let bestDist = Infinity;

  for (const v of MASTER_VILLAGES) {
    const dist = levenshtein(normEn, v.en.toLowerCase());
    if (dist < bestDist) {
      bestDist = dist;
      bestMatch = v;
    }
    // Also check against aliases
    for (const a of v.aliases) {
      const aDist = levenshtein(normEn, a.toLowerCase());
      if (aDist < bestDist) {
        bestDist = aDist;
        bestMatch = v;
      }
    }
  }

  // Also fuzzy-match on Hindi
  for (const v of MASTER_VILLAGES) {
    const dist = levenshtein(normHi, v.hi);
    if (dist < bestDist) {
      bestDist = dist;
      bestMatch = v;
    }
  }

  if (bestMatch) {
    const maxLen = Math.max(bestMatch.en.length, normEn.length, normHi.length, 1);
    const similarity = 1 - bestDist / maxLen;
    if (similarity >= 0.55) {
      return { en: bestMatch.en, hi: bestMatch.hi, matched: true };
    }
  }

  // 7. No match — return raw values (LLM prediction as-is)
  return { en: rawEn || 'Unknown', hi: rawHi || 'अज्ञात', matched: false };
}

// ─── Build prompt village reference ──────────────────────────────────────────
const VILLAGE_REFERENCE = MASTER_VILLAGES.map(
  (v) => `• "${v.en}" = "${v.hi}"${v.aliases.length > 0 ? ` [shortcuts: ${v.aliases.join(', ')}]` : ''}`
).join('\n');

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
      .resize({ width: 2000, fit: 'inside', withoutEnlargement: true })
      .grayscale()
      .linear(1.2, -10)
      .sharpen()
      .jpeg({ quality: 98 })
      .toBuffer();

    const base64Data = processedBuffer.toString('base64');

    // ── Hardened OCR Prompt ────────────────────────────────────────────────
    const prompt = `You are a high-precision OCR engine specialized for Indian handwritten grinding mill (Atta Chakki / Flour Mill / Mustard Oil Mill) customer register pages.

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

    // ── Post-Processing: Strict village matching + normalization ───────────
    const formattedRecords = (parsedData.data || []).map((item: any, idx: number) => {
      const rawVillageEn = item.villageEn || '';
      const rawVillageHi = item.villageHi || '';

      // Resolve village: strict match → alias match → fuzzy match → raw fallback
      const resolved = resolveVillage(rawVillageEn, rawVillageHi);

      return {
        serialNo: item.serialNo || idx + 1,
        customerNameEn: item.customerNameEn || 'Unknown',
        customerNameHi: item.customerNameHi || 'अज्ञात',
        villageEn: resolved.en,
        villageHi: resolved.hi,
        weight: typeof item.weight === 'number' ? item.weight : Number(item.weight) || 0,
        confidence: item.confidence || 'HIGH',
        box_2d: item.box_2d || [0, 0, 0, 0],
      };
    });

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
