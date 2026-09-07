"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CalendarIcon,
  Loader2,
  TrendingUp,
  TrendingDown,
  Scale,
  Wheat,
  Droplets,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMillDataFormSchema,
  CreateMillDataFormInput,
} from "@/lib/validators/millDataClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formateIndDate, formatRs, formatKg } from "@/lib/helper";
import { Section } from "@/components/millDataForm/Section";
import { NumberInput } from "@/components/millDataForm/NumberInput";
import { PageHeader } from "@/components/layout/PageHeader";
import { KgRs } from "@/components/millDataForm/KgRs";
import { TextareaBlock } from "@/components/millDataForm/TextareaBlock";
import { ReadOnly } from "@/components/millDataForm/ReadOnly";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CreateMillDataClient() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<CreateMillDataFormInput>({
    resolver: zodResolver(createMillDataFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],

      millCredit: 0,
      flourWeight: 0,
      flourRs: 0,
      oilWeight: 0,
      oilRs: 0,
      khariWeight: 0,
      khariRs: 0,

      sarsoWeight: 0,
      sarsoRs: 0,
      gehumWeight: 0,
      gehumRs: 0,

      staff1Rs: 0,
      staff2Rs: 0,
      staffDescription: "",
      millDebit: 0,
      millDescription: "",
      homeDebit: 0,
      homeDescription: "",
    },
  });

  // Watch field values for dynamic reactive calculations
  const [
    millCredit,
    flourWeight,
    flourRs,
    oilWeight,
    oilRs,
    khariWeight,
    khariRs,
    sarsoWeight,
    sarsoRs,
    gehumWeight,
    gehumRs,
    staff1Rs,
    staff2Rs,
    staffDescription,
    millDebit,
    homeDebit,
  ] = useWatch({
    control,
    name: [
      "millCredit",
      "flourWeight",
      "flourRs",
      "oilWeight",
      "oilRs",
      "khariWeight",
      "khariRs",
      "sarsoWeight",
      "sarsoRs",
      "gehumWeight",
      "gehumRs",
      "staff1Rs",
      "staff2Rs",
      "staffDescription",
      "millDebit",
      "homeDebit",
    ],
  });

  const watchedDate = useWatch({ control, name: "date" });

  const displayDate = watchedDate
    ? formateIndDate(new Date(`${watchedDate}T00:00:00`))
    : formateIndDate(new Date());

  const totalCredit =
    (millCredit ?? 0) + (flourRs ?? 0) + (oilRs ?? 0) + (khariRs ?? 0);

  const totalDebit =
    (sarsoRs ?? 0) +
    (gehumRs ?? 0) +
    (staff1Rs ?? 0) +
    (staff2Rs ?? 0) +
    (millDebit ?? 0) +
    (homeDebit ?? 0);

  const netBalance = totalCredit - totalDebit;
  const isNetPositive = netBalance >= 0;

  /* -------------------------------- Submit -------------------------------- */

  const onSubmit = async (formData: CreateMillDataFormInput) => {
    try {
      const res = await fetch("/api/mill-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.errors?.properties) {
          Object.entries(json.errors.properties).forEach(
            ([field, val]: any) => {
              setError(field as any, {
                message: val.message || val.errors?.[0],
              });
            }
          );

          const firstError = Object.keys(json.errors.properties)[0];
          document
            .getElementById(firstError)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          toast.error(json.message || "Failed to create entry");
        }
        return;
      }

      toast.success("Mill entry created successfully!");
      router.push("/mill-data");
      router.refresh();
    } catch {
      toast.error("Failed to connect to server");
    }
  };

  const onInvalid = () => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      document
        .getElementById(firstError)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Breadcrumb & Header */}
      <PageHeader
        backHref="/mill-data"
        items={[
          { label: "Mill Data", href: "/mill-data" },
          { label: "New Entry" },
        ]}
        actions={
          <Popover open={open} onOpenChange={() => setOpen(!open)}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="h-9 sm:h-10 inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/40 hover:bg-secondary/70 px-3 sm:px-3.5 text-xs font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono">{displayDate}</span>
              </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-auto overflow-hidden p-0 rounded-2xl border-border shadow-xl">
              <Calendar
                mode="single"
                selected={
                  watchedDate ? new Date(`${watchedDate}T00:00:00`) : undefined
                }
                onSelect={(date) => {
                  if (!date) return;

                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");

                  const istDate = `${year}-${month}-${day}`;

                  setValue("date", istDate, { shouldDirty: true });
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        }
      />

      <Card className="rounded-2xl border border-border/80 dark:border-white/10 shadow-[var(--card-shadow)] overflow-hidden">
        <CardContent className="space-y-8 px-4 sm:px-6">
          {/* Section 1: Credits */}
          <Section
            title="Credits"
            icon={TrendingUp}
            badge={
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                Total Inflow: ₹{formatRs(totalCredit)}
              </span>
            }
          >
            <NumberInput label="Mill Credit (Rs)" error={errors.millCredit}>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-xs text-muted-foreground font-semibold pointer-events-none select-none">
                  ₹
                </span>
                <Input
                  id="millCredit"
                  type="number"
                  step="any"
                  placeholder="0"
                  onWheel={(e) => e.currentTarget.blur()}
                  {...register("millCredit", { valueAsNumber: true })}
                  className="pl-7 font-medium tabular-nums"
                />
              </div>
            </NumberInput>

            <KgRs
              label="Flour"
              kg="flourWeight"
              rs="flourRs"
              register={register}
              errors={errors}
            />
            <KgRs
              label="Oil"
              kg="oilWeight"
              rs="oilRs"
              register={register}
              errors={errors}
            />
            <KgRs
              label="Khari"
              kg="khariWeight"
              rs="khariRs"
              register={register}
              errors={errors}
            />
          </Section>

          {/* Section 2: Debits */}
          <Section
            title="Debits"
            icon={TrendingDown}
            badge={
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                Total Outflow: ₹{formatRs(totalDebit)}
              </span>
            }
          >
            <KgRs
              label="Sarso"
              kg="sarsoWeight"
              rs="sarsoRs"
              register={register}
              errors={errors}
            />
            <KgRs
              label="Gehum"
              kg="gehumWeight"
              rs="gehumRs"
              register={register}
              errors={errors}
            />

            <NumberInput label="Bhim (Rs)" error={errors.staff1Rs}>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-xs text-muted-foreground font-semibold pointer-events-none select-none">
                  ₹
                </span>
                <Input
                  id="staff1Rs"
                  type="number"
                  step="any"
                  placeholder="0"
                  onWheel={(e) => e.currentTarget.blur()}
                  {...register("staff1Rs", { valueAsNumber: true })}
                  className="pl-7 font-medium tabular-nums"
                />
              </div>
            </NumberInput>

            <NumberInput label="Viswa (Rs)" error={errors.staff2Rs}>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-xs text-muted-foreground font-semibold pointer-events-none select-none">
                  ₹
                </span>
                <Input
                  id="staff2Rs"
                  type="number"
                  step="any"
                  placeholder="0"
                  onWheel={(e) => e.currentTarget.blur()}
                  {...register("staff2Rs", { valueAsNumber: true })}
                  className="pl-7 font-medium tabular-nums"
                />
              </div>
            </NumberInput>

            <div className="space-y-1.5 md:col-span-2" id="staffDescription">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Staff Selection
              </label>
              <Select
                value={staffDescription || ""}
                onValueChange={(v) => setValue("staffDescription", v, { shouldDirty: true })}
              >
                <SelectTrigger className="w-full h-10 rounded-lg bg-background border-input font-medium">
                  <SelectValue placeholder="Select staff on duty" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="bhim">Bhim</SelectItem>
                  <SelectItem value="viswa">Viswa</SelectItem>
                  <SelectItem value="bhim+viswa">Bhim + Viswa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <NumberInput label="Mill Debit (Rs)" error={errors.millDebit}>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-muted-foreground font-semibold pointer-events-none select-none">
                    ₹
                  </span>
                  <Input
                    id="millDebit"
                    type="number"
                    step="any"
                    placeholder="0"
                    onWheel={(e) => e.currentTarget.blur()}
                    {...register("millDebit", { valueAsNumber: true })}
                    className="pl-7 font-medium tabular-nums"
                  />
                </div>
              </NumberInput>
            </div>

            <TextareaBlock label="Mill Description">
              <Textarea
                id="millDescription"
                placeholder="e.g. Belt repair, machine oil, electricity bill, diesel..."
                className="min-h-18 rounded-lg bg-background text-xs resize-none"
                {...register("millDescription")}
              />
            </TextareaBlock>

            <div className="space-y-1 md:col-span-2">
              <NumberInput label="Home Debit (Rs)" error={errors.homeDebit}>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-muted-foreground font-semibold pointer-events-none select-none">
                    ₹
                  </span>
                  <Input
                    id="homeDebit"
                    type="number"
                    step="any"
                    placeholder="0"
                    onWheel={(e) => e.currentTarget.blur()}
                    {...register("homeDebit", { valueAsNumber: true })}
                    className="pl-7 font-medium tabular-nums"
                  />
                </div>
              </NumberInput>
            </div>

            <TextareaBlock label="Home Description">
              <Textarea
                id="homeDescription"
                placeholder="e.g. Household groceries, family expense, personal cash..."
                className="min-h-18 rounded-lg bg-background text-xs resize-none"
                {...register("homeDescription")}
              />
            </TextareaBlock>
          </Section>

          {/* Section 3: Summary */}
          <Section
            title="Summary"
            icon={Scale}
            badge={
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md border ${isNetPositive
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                  }`}
              >
                Net: {isNetPositive ? "+" : "-"}₹{formatRs(Math.abs(netBalance))}
              </span>
            }
          >
            <ReadOnly
              label="Total Credit"
              value={formatRs(totalCredit)}
            />
            <ReadOnly
              label="Total Debit"
              value={formatRs(totalDebit)}
            />
          </Section>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-border/70">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="rounded-xl px-5 active:scale-[0.98]"
            >
              Cancel
            </Button>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isSubmitting}
                  className="rounded-xl px-6 font-bold shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Entry
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="rounded-2xl border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Mill Entry Creation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to create this entry for{" "}
                    <strong>{displayDate}</strong>? Please verify the summary
                    figures below before confirming:
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-2 p-3.5 rounded-xl bg-muted/50 border border-border/60 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Inflow (Credits):</span>
                    <span className="font-semibold text-foreground">₹{formatRs(totalCredit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Outflow (Debits):</span>
                    <span className="font-semibold text-foreground">₹{formatRs(totalDebit)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1.5 border-t border-border/60">
                    <span className="text-foreground">Net Margin:</span>
                    <span className={isNetPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                      {isNetPositive ? "+" : "-"}₹{formatRs(Math.abs(netBalance))}
                    </span>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting} className="rounded-xl">
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    disabled={isSubmitting}
                    className="rounded-xl font-bold"
                    onClick={() => {
                      setConfirmOpen(false);
                      handleSubmit(onSubmit, onInvalid)();
                    }}
                  >
                    Yes, Create Entry
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
