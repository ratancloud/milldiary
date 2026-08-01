export async function translateText(text: string, from: "en" | "hi", to: "en" | "hi"): Promise<string> {
  if (!text.trim()) return "";
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    const data = await res.json();
    return data[0][0][0] || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
