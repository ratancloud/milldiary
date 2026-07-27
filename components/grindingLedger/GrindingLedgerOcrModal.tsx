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
        throw new Error(result.message || "Failed to batch insert records");
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
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
                onClick={handleReset}
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
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full font-medium"
                />
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

              <div className="flex-1 overflow-y-auto p-2">
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

              {/* Save Footer */}
              <div className="p-4 border-t bg-muted/40 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Ready to insert{" "}
                  <span className="font-bold text-foreground">{records.length} records</span>{" "}
                  for <span className="font-bold text-amber-600">{commodityType}</span> on{" "}
                  <span className="font-bold text-foreground">{date}</span>.
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveBulk}
                    disabled={isSaving || records.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold gap-1.5 shadow"
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
    </Dialog>
  );
};

export default GrindingLedgerOcrModal;
