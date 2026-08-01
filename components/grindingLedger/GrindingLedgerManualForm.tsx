"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, CalendarIcon, Languages } from "lucide-react";
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


interface GrindingLedgerManualFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editItem?: GrindingLedger | null;
}

const GrindingLedgerManualForm: React.FC<GrindingLedgerManualFormProps> = ({
  onSuccess,
  onCancel,
  editItem,
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
    <div className={`${!isEditing ? "rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-6" : ""}`}>
      <div className="flex flex-col space-y-1.5 text-center sm:text-left border-b border-border/60 pb-4">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          {isEditing ? `Edit Grinding Slip #${editItem?.serialNo}` : "New Grinding Slip"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill in the details accurately. Fields will auto-translate between English and Hindi.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                >
                  <span>{displayDate}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto overflow-hidden p-0 rounded-md border-border shadow-md">
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

          <div className="space-y-1.5">
            <Label htmlFor="serialNo" className="text-xs font-semibold text-muted-foreground">Serial No</Label>
            <Input
              type="number"
              id="serialNo"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("serialNo", { valueAsNumber: true })}
              placeholder="101"
              className="w-full font-medium h-9 rounded-md shadow-sm"
            />
            {errors.serialNo && <p className="text-xs text-destructive font-medium">{errors.serialNo.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <TransliterationInput
              labelHi="Customer Name (Hi)"
              labelEn="Customer Name (En)"
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

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              Village (En)
              {isTranslatingVillageEn && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </Label>
            <VillageAutocomplete
              value={watch("villageEn")}
              lang="en"
              onChange={handleVillageChange}
              className="h-9 font-medium"
              placeholder="e.g. Agiaon Bazar"
            />
            {errors.villageEn && <p className="text-xs text-destructive font-medium">{errors.villageEn.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2 font-hindi">
              Village (Hi)
              {isTranslatingVillageHi && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </Label>
            <VillageAutocomplete
              value={watch("villageHi")}
              lang="hi"
              onChange={handleVillageChange}
              className="h-9 font-medium font-hindi"
              placeholder="e.g. अगिआँव बाजार"
            />
            {errors.villageHi && <p className="text-xs text-destructive font-medium">{errors.villageHi.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Commodity</Label>
            <Select
              value={commodityType}
              onValueChange={(val: "WHEAT" | "MUSTARD") => setValue("commodityType", val)}
            >
              <SelectTrigger className="w-full font-medium h-9 rounded-md shadow-sm bg-background">
                <SelectValue placeholder="Select Commodity" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                <SelectItem value="WHEAT">Wheat (गेहूं)</SelectItem>
                <SelectItem value="MUSTARD">Mustard (सरसों)</SelectItem>
              </SelectContent>
            </Select>
            {errors.commodityType && <p className="text-xs text-destructive font-medium">{errors.commodityType.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weight" className="text-xs font-semibold text-muted-foreground">Milled Weight (Kg)</Label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                id="weight"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("weight", { valueAsNumber: true })}
                placeholder="45.50"
                className="w-full font-semibold pr-10 h-9 rounded-md shadow-sm transition-colors focus:border-primary"
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-muted-foreground">KG</span>
            </div>
            {errors.weight && <p className="text-xs text-destructive font-medium">{errors.weight.message}</p>}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-9 px-4 rounded-md font-medium mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 px-6 rounded-md font-medium shadow-sm gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? "Update Slip" : "Save Record"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GrindingLedgerManualForm;
