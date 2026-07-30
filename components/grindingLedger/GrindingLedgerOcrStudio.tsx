"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Cpu, Zap } from "lucide-react";
import toast from "react-hot-toast";
import {
  Loader2,
  Upload,
  Sparkles,
  CheckCircle2,
  Trash2,
  Plus,
  Eye,
  FileText,
  CalendarIcon,
  AlertTriangle,
  Edit,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formateIndDate } from "@/lib/helper";
import OcrScanningAnimation from "./OcrScanningAnimation";

// types
interface OcrMeta {
  totalRows: number;
  modelUsed: string;
  inputToken: number;
  outputToken: number;
  totalToken: number;
}

interface ExtractedRow {
  serialNo: number;
  customerNameEn: string;
  customerNameHi: string;
  villageEn: string;
  villageHi: string;
  weight: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

interface GrindingLedgerOcrStudioProps {
  onSuccess: () => void;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

interface VillageAutocompleteProps {
  value: string;
  lang: "en" | "hi";
  onChange: (en: string | null, hi: string | null) => void;
  className?: string;
  placeholder?: string;
}

// ─── Master Village List (synced with backend) ──────────────────────────────
const MASTER_VILLAGES: { en: string; hi: string }[] = [
  { en: "Agiaon Bazar", hi: "अगिऑँव बाजार" },
  { en: "Chhawani", hi: "छवनी" },
  { en: "Amehta", hi: "अमेहता" },
  { en: "Nadhi", hi: "नाढ़ी" },
  { en: "Dhanpura", hi: "धनपुरा" },
  { en: "Puraini", hi: "पुरैनी" },
  { en: "Pitro", hi: "पिटरो" },
  { en: "Jogradih", hi: "जोगराडिह" },
  { en: "Salakhna", hi: "सलाखना" },
  { en: "Baghaur Narayanpur", hi: "बघउड़ नारायणपुर" },
  { en: "Hathdihan", hi: "हथडिहाँ" },
  { en: "Anua", hi: "अनुआ" },
  { en: "Tiwari Dih", hi: "तिवारी डिह" },
  { en: "Parmanpur", hi: "प्रमाण पुर" },
  { en: "Pachphedwa", hi: "पांचफ़ेडवा" },
  { en: "Dehri Tola", hi: "डिहरी टोला" },
  { en: "Latthan", hi: "लट्ठान" },
  { en: "Pipra Dih", hi: "पिपरा डिह" },
  { en: "Koath", hi: "कोआथ" },
  { en: "Kothuwa", hi: "कोठुआ" },
  { en: "Baroda Tola", hi: "बड़ौडा टोला" },
  { en: "Gogsar", hi: "गोगसड़" },
  { en: "Moti Dih", hi: "मोति डिह" },
  { en: "Telar", hi: "तेलाड़" },
  { en: "Prema Rai Ke Tola", hi: "प्रेमा राय के टोला" },
  { en: "Chimni Par", hi: "चिमनी पर" },
  { en: "Ganpat Tola", hi: "गणपत टोला" },
  { en: 'Puraini', hi: 'पुरैनी' },
  { en: 'Nawadih', hi: 'नवाड़ीह' },
  { en: 'Basdiha', hi: 'बसडीहाँ' },
  { en: 'Pitath', hi: 'पिटाठ' },
  { en: 'Jagdishpur', hi: 'जगदिशपुर' },
  { en: 'Ganeshi Tola', hi: 'गणेशी टोला' },
  { en: 'Jagdepur', hi: 'जगदेपुर' },
  { en: 'Gidha', hi: 'गिधा' },
  { en: 'Shugibal', hi: 'शुगीबाल' },
  { en: 'Snehi Tola', hi: 'सनेही टोला' },
  { en: 'Suryapura', hi: 'सूर्यपुरा' },
  { en: 'Kewatiya', hi: 'केवटिया' },
  { en: 'Shugibal', hi: 'शुगिबाल' },
  { en: 'Katariya', hi: 'कटरीया' }
];

const VillageAutocomplete: React.FC<VillageAutocompleteProps> = ({
  value,
  lang,
  onChange,
  className = "",
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if current value is in master list
  const isInMasterList = MASTER_VILLAGES.some(
    (v) => (lang === "en" ? v.en : v.hi) === value
  );

  // Filter villages based on search
  const filtered = search.trim()
    ? MASTER_VILLAGES.filter((v) => {
      const target = lang === "en" ? v.en : v.hi;
      return target.toLowerCase().includes(search.toLowerCase());
    })
    : MASTER_VILLAGES;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  const handleCustomConfirm = () => {
    if (search.trim()) {
      if (lang === "en") {
        onChange(search.trim(), null); // keep current hi, update en
      } else {
        onChange(null, search.trim()); // keep current en, update hi
      }
    }
    setIsOpen(false);
    setSearch("");
    setIsCustom(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
          setIsCustom(false);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`flex items-center justify-between w-full border border-input bg-background text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 ${className} ${!isInMasterList && value ? "ring-1 ring-amber-500/50" : ""
          }`}
      >
        <span className={`truncate ${!value ? "text-muted-foreground" : ""}`}>
          {value || placeholder || "Select village..."}
        </span>
        <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 ml-1" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search input */}
          <div className="p-1.5 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsCustom(false);
                }}
                placeholder={lang === "en" ? "Type to search..." : "खोजें..."}
                className="w-full h-7 pl-6 pr-2 text-xs bg-muted/40 border-0 rounded-md outline-none focus:ring-1 focus:ring-primary/40"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-[180px] overflow-y-auto">
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
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between gap-2 transition-colors hover:bg-primary/10 ${isSelected ? "bg-primary/10 font-bold" : ""
                      }`}
                  >
                    <span className="truncate">{displayText}</span>
                    <span className="text-[10px] text-muted-foreground truncate shrink-0 max-w-[80px]">
                      {subText}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                No matching village found
              </div>
            )}
          </div>

          {/* Custom option — always shown at bottom */}
          <div className="border-t border-border/60">
            {!isCustom ? (
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className="w-full text-left px-3 py-2 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/10 flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Custom Village (type your own)
              </button>
            ) : (
              <div className="p-1.5 flex items-center gap-1.5">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomConfirm()}
                  placeholder={lang === "en" ? "Type custom village..." : "कस्टम गाँव लिखें..."}
                  className="flex-1 h-7 px-2 text-xs border border-input rounded-md outline-none focus:ring-1 focus:ring-primary/40 bg-background"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCustomConfirm}
                  disabled={!search.trim()}
                  className="h-7 px-2 text-xs rounded-md"
                >
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

const GrindingLedgerOcrStudio: React.FC<GrindingLedgerOcrStudioProps> = ({
  onSuccess,
  onCancel,
  onDirtyChange,
}) => {
  const [step, setStep] = useState<"upload" | "scanning" | "review">("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Default configuration
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [commodityType, setCommodityType] = useState<"WHEAT" | "MUSTARD">("WHEAT");
  const [records, setRecords] = useState<ExtractedRow[]>([]);
  const [ocrMeta, setOcrMeta] = useState<OcrMeta | null>(null);
  const [editingCardIdx, setEditingCardIdx] = useState<number | null>(null);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"cancel" | "reset" | null>(null);

  // Delete confirmation
  const [deleteRowIdx, setDeleteRowIdx] = useState<number | null>(null);

  useEffect(() => {
    onDirtyChange?.(step === "review" && records.length > 0);
  }, [step, records.length, onDirtyChange]);

  const handleAttemptCancel = () => {
    if (step === "review" && records.length > 0) {
      setPendingAction("cancel");
      setShowConfirmDialog(true);
    } else {
      onCancel();
    }
  };

  const handleAttemptReset = () => {
    if (step === "review" && records.length > 0) {
      setPendingAction("reset");
      setShowConfirmDialog(true);
    } else {
      handleReset();
    }
  };

  const handleConfirmAction = () => {
    setShowConfirmDialog(false);
    if (pendingAction === "cancel") {
      onCancel();
    } else if (pendingAction === "reset") {
      handleReset();
    }
    setPendingAction(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image size must be less than 4MB");
        return;
      }
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRunOcr = async () => {
    if (!imageFile) {
      toast.error("Please upload a handwritten register sheet image");
      return;
    }

    setIsExtracting(true);
    setStep("scanning"); // Show scanning animation
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch("/api/grinding-ledger/ocr", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to extract records from image");
      }

      setRecords(result.records || []);
      if (result.enhancedImage) {
        setEnhancedImageUrl(result.enhancedImage);
      }
      if (result.meta) {
        setOcrMeta(result.meta);
      }
      setEditingCardIdx(null);
      setStep("review");
      toast.success(`Extracted ${result.records?.length || 0} rows successfully!`);
    } catch (error: any) {
      toast.error(error.message || "OCR Extraction Failed");
      setStep("upload"); // Go back to upload on error
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRowChange = (index: number, field: keyof ExtractedRow, value: any) => {
    setRecords((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]:
          field === "serialNo" || field === "weight" ? Number(value) || 0 : value,
      };
      return updated;
    });
  };

  // Special handler for village autocomplete — updates both en & hi together, or one if null
  const handleVillageChange = useCallback(
    (index: number, en: string | null, hi: string | null) => {
      setRecords((prev) => {
        const updated = [...prev];
        if (en !== null) updated[index] = { ...updated[index], villageEn: en };
        if (hi !== null) updated[index] = { ...updated[index], villageHi: hi };
        return updated;
      });
    },
    []
  );

  const handleNameBlur = async (index: number, source: "en" | "hi", text: string) => {
    if (!text.trim()) return;
    const sl = source === "en" ? "en" : "hi";
    const tl = source === "en" ? "hi" : "en";
    const targetField = source === "en" ? "customerNameHi" : "customerNameEn";

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text.trim())}`;
      const res = await fetch(url);
      const data = await res.json();
      const result = data[0]?.[0]?.[0];
      if (result) {
        setRecords((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], [targetField]: result };
          return updated;
        });
      }
    } catch (error) {
      console.error("Transliteration error:", error);
    }
  };

  // Opens the delete confirmation dialog
  const handleAttemptDelete = (index: number) => {
    setDeleteRowIdx(index);
  };

  // Actually deletes after confirmation
  const handleConfirmDelete = () => {
    if (deleteRowIdx !== null) {
      setRecords((prev) => prev.filter((_, idx) => idx !== deleteRowIdx));
      if (editingCardIdx === deleteRowIdx) {
        setEditingCardIdx(null);
      }
      setDeleteRowIdx(null);
    }
  };

  const handleAddEmptyRow = () => {
    const nextSerial = records.length > 0 ? Math.max(...records.map((r) => r.serialNo)) + 1 : 1;
    setRecords((prev) => [
      ...prev,
      {
        serialNo: nextSerial,
        customerNameEn: "New Customer",
        customerNameHi: "नया ग्राहक",
        villageEn: "Agiaon Bazar",
        villageHi: "अगिआँव बाजार",
        weight: 10,
        confidence: "HIGH",
      },
    ]);
    setEditingCardIdx(records.length);
  };

  const handleSaveBulk = async () => {
    if (records.length === 0) {
      toast.error("At least one valid record is required to save");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/grinding-ledger/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          commodityType,
          records: records.map((r) => ({
            serialNo: Number(r.serialNo),
            customerNameEn: r.customerNameEn || "Unknown",
            customerNameHi: r.customerNameHi || "अज्ञात",
            villageEn: r.villageEn || "Unknown",
            villageHi: r.villageHi || "अज्ञात",
            weight: Number(r.weight) || 0,
          })),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to save ledger entries");
      }

      toast.success(`Successfully saved ${result.data?.count || records.length} records into Grinding Ledger!`);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save records");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setImageFile(null);
    setImagePreviewUrl(null);
    setEnhancedImageUrl(null);
    setRecords([]);
    setOcrMeta(null);
    setEditingCardIdx(null);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            <Sparkles className="h-5 w-5 text-amber-500 animate-pulse shrink-0" />
            <span className="truncate">AI OCR Image-to-JSON Convertor</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Upload a handwritten register sheet. Gemini AI converts handwriting into editable rows for bulk database insertion.
          </p>
        </div>
        {step === "review" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAttemptReset}
            className="text-xs font-semibold rounded-xl h-9 w-full sm:w-auto shrink-0"
          >
            ← Upload Another Sheet
          </Button>
        )}
      </div>

      {/* ── Step 1: Upload ────────────────────────────────────────────────── */}
      {step === "upload" && (
        <div className="py-6 flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5">
              <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Slip Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <span>{date ? formateIndDate(new Date(`${date}T00:00:00`)) : "-"}</span>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto overflow-hidden p-0">
                  <Calendar
                    mode="single"
                    selected={date ? new Date(`${date}T00:00:00`) : undefined}
                    onSelect={(selectedDate) => {
                      if (!selectedDate) return;
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const day = String(selectedDate.getDate()).padStart(2, "0");
                      setDate(`${year}-${month}-${day}`);
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Commodity Type
              </Label>
              <Select
                value={commodityType}
                onValueChange={(val: "WHEAT" | "MUSTARD") => setCommodityType(val)}
              >
                <SelectTrigger className="w-full font-bold h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WHEAT" className="font-medium">Wheat (गेहूं)</SelectItem>
                  <SelectItem value="MUSTARD" className="font-medium">Mustard (सरसों)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Drop zone */}
          <div className="border-2 border-dashed border-amber-500/40 hover:border-amber-500 bg-amber-50/20 dark:bg-amber-950/10 rounded-2xl p-8 w-full flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group min-h-[220px]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            {imagePreviewUrl ? (
              <div className="flex flex-col items-center space-y-3">
                <img
                  src={imagePreviewUrl}
                  alt="Register sheet preview"
                  className="max-h-64 rounded-xl shadow-md object-contain border border-border"
                />
                <span className="text-xs text-muted-foreground font-medium bg-background px-3 py-1 rounded-full border">
                  {imageFile?.name} ({Math.round((imageFile?.size || 0) / 1024)} KB)
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                  Click or drop another image to replace
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 py-6">
                <div className="p-4 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">
                    Click to upload or drag & drop register sheet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JPG, PNG, WEBP (Handwritten Indian Flour / Oil Mill Ledgers)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons — fully mobile responsive */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAttemptCancel}
              className="h-12 text-base px-6 rounded-xl font-semibold w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRunOcr}
              disabled={!imageFile || isExtracting}
              className="w-full sm:flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold h-12 rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/20 gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline">Convert Image to Grinding Ledger JSON</span>
              <span className="sm:hidden">Convert to JSON</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 1.5: Scanning Animation ─────────────────────────────────── */}
      {step === "scanning" && (
        <OcrScanningAnimation imageSrc={imagePreviewUrl} />
      )}

      {/* ── Step 2: Review ───────────────────────────────────────────────── */}
      {step === "review" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pt-2">
          {/* Left: Image Viewer */}
          <div className="lg:col-span-5 flex flex-col border border-border/80 rounded-2xl overflow-hidden bg-muted/20 min-h-[350px]">
            <div className="p-3 bg-muted/60 border-b flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-500" /> OCR Source View
              </span>
              <Badge variant="outline" className="bg-background text-xs">
                {commodityType === "WHEAT" ? "Wheat" : "Mustard"} — {date}
              </Badge>
            </div>

            {/* ── AI Response Meta ─────────────────────────────────── */}
            {ocrMeta && (
              <div className="px-3 py-2 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 border-b border-amber-500/20">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Cpu className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    AI Response Meta
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-semibold text-foreground font-mono truncate ml-1 max-w-[120px]" title={ocrMeta.modelUsed}>
                      {ocrMeta.modelUsed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Rows</span>
                    <span className="font-bold text-foreground tabular-nums">{ocrMeta.totalRows}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 text-blue-500" /> Input
                    </span>
                    <span className="font-mono font-semibold text-foreground tabular-nums">{ocrMeta.inputToken?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 text-green-500" /> Output
                    </span>
                    <span className="font-mono font-semibold text-foreground tabular-nums">{ocrMeta.outputToken?.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between text-[10px] pt-1 border-t border-border/40">
                    <span className="text-muted-foreground font-semibold">Total Tokens</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">{ocrMeta.totalToken?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto p-2 flex items-center justify-center bg-black/5 dark:bg-black/40 max-h-[600px]">
              <img
                src={enhancedImageUrl || imagePreviewUrl || ""}
                alt="OCR Enhanced Register Sheet"
                className="max-w-full h-auto rounded shadow-lg border border-border"
              />
            </div>
          </div>

          {/* Right: Editable JSON Spreadsheet */}
          <div className="lg:col-span-7 flex flex-col border border-border/80 rounded-2xl overflow-hidden bg-card">
            <div className="p-3 bg-muted/60 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-sm">
                  Extracted JSON Rows ({records.length})
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddEmptyRow}
                className="h-8 text-xs font-semibold rounded-lg gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </Button>
            </div>

            {/* ── Desktop Table ──────────────────────────────────────────── */}
            <div className="hidden md:block flex-1 overflow-x-auto overflow-y-auto p-2 max-h-[615px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b bg-muted/40 font-bold text-muted-foreground">
                    <th className="p-2 w-12 text-center">S.No</th>
                    <th className="p-2">English Name</th>
                    <th className="p-2">Hindi Name</th>
                    <th className="p-2 min-w-[180px]">Village (En / Hi)</th>
                    <th className="p-2 w-20 text-right">Weight</th>
                    <th className="p-2 w-16 text-center">Conf</th>
                    <th className="p-2 w-10 text-center">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {records.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="p-1">
                        <Input
                          type="number"
                          value={row.serialNo}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) => handleRowChange(idx, "serialNo", e.target.value)}
                          className="h-8 w-12 text-center font-bold font-mono px-1 text-xs rounded-lg"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          value={row.customerNameEn}
                          onChange={(e) => handleRowChange(idx, "customerNameEn", e.target.value)}
                          onBlur={(e) => handleNameBlur(idx, "en", e.target.value)}
                          className="h-8 text-xs px-2 rounded-lg"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          value={row.customerNameHi}
                          onChange={(e) => handleRowChange(idx, "customerNameHi", e.target.value)}
                          onBlur={(e) => handleNameBlur(idx, "hi", e.target.value)}
                          className="h-8 text-xs px-2 font-hindi rounded-lg"
                        />
                      </td>
                      <td className="p-1">
                        <div className="flex flex-col gap-1">
                          <VillageAutocomplete
                            value={row.villageEn}
                            lang="en"
                            onChange={(en, hi) => handleVillageChange(idx, en, hi)}
                            className="h-7 text-xs px-2 rounded-lg"
                            placeholder="English Village"
                          />
                          <VillageAutocomplete
                            value={row.villageHi}
                            lang="hi"
                            onChange={(en, hi) => handleVillageChange(idx, en, hi)}
                            className="h-7 text-xs px-2 font-hindi text-muted-foreground rounded-lg"
                            placeholder="Hindi Village"
                          />
                        </div>
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          step="0.1"
                          value={row.weight}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) => handleRowChange(idx, "weight", e.target.value)}
                          className="h-8 w-20 text-right font-bold text-xs px-2 rounded-lg"
                        />
                      </td>
                      <td className="p-1 text-center">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 font-bold ${row.confidence === "HIGH"
                            ? "bg-green-500/10 text-green-600 border-green-500/30"
                            : row.confidence === "MEDIUM"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                              : "bg-red-500/10 text-red-600 border-red-500/30"
                            }`}
                        >
                          {row.confidence || "HIGH"}
                        </Badge>
                      </td>
                      <td className="p-1 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAttemptDelete(idx)}
                          className="h-7 w-7 text-muted-foreground hover:text-red-500 rounded-lg"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ───────────────────────────────────────────── */}
            <div className="block md:hidden flex-1 overflow-y-auto p-3 max-h-[520px] space-y-3">
              {records.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs">
                  No records extracted. Click &quot;Add Row&quot; to add manually.
                </div>
              ) : (
                records.map((row, idx) => {
                  const isEditing = editingCardIdx === idx;
                  const totalPrice = Math.round((Number(row.weight) || 0) * 3);

                  if (!isEditing) {
                    return (
                      <div
                        key={idx}
                        className="relative flex rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm active:scale-[0.99] transition-all"
                      >
                        {/* Left panel: serial circle + commodity label at bottom */}
                        <div className="flex flex-col items-center justify-between gap-0 px-3 py-3 bg-primary/8 border-r border-border/40 shrink-0 min-w-[52px]">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono font-black text-xs shadow-sm">
                            {row.serialNo}
                          </div>
                          <span className="text-[9px] font-bold text-primary/70 mt-1 tracking-wide leading-none">
                            {commodityType === "WHEAT" ? "Wheat" : "Sarso"}
                          </span>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-2.5 px-3 gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-bold text-[14px] text-foreground leading-snug truncate">
                                {row.customerNameHi || "अज्ञात"}
                              </p>
                              <p className="text-[11px] text-muted-foreground font-hindi truncate leading-relaxed">
                                {row.customerNameEn || "Unnamed"}
                              </p>
                              <p className="text-[10px] text-muted-foreground/75 mt-0.5 truncate">
                                {row.villageHi || "अज्ञात"}
                                {row.villageEn ? <span className="font-hindi text-muted-foreground/60"> / {row.villageEn}</span> : null}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1.5 py-0 font-bold shrink-0 ${row.confidence === "HIGH"
                                ? "bg-green-500/10 text-green-600 border-green-500/30"
                                : row.confidence === "MEDIUM"
                                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                                  : "bg-red-500/10 text-red-600 border-red-500/30"
                                }`}
                            >
                              {row.confidence || "HIGH"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/40">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-extrabold text-[15px] tabular-nums text-foreground leading-none">
                                {row.weight}
                                <span className="text-[10px] font-normal text-muted-foreground ml-0.5">kg</span>
                              </span>
                              <span className="text-[11px] font-semibold text-primary tabular-nums leading-none">
                                · ₹{totalPrice}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingCardIdx(idx)}
                                className="h-7 px-2.5 text-xs font-semibold rounded-lg gap-1 border-primary/30 text-primary hover:bg-primary/10"
                              >
                                <Edit className="w-3 h-3" /> Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleAttemptDelete(idx)}
                                className="h-7 w-7 text-muted-foreground hover:text-red-500 rounded-lg shrink-0"
                                title="Remove row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // ── Mobile Edit Card ──────────────────────────────────
                  return (
                    <div
                      key={idx}
                      className="bg-card border-2 border-primary/60 rounded-2xl p-3.5 shadow-md space-y-3 relative ring-4 ring-primary/10"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-muted-foreground"># S.No</span>
                          <Input
                            type="number"
                            value={row.serialNo}
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(e) => handleRowChange(idx, "serialNo", e.target.value)}
                            className="h-8 w-16 text-center font-bold font-mono text-xs rounded-lg bg-background"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 font-bold ${row.confidence === "HIGH"
                              ? "bg-green-500/10 text-green-600 border-green-500/30"
                              : row.confidence === "MEDIUM"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                                : "bg-red-500/10 text-red-600 border-red-500/30"
                              }`}
                          >
                            {row.confidence || "HIGH"}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAttemptDelete(idx)}
                            className="h-7 w-7 text-muted-foreground hover:text-red-500 rounded-lg"
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        <div>
                          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Customer Name (English)
                          </Label>
                          <Input
                            value={row.customerNameEn}
                            onChange={(e) => handleRowChange(idx, "customerNameEn", e.target.value)}
                            onBlur={(e) => handleNameBlur(idx, "en", e.target.value)}
                            placeholder="English Name"
                            className="h-9 text-xs rounded-lg mt-1 bg-background"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-hindi">
                            Customer Name (Hindi) - नाम
                          </Label>
                          <Input
                            value={row.customerNameHi}
                            onChange={(e) => handleRowChange(idx, "customerNameHi", e.target.value)}
                            onBlur={(e) => handleNameBlur(idx, "hi", e.target.value)}
                            placeholder="Hindi Name"
                            className="h-9 text-xs font-hindi rounded-lg mt-1 bg-background"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Village (En)
                            </Label>
                            <div className="mt-1">
                              <VillageAutocomplete
                                value={row.villageEn}
                                lang="en"
                                onChange={(en, hi) => handleVillageChange(idx, en, hi)}
                                className="h-9 text-xs rounded-lg bg-background px-2"
                                placeholder="English Village"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-hindi">
                              Village (Hi) - गाँव
                            </Label>
                            <div className="mt-1">
                              <VillageAutocomplete
                                value={row.villageHi}
                                lang="hi"
                                onChange={(en, hi) => handleVillageChange(idx, en, hi)}
                                className="h-9 text-xs font-hindi rounded-lg bg-background text-muted-foreground px-2"
                                placeholder="Hindi Village"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Weight (Kg)
                          </Label>
                          <div className="relative mt-1">
                            <Input
                              type="number"
                              step="0.1"
                              value={row.weight}
                              onWheel={(e) => e.currentTarget.blur()}
                              onChange={(e) => handleRowChange(idx, "weight", e.target.value)}
                              className="h-9 text-right font-bold text-xs pr-10 rounded-lg bg-background"
                            />
                            <span className="absolute right-3 top-2 text-[10px] font-bold text-muted-foreground">
                              KG
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setEditingCardIdx(null)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold h-8 px-4 rounded-xl shadow gap-1 text-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done Editing
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Save Footer */}
            <div className="p-4 border-t bg-muted/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Ready to insert{" "}
                <span className="font-bold text-foreground">{records.length} records</span>{" "}
                for <span className="font-bold text-amber-600">{commodityType}</span> on{" "}
                <span className="font-bold text-foreground">{date}</span>.
              </div>
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
                <Button variant="outline" onClick={handleAttemptCancel} disabled={isSaving} className="h-10 px-4 rounded-xl font-semibold">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveBulk}
                  disabled={isSaving || records.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold h-10 px-5 rounded-xl shadow gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Inserting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save {records.length} Records
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
              Discard AI OCR Results?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              The AI OCR processing has completed and extracted <strong>{records.length} records</strong>. AI calls are expensive and if you leave or upload another sheet now, these extracted records will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel onClick={() => setPendingAction(null)}>
              No, Continue Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
            >
              Yes, Discard Records
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Row Confirmation Dialog */}
      <AlertDialog open={deleteRowIdx !== null} onOpenChange={(open) => !open && setDeleteRowIdx(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
              <Trash2 className="w-5 h-5 shrink-0" />
              Delete This Record?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {deleteRowIdx !== null && records[deleteRowIdx] ? (
                <>
                  Are you sure you want to delete <strong>S.No {records[deleteRowIdx].serialNo}</strong> — <strong>{records[deleteRowIdx].customerNameHi || records[deleteRowIdx].customerNameEn}</strong> ({records[deleteRowIdx].villageEn}, {records[deleteRowIdx].weight} kg)? This action cannot be undone.
                </>
              ) : (
                "Are you sure you want to delete this record? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel onClick={() => setDeleteRowIdx(null)}>
              No, Keep It
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
            >
              Yes, Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GrindingLedgerOcrStudio;
