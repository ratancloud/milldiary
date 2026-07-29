import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Loader2,
  Upload,
  Sparkles,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Eye,
  FileText,
  AlertTriangle,
  CalendarIcon,
  Edit,
  Cpu,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

interface GrindingLedgerOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GrindingLedgerOcrModal: React.FC<GrindingLedgerOcrModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<"upload" | "review">("upload");
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
  const [pendingAction, setPendingAction] = useState<"close" | "reset" | null>(null);

  const handleAttemptClose = () => {
    if (step === "review" && records.length > 0) {
      setPendingAction("close");
      setShowConfirmDialog(true);
    } else {
      onClose();
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
    if (pendingAction === "close") {
      onClose();
    } else if (pendingAction === "reset") {
      handleReset();
    }
    setPendingAction(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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

  const handleDeleteRow = (index: number) => {
    setRecords((prev) => prev.filter((_, idx) => idx !== index));
    if (editingCardIdx === index) {
      setEditingCardIdx(null);
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
      handleReset();
      onClose();
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
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && handleAttemptClose()}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[92vh] flex flex-col overflow-hidden p-6">
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
              AI OCR Image-to-JSON Convertor (Grinding Ledger)
            </DialogTitle>
            {step === "review" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAttemptReset}
                className="text-xs"
              >
                ← Upload Another Sheet
              </Button>
            )}
          </div>
          <DialogDescription>
            Upload a handwritten register sheet. Gemini AI will convert handwriting into editable JSON rows for bulk database insertion.
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="space-y-1.5">
                <Label className="font-semibold text-xs text-muted-foreground uppercase">
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
                <Label className="font-semibold text-xs text-muted-foreground uppercase">
                  Commodity Type
                </Label>
                <Select
                  value={commodityType}
                  onValueChange={(val: "WHEAT" | "MUSTARD") => setCommodityType(val)}
                >
                  <SelectTrigger className="w-full font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WHEAT">Wheat (गेहूं)</SelectItem>
                    <SelectItem value="MUSTARD">Mustard (सरसों)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Drop zone */}
            <div className="border-2 border-dashed border-amber-500/40 hover:border-amber-500 bg-amber-50/20 dark:bg-amber-950/10 rounded-xl p-8 w-full flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group">
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
                    className="max-h-56 rounded-lg shadow-md object-contain border border-border"
                  />
                  <span className="text-xs text-muted-foreground font-medium bg-background px-3 py-1 rounded-full border">
                    {imageFile?.name} ({Math.round((imageFile?.size || 0) / 1024)} KB)
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                    Click or drop another image to replace
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3 py-4">
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

            <Button
              onClick={handleRunOcr}
              disabled={!imageFile || isExtracting}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-6 text-base shadow-lg shadow-amber-500/20 gap-2"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Handwriting with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Convert Image to Grinding Ledger JSON
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Step 2: Side-by-Side Review and Edit */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pt-4">
            {/* Left: Image Viewer */}
            <div className="lg:col-span-5 flex flex-col border rounded-xl overflow-hidden bg-muted/20">
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

              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/5 dark:bg-black/40">
                <img
                  src={enhancedImageUrl || imagePreviewUrl || ""}
                  alt="OCR Enhanced Register Sheet"
                  className="max-w-full h-auto rounded shadow-lg border border-border"
                />
              </div>
            </div>

            {/* Right: Editable JSON Spreadsheet */}
            <div className="lg:col-span-7 flex flex-col border rounded-xl overflow-hidden bg-card">
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
                  className="h-8 text-xs font-semibold gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </Button>
              </div>

              <div className="hidden md:block flex-1 overflow-y-auto p-2">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b bg-muted/40 font-bold text-muted-foreground">
                      <th className="p-2 w-12 text-center">S.No</th>
                      <th className="p-2">English Name</th>
                      <th className="p-2">Hindi Name</th>
                      <th className="p-2">Village (En / Hi)</th>
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
                            className="h-8 w-12 text-center font-bold font-mono px-1 text-xs"
                          />
                        </td>
                        <td className="p-1">
                          <Input
                            value={row.customerNameEn}
                            onChange={(e) => handleRowChange(idx, "customerNameEn", e.target.value)}
                            className="h-8 text-xs px-2"
                          />
                        </td>
                        <td className="p-1">
                          <Input
                            value={row.customerNameHi}
                            onChange={(e) => handleRowChange(idx, "customerNameHi", e.target.value)}
                            className="h-8 text-xs px-2 font-hindi"
                          />
                        </td>
                        <td className="p-1">
                          <div className="flex flex-col gap-1">
                            <Input
                              value={row.villageEn}
                              onChange={(e) => handleRowChange(idx, "villageEn", e.target.value)}
                              placeholder="English Village"
                              className="h-7 text-xs px-2"
                            />
                            <Input
                              value={row.villageHi}
                              onChange={(e) => handleRowChange(idx, "villageHi", e.target.value)}
                              placeholder="Hindi Village"
                              className="h-7 text-xs px-2 font-hindi text-muted-foreground"
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
                            className="h-8 w-20 text-right font-bold text-xs px-2"
                          />
                        </td>
                        <td className="p-1 text-center">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 font-bold ${
                              row.confidence === "HIGH"
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
                            onClick={() => handleDeleteRow(idx)}
                            className="h-7 w-7 text-muted-foreground hover:text-red-500"
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

              {/* Mobile Responsive Cards View */}
              <div className="block md:hidden flex-1 overflow-y-auto p-3 space-y-3">
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
                                  {row.customerNameEn || "Unnamed"}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-hindi truncate leading-relaxed">
                                  {row.customerNameHi || "अज्ञात"}
                                </p>
                                <p className="text-[10px] text-muted-foreground/75 mt-0.5 truncate">
                                  {row.villageEn || "Unknown"}
                                  {row.villageHi ? <span className="font-hindi text-muted-foreground/60"> / {row.villageHi}</span> : null}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-[9px] px-1.5 py-0 font-bold shrink-0 ${
                                  row.confidence === "HIGH"
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
                                  onClick={() => handleDeleteRow(idx)}
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
                              className={`text-[10px] px-1.5 py-0 font-bold ${
                                row.confidence === "HIGH"
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
                              onClick={() => handleDeleteRow(idx)}
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
                              placeholder="Hindi Name"
                              className="h-9 text-xs font-hindi rounded-lg mt-1 bg-background"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Village (En)
                              </Label>
                              <Input
                                value={row.villageEn}
                                onChange={(e) => handleRowChange(idx, "villageEn", e.target.value)}
                                placeholder="English Village"
                                className="h-9 text-xs rounded-lg mt-1 bg-background"
                              />
                            </div>
                            <div>
                              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-hindi">
                                Village (Hi) - गाँव
                              </Label>
                              <Input
                                value={row.villageHi}
                                onChange={(e) => handleRowChange(idx, "villageHi", e.target.value)}
                                placeholder="Hindi Village"
                                className="h-9 text-xs font-hindi rounded-lg mt-1 bg-background text-muted-foreground"
                              />
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
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleAttemptClose} disabled={isSaving} className="h-10 px-4 rounded-xl font-semibold">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
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
                        Save {records.length} Records to Ledger
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

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
    </Dialog>
  );
};

export default GrindingLedgerOcrModal;
