import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { optimizeLedgerImage } from '@/lib/ocr/image';
import { extractLedgerRows } from '@/lib/ocr/gemini';
import { resolveVillage } from '@/lib/ocr/villages';

export async function POST(request: Request) {
  try {
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

    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const base64Data = await optimizeLedgerImage(imageBuffer);

    // Run Gemini Cascade OCR
    const { records: rawRecords, usedModel, usage } = await extractLedgerRows(base64Data);

    // Post-Process & Resolve Master Village Names
    const formattedRecords = rawRecords.map((item, idx) => {
      const resolved = resolveVillage(item.villageEn || '', item.villageHi || '');

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
      meta: {
        totalRows: formattedRecords.length,
        modelUsed: usedModel,
        inputToken: usage.inputTokens,
        outputToken: usage.outputTokens,
        totalToken: usage.totalTokens,
      },
    });
  } catch (error: any) {
    console.error('[OCR API Route Error]:', error);

    const isRateLimit = error.message?.includes('429') || error.message?.includes('quota');
    const statusCode = isRateLimit ? 429 : 500;

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during ledger extraction',
      },
      { status: statusCode }
    );
  }
}