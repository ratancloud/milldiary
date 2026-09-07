"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Hash,
  Scale,
  Wheat,
  Sprout,
  CheckCircle2,
  PenLine,
  Loader2,
  X,
} from "lucide-react";
import { GrindingLedger } from "@/types/grinding-ledger";
import {
  createGrindingLedgerFormSchema,
  CreateGrindingLedgerFormInput,
} from "@/lib/validators/grindingLedgerClient";
import { formateIndDate, formatKg } from "@/lib/helper";
import { translateText } from "@/lib/translate";
import { TransliterationInput } from "./TransliterationInput";
import { VillageAutocomplete } from "./VillageAutocomplete";
import { cn } from "@/lib/utils";

interface GrindingLedgerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: GrindingLedger | null;
}

const RATE_PER_KG = 3;

export default function GrindingLedgerCreateModal({
  isOpen,
  onClose,
  onSuccess,
  editItem,
}: GrindingLedgerCreateModalProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isTranslatingVillageEn, setIsTranslatingVillageEn] = useState(false);
  const [isTranslatingVillageHi, setIsTranslatingVillageHi] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateGrindingLedgerFormInput>({
    resolver: zodResolver(createGrindingLedgerFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      serialNo: 1,
      commodityType: "WHEAT",
      customerNameEn: "",
      customerNameHi: "",
      villageEn: "",
      villageHi: "",
      weight: 0,
    },
  });

  const commodityType = watch("commodityType");
  const watchedDate = watch("date");
  const watchedWeight = watch("weight") || 0;
  const estimatedAmount = Math.round(watchedWeight * RATE_PER_KG);

  const displayDate = watchedDate
    ? formateIndDate(new Date(`${watchedDate}T00:00:00`))
    : formateIndDate(new Date());

  // Populate or reset form whenever editItem or modal open state changes
  useEffect(() => {
    if (isOpen && editItem) {
      const dateStr =
        typeof editItem.date === "string"
          ? editItem.date.split("T")[0]
          : new Date(editItem.date).toISOString().split("T")[0];

      reset({
        date: dateStr,
        serialNo: editItem.serialNo,
        commodityType: editItem.commodityType,
        customerNameEn: editItem.customerNameEn || "",
        customerNameHi: editItem.customerNameHi || "",
        villageEn: editItem.villageEn || "",
        villageHi: editItem.villageHi || "",
        weight: editItem.weight || 0,
      });
    }
  }, [isOpen, editItem, reset]);

  const handleTranslate = async (
    value: string,
    targetField: "customerNameEn" | "customerNameHi" | "villageEn" | "villageHi",
    from: "en" | "hi",
    to: "en" | "hi",
    setLoading: (val: boolean) => void
  ) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const translated = await translateText(value, from, to);
      setValue(targetField, translated, { shouldValidate: true, shouldDirty: true });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVillageChange = (en: string | null, hi: string | null) => {
    if (en !== null && hi !== null) {
      setValue("villageEn", en, { shouldValidate: true, shouldDirty: true });
      setValue("villageHi", hi, { shouldValidate: true, shouldDirty: true });
    } else if (en !== null) {
      setValue("villageEn", en, { shouldValidate: true, shouldDirty: true });
      handleTranslate(en, "villageHi", "en", "hi", setIsTranslatingVillageHi);
    } else if (hi !== null) {
      setValue("villageHi", hi, { shouldValidate: true, shouldDirty: true });
      handleTranslate(hi, "villageEn", "hi", "en", setIsTranslatingVillageEn);
    }
  };

  const onSubmit = async (data: CreateGrindingLedgerFormInput) => {
    if (!editItem) return;
    try {
      const res = await fetch(`/api/grinding-ledger/${editItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          serialNo: Number(data.serialNo),
          weight: Number(data.weight),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update slip record");
      }

      toast.success(`Slip #${data.serialNo} updated successfully!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating slip");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-xl sm:max-w-2xl w-[95vw] sm:w-full p-0 gap-0 overflow-hidden border-border/80 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl bg-card flex flex-col max-h-[90vh]">
        {/* ── Modal Header ── */}
        <div className="px-5 sm:px-6 py-4 border-b border-border/70 dark:border-white/10 bg-secondary/30 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/25 shadow-2xs shrink-0">
              <PenLine className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  Edit Grinding Slip
                </DialogTitle>
                {editItem && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-primary/15 text-primary border border-primary/25">
                    #{editItem.serialNo}
                  </span>
                )}
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Update customer details, milled weight, or commodity type.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* ── Modal Body (Scrollable) ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
            {/* Row 1: Slip Metadata (Date, Serial No, Commodity) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Slip Date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  <span>Date</span>
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-between w-full h-10 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-secondary/40 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                    >
                      <span className="font-mono">{displayDate}</span>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto overflow-hidden p-0 rounded-2xl border-border shadow-xl"
                  >
                    <Calendar
                      mode="single"
                      selected={watchedDate ? new Date(`${watchedDate}T00:00:00`) : undefined}
                      onSelect={(selectedDate) => {
                        if (!selectedDate) return;
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                        const day = String(selectedDate.getDate()).padStart(2, "0");
                        setValue("date", `${year}-${month}-${day}`, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setCalendarOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-xs text-destructive font-medium">{errors.date.message}</p>
                )}
              </div>

              {/* Serial Number */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="serialNo"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Hash className="h-3.5 w-3.5 text-primary" />
                  <span>Serial No</span>
                </Label>
                <Input
                  type="number"
                  id="serialNo"
                  onWheel={(e) => e.currentTarget.blur()}
                  {...register("serialNo", { valueAsNumber: true })}
                  placeholder="1"
                  className="w-full font-mono font-bold text-xs sm:text-sm h-10 rounded-xl shadow-2xs bg-background"
                />
                {errors.serialNo && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.serialNo.message}
                  </p>
                )}
              </div>

              {/* Commodity Type Segmented Switch */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  {commodityType === "WHEAT" ? (
                    <Wheat className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Sprout className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  <span>Commodity</span>
                </Label>
                <div className="grid grid-cols-2 p-1 rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-border/80 dark:border-white/10 h-10">
                  <button
                    type="button"
                    onClick={() => setValue("commodityType", "WHEAT", { shouldDirty: true })}
                    className={cn(
                      "flex items-center justify-center gap-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      commodityType === "WHEAT"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Wheat className="w-3.5 h-3.5 shrink-0" />
                    <span>Wheat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("commodityType", "MUSTARD", { shouldDirty: true })}
                    className={cn(
                      "flex items-center justify-center gap-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      commodityType === "MUSTARD"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Sprout className="w-3.5 h-3.5 shrink-0" />
                    <span>Sarso</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Customer Name (Bilingual with live transliteration) */}
            <div className="space-y-1.5">
              <TransliterationInput
                labelHi="Customer Name (Hindi) - ग्राहक का नाम"
                labelEn="Customer Name (English)"
                valueHi={watch("customerNameHi") || ""}
                valueEn={watch("customerNameEn") || ""}
                onChange={(hi, en) => {
                  setValue("customerNameHi", hi, { shouldValidate: true, shouldDirty: true });
                  setValue("customerNameEn", en, { shouldValidate: true, shouldDirty: true });
                }}
                className="sm:flex-row"
              />
              {(errors.customerNameEn || errors.customerNameHi) && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.customerNameEn?.message || errors.customerNameHi?.message}
                </p>
              )}
            </div>

            {/* Row 3: Village Information (English & Hindi) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                  <span>Village (English)</span>
                  {isTranslatingVillageEn && (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  )}
                </Label>
                <VillageAutocomplete
                  value={watch("villageEn") || ""}
                  lang="en"
                  onChange={handleVillageChange}
                  className="h-10 font-medium rounded-xl"
                  placeholder="e.g. Koath"
                />
                {errors.villageEn && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.villageEn.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center justify-between font-hindi">
                  <span>गाँव (हिंदी)</span>
                  {isTranslatingVillageHi && (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  )}
                </Label>
                <VillageAutocomplete
                  value={watch("villageHi") || ""}
                  lang="hi"
                  onChange={handleVillageChange}
                  className="h-10 font-medium font-hindi rounded-xl"
                  placeholder="e.g. कोआथ"
                />
                {errors.villageHi && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.villageHi.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Milled Weight & Live Price Calculation */}
            <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-secondary/20 dark:bg-white/[0.02] p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="weight"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Scale className="h-3.5 w-3.5 text-primary" />
                  <span>Milled Weight</span>
                </Label>
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <span>Est. Amount:</span>
                  <span className="tabular-nums font-extrabold text-sm">₹{estimatedAmount}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">(@ ₹3/kg)</span>
                </span>
              </div>

              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  id="weight"
                  onWheel={(e) => e.currentTarget.blur()}
                  {...register("weight", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full font-mono font-extrabold text-base sm:text-lg pr-12 h-11 rounded-xl shadow-2xs bg-background focus:border-primary"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold font-mono text-muted-foreground select-none">
                  KG
                </span>
              </div>
              {errors.weight && (
                <p className="text-xs text-destructive font-medium">{errors.weight.message}</p>
              )}
            </div>
          </div>

          {/* ── Modal Footer (Sticky) ── */}
          <div className="px-5 sm:px-6 py-3.5 bg-secondary/30 dark:bg-white/[0.02] border-t border-border/70 dark:border-white/10 flex items-center justify-end gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl font-bold text-xs sm:text-sm shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-2 cursor-pointer active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Update Slip</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
