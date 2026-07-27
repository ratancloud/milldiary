"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, PlusSquare, Edit, CalendarIcon } from "lucide-react";
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
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5 text-blue-500" /> Edit Grinding Slip #{editItem?.serialNo}
              </>
            ) : (
              <>
                <PlusSquare className="h-5 w-5 text-primary" /> Add New Grinding Slip
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Enter customer names, village location, and milling weight in Kg.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Date */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Date
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span>{displayDate}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto overflow-hidden p-0">
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
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>

          {/* Serial No */}
          <div className="space-y-1.5">
            <Label htmlFor="serialNo" className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Serial No (S.No)
            </Label>
            <Input
              type="number"
              id="serialNo"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("serialNo", { valueAsNumber: true })}
              placeholder="101"
              className="w-full font-mono font-bold h-11 rounded-xl"
            />
            {errors.serialNo && (
              <p className="text-xs text-red-500">{errors.serialNo.message}</p>
            )}
          </div>

          {/* Commodity Type */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Commodity Type
            </Label>
            <Select
              value={commodityType}
              onValueChange={(val: "WHEAT" | "MUSTARD") =>
                setValue("commodityType", val)
              }
            >
              <SelectTrigger className="w-full font-semibold h-11 rounded-xl">
                <SelectValue placeholder="Select Commodity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WHEAT" className="font-medium">Wheat (गेहूं)</SelectItem>
                <SelectItem value="MUSTARD" className="font-medium">Mustard (सरसों)</SelectItem>
              </SelectContent>
            </Select>
            {errors.commodityType && (
              <p className="text-xs text-red-500">{errors.commodityType.message}</p>
            )}
          </div>
        </div>

        <div className="border-t border-border/60 pt-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Customer Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="customerNameEn" className="text-xs font-semibold">
                Name (English)
              </Label>
              <Input
                id="customerNameEn"
                {...register("customerNameEn")}
                placeholder="e.g. Ram Kumar"
                className="h-11 rounded-xl font-medium"
              />
              {errors.customerNameEn && (
                <p className="text-xs text-red-500">{errors.customerNameEn.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customerNameHi" className="text-xs font-semibold font-hindi">
                Name (Hindi) - नाम
              </Label>
              <Input
                id="customerNameHi"
                {...register("customerNameHi")}
                placeholder="e.g. राम कुमार"
                className="h-11 rounded-xl font-medium font-hindi"
              />
              {errors.customerNameHi && (
                <p className="text-xs text-red-500">{errors.customerNameHi.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="villageEn" className="text-xs font-semibold">
              Village (English)
            </Label>
            <Input
              id="villageEn"
              {...register("villageEn")}
              placeholder="e.g. Agiaon Bazar"
              className="h-11 rounded-xl font-medium"
            />
            {errors.villageEn && (
              <p className="text-xs text-red-500">{errors.villageEn.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="villageHi" className="text-xs font-semibold font-hindi">
              Village (Hindi) - गाँव
            </Label>
            <Input
              id="villageHi"
              {...register("villageHi")}
              placeholder="e.g. अगिआँव बाजार"
              className="h-11 rounded-xl font-medium font-hindi"
            />
            {errors.villageHi && (
              <p className="text-xs text-red-500">{errors.villageHi.message}</p>
            )}
          </div>
        </div>

        <div className="border-t border-border/60 pt-4">
          <div className="space-y-1.5 w-full sm:max-w-[240px]">
            <Label htmlFor="weight" className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Milled Weight (Kg)
            </Label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                id="weight"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("weight", { valueAsNumber: true })}
                placeholder="45.5"
                className="w-full font-bold text-xl pr-12 h-12 rounded-xl"
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-muted-foreground">
                KG
              </span>
            </div>
            {errors.weight && (
              <p className="text-xs text-red-500">{errors.weight.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-11 px-6 rounded-xl font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-8 rounded-xl shadow-md shadow-primary/20 gap-2"
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
