"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { formateIndDate, formatRs } from "@/lib/helper";
import { Section } from "@/components/millDataForm/Section";
import { NumberInput } from "@/components/millDataForm/NumberInput";
import { KgRs } from "@/components/millDataForm/KgRs";
import { TextareaBlock } from "@/components/millDataForm/TextareaBlock";
import { ReadOnly } from "@/components/millDataForm/ReadOnly";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function CreateMillDataClient() {
  const [open, setOpen] = useState(false);
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
      millDebit: 0,
      homeDebit: 0,
    },
  });

  // Safe field watching (compiler-safe) --->
  const [
    millCredit,
    flourRs,
    oilRs,
    khariRs,
    sarsoRs,
    gehumRs,
    staff1Rs,
    staff2Rs,
    millDebit,
    homeDebit,
  ] = useWatch({
    control,
    name: [
      "millCredit",
      "flourRs",
      "oilRs",
      "khariRs",
      "sarsoRs",
      "gehumRs",
      "staff1Rs",
      "staff2Rs",
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

      toast.success("Entry created successfully");
      router.push("/mill-data");
      router.refresh();
    } catch {
      toast.error("Failed to connect to server");
    }
  };

  const onInvalid = () => {
    const firstError = Object.keys(errors)[0];
    document
      .getElementById(firstError)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold rounded-md border bg-muted px-3 py-1">
          New Entry
        </h1>

        <Popover open={open} onOpenChange={() => setOpen(!open)}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>{displayDate}</span>
            </button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-auto overflow-hidden p-0">
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
      </div>

      <Card>
        <CardContent className="space-y-10 pt-6">
          <Section title="Credits">
            <NumberInput label="Mill Credit" error={errors.millCredit}>
              <Input
                id="millCredit"
                type="number"
                {...register("millCredit", { valueAsNumber: true })}
              />
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

          <Section title="Debits">
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

            <NumberInput label="Bhim Rs" error={errors.staff1Rs}>
              <Input
                id="staff1Rs"
                type="number"
                {...register("staff1Rs", { valueAsNumber: true })}
              />
            </NumberInput>

            <NumberInput label="Viswa Rs" error={errors.staff2Rs}>
              <Input
                id="staff2Rs"
                type="number"
                {...register("staff2Rs", { valueAsNumber: true })}
              />
            </NumberInput>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Staff Selection</label>
              <Select onValueChange={(v) => setValue("staffDescription", v)}>
                <SelectTrigger id="staffDescription" className="w-full">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bhim">Bhim</SelectItem>
                  <SelectItem value="viswa">Viswa</SelectItem>
                  <SelectItem value="bhim+viswa">Bhim + Viswa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <NumberInput label="Mill Debit" error={errors.millDebit}>
                <Input
                  id="millDebit"
                  type="number"
                  {...register("millDebit", { valueAsNumber: true })}
                />
              </NumberInput>
            </div>

            <TextareaBlock label="Mill Description">
              <Textarea id="millDescription" {...register("millDescription")} />
            </TextareaBlock>
            <div className="space-y-1 md:col-span-2">
              <NumberInput label="Home Debit" error={errors.homeDebit}>
                <Input
                  id="homeDebit"
                  type="number"
                  {...register("homeDebit", { valueAsNumber: true })}
                />
              </NumberInput>
            </div>

            <TextareaBlock label="Home Description">
              <Textarea id="homeDescription" {...register("homeDescription")} />
            </TextareaBlock>
          </Section>

          <Section title="Summary">
            <ReadOnly label="Total Credit" value={formatRs(totalCredit)} />
            <ReadOnly label="Total Debit" value={formatRs(totalDebit)} />
          </Section>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit, onInvalid)}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
