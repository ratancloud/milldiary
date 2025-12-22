import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    /* ---------------- Security ---------------- */
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------------- IST Date (correct) ---------------- */
    const istDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    istDate.setHours(0, 0, 0, 0);

    /* ---------------- Fetch user ---------------- */
    const user = await prisma.user.findUnique({
      where: { email: "mill@gmail.com" },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    /* ---------------- Upsert daily row ---------------- */
    await prisma.millData.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: istDate,
        },
      },
      create: {
        userId: user.id,
        date: istDate,
      },
      update: {},
    });

    return NextResponse.json({
      success: true,
      message: "Daily MillData ensured",
      date: istDate.toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("CRON ERROR:", error);
    return NextResponse.json(
      { error: "Cron execution failed" },
      { status: 500 }
    );
  }
}
