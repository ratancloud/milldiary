"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Loader2,
  CalendarIcon,
  PenLine,
  Hash,
  Scale,
  Wheat,
  Sprout,
  CheckCircle2,
} from "lucide-react";
import { GrindingLedger } from "@/types/grinding-ledger";
import {
  createGrindingLedgerFormSchema,
  CreateGrindingLedgerFormInput,
} from "@/lib/validators/grindingLedgerClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formateIndDate } from "@/lib/helper";
import { translateText } from "@/lib/translate";
import { VillageAutocomplete } from "./VillageAutocomplete";
import { TransliterationInput } from "./TransliterationInput";
import { cn } from "@/lib/utils";

interface GrindingLedgerManualFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editItem?: GrindingLedger | null;
  modeSwitch?: React.ReactNode;
}

const GrindingLedgerManualForm: React.FC<GrindingLedgerManualFormProps> = ({
  onSuccess,
  onCancel,
  editItem,
  modeSwitch,
}) => {
  const isEditing = !!editItem;

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

  const [calendarOpen, setCalendarOpen] = useState(false);
  const commodityType = watch("commodityType");
  const watchedDate = watch("date");

  // Translation States
  const [isTranslatingVillageEn, setIsTranslatingVillageEn] = useState(false);
  const [isTranslatingVillageHi, setIsTranslatingVillageHi] = useState(false);

  const displayDate = watchedDate
    ? formateIndDate(new Date(`${watchedDate}T00:00:00`))
    : formateIndDate(new Date());

  useEffect(() => {
    if (editItem) {
      const dateStr = new Date(editItem.date).toISOString().split("T")[0];
      reset({
        date: dateStr,
        serialNo: editItem.serialNo,
        commodityType: editItem.commodityType,
        customerNameEn: editItem.customerNameEn,
        customerNameHi: editItem.customerNameHi,
        villageEn: editItem.villageEn,
        villageHi: editItem.villageHi,
        weight: editItem.weight,
      });
    } else {
      reset({
        date: new Date().toISOString().split("T")[0],
        serialNo: 1,
        commodityType: "WHEAT",
        customerNameEn: "",
        customerNameHi: "",
        villageEn: "",
        villageHi: "",
        weight: 0,
      });
    }
  }, [editItem, reset]);

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
    try {
      const url = isEditing
        ? `/api/grinding-ledger/${editItem?.id}`
        : "/api/grinding-ledger";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          serialNo: Number(data.serialNo),
          weight: Number(data.weight),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save record");
      }

      toast.success(
        isEditing
          ? "Ledger record updated successfully!"
          : "New record added to Grinding Ledger!"
      );
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while saving");
    }
  };

  return (
    <div
      className={cn(
        !isEditing &&
        "rounded-2xl border border-border/80 dark:border-white/10 bg-card p-4 sm:p-6 shadow-[var(--card-shadow)] space-y-6"
      )}
    >
      {/* Card Header with Integrated Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 dark:border-white/10 pb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/25 shrink-0">
              <PenLine className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
                {isEditing ? `Edit Grinding Slip #${editItem?.serialNo}` : "Manual Grinding Slip"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Update slip customer details, village, or milled weight."
                  : "Enter customer details with live English-to-Hindi auto-transliteration."}
              </p>
            </div>
          </div>
        </div>

        {/* Mode switch sits directly on the card header */}
        {modeSwitch && <div className="w-full sm:w-auto shrink-0">{modeSwitch}</div>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">
        {/* Section 1: Slip Metadata (Date, Serial No, Commodity) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Slip Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="h-3 w-3 text-primary" />
              <span>Date</span>
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                >
                  <span className="font-mono text-xs sm:text-sm">{displayDate}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto overflow-hidden p-0 rounded-xl border-border shadow-lg">
                <Calendar
                  mode="single"
                  selected={watchedDate ? new Date(`${watchedDate}T00:00:00`) : undefined}
                  onSelect={(selectedDate) => {
                    if (!selectedDate) return;
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                    const day = String(selectedDate.getDate()).padStart(2, "0");
                    setValue("date", `${year}-${month}-${day}`, { shouldValidate: true, shouldDirty: true });
                    setCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-xs text-destructive font-medium">{errors.date.message}</p>}
          </div>

          {/* Serial Number */}
          <div className="space-y-1.5">
            <Label htmlFor="serialNo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="h-3 w-3 text-primary" />
              <span>Serial No</span>
            </Label>
            <div className="relative">
              <Input
                type="number"
                id="serialNo"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("serialNo", { valueAsNumber: true })}
                placeholder="101"
                className="w-full font-mono font-bold h-10 rounded-xl shadow-2xs"
              />
            </div>
            {errors.serialNo && <p className="text-xs text-destructive font-medium">{errors.serialNo.message}</p>}
          </div>

          {/* Commodity Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              {commodityType === "WHEAT" ? (
                <Wheat className="h-3 w-3 text-amber-600" />
              ) : (
                <Sprout className="h-3 w-3 text-yellow-600" />
              )}
              <span>Commodity</span>
            </Label>
            <Select
              value={commodityType}
              onValueChange={(val: "WHEAT" | "MUSTARD") => setValue("commodityType", val)}
            >
              <SelectTrigger className="w-full font-semibold h-10 rounded-xl shadow-2xs bg-background">
                <SelectValue placeholder="Select Commodity" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="WHEAT" className="font-semibold cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Wheat className="h-3.5 w-3.5 text-amber-600" />
                    <span>Wheat (गेहूं)</span>
                  </div>
                </SelectItem>
                <SelectItem value="MUSTARD" className="font-semibold cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-3.5 w-3.5 text-yellow-600" />
                    <span>Mustard (सरसों)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.commodityType && <p className="text-xs text-destructive font-medium">{errors.commodityType.message}</p>}
          </div>
        </div>

        {/* Section 2: Customer Name (Hindi & English with live transliteration) */}
        <div className="space-y-1.5 pt-1">
          <TransliterationInput
            labelHi="Customer Name (Hindi) - ग्राहक का नाम"
            labelEn="Customer Name (English)"
            valueHi={watch("customerNameHi")}
            valueEn={watch("customerNameEn")}
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

        {/* Section 3: Village Autocomplete (English & Hindi) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Village (English)</span>
              {isTranslatingVillageEn && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </Label>
            <VillageAutocomplete
              value={watch("villageEn")}
              lang="en"
              onChange={handleVillageChange}
              className="h-10 font-medium rounded-xl"
              placeholder="e.g. Agiaon Bazar"
            />
            {errors.villageEn && <p className="text-xs text-destructive font-medium">{errors.villageEn.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center justify-between font-hindi">
              <span>गाँव (हिंदी)</span>
              {isTranslatingVillageHi && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </Label>
            <VillageAutocomplete
              value={watch("villageHi")}
              lang="hi"
              onChange={handleVillageChange}
              className="h-10 font-medium font-hindi rounded-xl"
              placeholder="e.g. अगिआँव बाजार"
            />
            {errors.villageHi && <p className="text-xs text-destructive font-medium">{errors.villageHi.message}</p>}
          </div>
        </div>

        {/* Section 4: Milled Weight */}
        <div className="space-y-1.5">
          <Label htmlFor="weight" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="h-3 w-3 text-primary" />
            <span>Milled Weight</span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              step="0.01"
              id="weight"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("weight", { valueAsNumber: true })}
              placeholder="45.50"
              className="w-full font-mono font-extrabold text-sm sm:text-base pr-12 h-11 rounded-xl shadow-2xs transition-colors focus:border-primary"
            />
            <span className="absolute right-3.5 top-3 text-xs font-extrabold font-mono text-muted-foreground select-none">
              KG
            </span>
          </div>
          {errors.weight && <p className="text-xs text-destructive font-medium">{errors.weight.message}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-3 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl font-semibold mt-2 sm:mt-0 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-6 rounded-xl font-bold shadow-sm gap-2 cursor-pointer active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>{isEditing ? "Update Slip" : "Save Record"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GrindingLedgerManualForm;
