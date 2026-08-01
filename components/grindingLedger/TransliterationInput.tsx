import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Languages, Loader2 } from "lucide-react";

interface TransliterationInputProps {
  labelHi: string;
  labelEn: string;
  valueHi: string;
  valueEn: string;
  onChange: (hi: string, en: string) => void;
  placeholderHi?: string;
  placeholderEn?: string;
  className?: string;
}

export const TransliterationInput: React.FC<TransliterationInputProps> = ({
  labelHi,
  labelEn,
  valueHi,
  valueEn,
  onChange,
  placeholderHi = "Hindi Name",
  placeholderEn = "English Name",
  className = "",
}) => {
  const [isTranslatingHi, setIsTranslatingHi] = useState(false);
  const [isTranslatingEn, setIsTranslatingEn] = useState(false);

  const handleSmartTranslate = async (sourceText: string, sourceField: "hi" | "en") => {
    if (!sourceText.trim()) return;

    if (sourceField === "hi") setIsTranslatingHi(true);
    else setIsTranslatingEn(true);

    try {
      const getTranslation = async (tl: "en" | "hi") => {
        const sl = tl === "en" ? "hi" : "en";
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(
          sourceText.trim()
        )}`;
        const res = await fetch(url);
        const data = await res.json();
        return data[0]?.[0]?.[0] || "";
      };

      const [translatedEn, translatedHi] = await Promise.all([
        getTranslation("en"),
        getTranslation("hi"),
      ]);

      onChange(translatedHi, translatedEn);
    } catch (error) {
      console.error("Transliteration error:", error);
    } finally {
      setIsTranslatingHi(false);
      setIsTranslatingEn(false);
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex-1 space-y-1">
        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-hindi">
          {labelHi}
        </Label>
        <div className="relative">
          <Input
            value={valueHi}
            onChange={(e) => onChange(e.target.value, valueEn)}
            placeholder={placeholderHi}
            className="h-10 text-sm font-hindi font-medium pl-2.5 pr-8 rounded-lg bg-background"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleSmartTranslate(valueHi, "hi")}
            disabled={isTranslatingHi || !valueHi}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 rounded-md"
            title="Auto-translate to both languages"
          >
            {isTranslatingHi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {labelEn}
        </Label>
        <div className="relative">
          <Input
            value={valueEn}
            onChange={(e) => onChange(valueHi, e.target.value)}
            placeholder={placeholderEn}
            className="h-10 text-sm font-medium pl-2.5 pr-8 rounded-lg bg-background"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleSmartTranslate(valueEn, "en")}
            disabled={isTranslatingEn || !valueEn}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 rounded-md"
            title="Auto-translate to both languages"
          >
            {isTranslatingEn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
