"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2, ChevronDown, Search, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MASTER_VILLAGES } from "@/lib/ocr/villages";
import { translateText } from "@/lib/translate";

interface VillageAutocompleteProps {
  value: string;
  lang: "en" | "hi";
  onChange: (en: string | null, hi: string | null) => void;
  className?: string;
  placeholder?: string;
}

export const VillageAutocomplete: React.FC<VillageAutocompleteProps> = ({
  value,
  lang,
  onChange,
  className = "",
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isInMasterList = MASTER_VILLAGES.some(
    (v) => (lang === "en" ? v.en : v.hi) === value
  );

  const filtered = search.trim()
    ? MASTER_VILLAGES.filter((v) => {
      const target = lang === "en" ? v.en : v.hi;
      return target.toLowerCase().includes(search.toLowerCase());
    })
    : MASTER_VILLAGES;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
        setIsCustom(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (village: { en: string; hi: string }) => {
    onChange(village.en, village.hi);
    setIsOpen(false);
    setSearch("");
    setIsCustom(false);
  };

  const handleCustomConfirm = async () => {
    const text = search.trim();
    if (text) {
      setIsTranslating(true);
      try {
        const getTranslation = async (tl: "en" | "hi") => {
          const sl = tl === "en" ? "hi" : "en";
          return await translateText(text, sl, tl);
        };

        const [translatedEn, translatedHi] = await Promise.all([
          getTranslation("en"),
          getTranslation("hi"),
        ]);

        onChange(translatedEn, translatedHi);
      } catch (err) {
        // Fallback
        if (lang === "en") {
          onChange(text, null);
        } else {
          onChange(null, text);
        }
      } finally {
        setIsTranslating(false);
        setIsOpen(false);
        setSearch("");
        setIsCustom(false);
      }
    } else {
      setIsOpen(false);
      setSearch("");
      setIsCustom(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
          setIsCustom(false);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`flex items-center justify-between w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm ${className} ${!isInMasterList && value ? "ring-1 ring-amber-500/50" : ""
          }`}
      >
        <span className={`truncate ${!value ? "text-muted-foreground font-normal" : "font-medium"}`}>
          {value || placeholder || "Select village..."}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-1 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-1 border-b border-border/40">
            <div className="relative flex items-center">
              <Search className="absolute left-2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsCustom(false);
                }}
                placeholder={lang === "en" ? "Search..." : "खोजें..."}
                className="w-full h-8 pl-7 pr-7 text-sm bg-muted/30 border-0 rounded-sm outline-none focus:ring-1 focus:ring-primary/40"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[180px] overflow-y-auto p-1">
            {filtered.length > 0 ? (
              filtered.map((v, i) => {
                const displayText = lang === "en" ? v.en : v.hi;
                const subText = lang === "en" ? v.hi : v.en;
                const isSelected = displayText === value;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(v)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center justify-between gap-2 transition-colors hover:bg-accent hover:text-accent-foreground ${isSelected ? "bg-accent text-accent-foreground font-semibold" : ""
                      }`}
                  >
                    <span className="truncate">{displayText}</span>
                    <span className="text-[11px] text-muted-foreground truncate shrink-0">
                      {subText}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                No matching village found
              </div>
            )}
          </div>

          <div className="p-1 border-t border-border/40 bg-muted/10">
            {!isCustom ? (
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className="w-full text-left px-2 py-1.5 text-sm text-primary font-medium hover:bg-primary/10 rounded-sm flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                Custom Village
              </button>
            ) : (
              <div className="flex items-center gap-1.5 p-0.5">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomConfirm()}
                  placeholder={lang === "en" ? "Custom village..." : "कस्टम गाँव..."}
                  className="flex-1 h-8 px-2 text-sm border border-input rounded-sm outline-none focus:ring-1 focus:ring-primary/40 bg-background"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={handleCustomConfirm}
                  disabled={!search.trim() || isTranslating}
                  className="h-8 px-3 text-xs rounded-sm gap-1"
                >
                  {isTranslating && <Loader2 className="w-3 h-3 animate-spin" />}
                  OK
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
