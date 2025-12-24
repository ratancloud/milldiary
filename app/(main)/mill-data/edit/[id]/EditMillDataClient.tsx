"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Calendar, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateMillDataFormSchema,
  UpdateMillDataFormInput,
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
import EditMillDataSkeleton from "@/components/skelton/EditMillDataSkeleton";
import { MillData } from "@/types/mill-data";
import { Section } from "@/components/millDataForm/Section";
import { NumberInput } from "@/components/millDataForm/NumberInput";
import { KgRs } from "@/components/millDataForm/KgRs";
import { TextareaBlock } from "@/components/millDataForm/TextareaBlock";
import { ReadOnly } from "@/components/millDataForm/ReadOnly";

export default function EditMillDataClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { isSubmitting, dirtyFields, errors },
  } = useForm<UpdateMillDataFormInput>({
    resolver: zodResolver(updateMillDataFormSchema),
    shouldFocusError: true, // Native focus
  });

  /* ----------------------------- Fetch Data ----------------------------- */

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/mill-data/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          toast.error(json.message || "Failed to load data");
          router.replace("/mill-data");
          return;
        }
        const data: MillData = json.data;
        setDate(new Date(data.date));
        reset(data);
      } catch {
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset, router]);

  /* -------------------------- Optimized Watch ---------------------------- */

  const watchedValues = watch([
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
  ]);

  const { totalCredit, totalDebit } = useMemo(() => {
    const n = (v?: number) => v ?? 0;
    return {
      totalCredit:
        n(watchedValues[0]) +
        n(watchedValues[1]) +
        n(watchedValues[2]) +
        n(watchedValues[3]),
      totalDebit:
        n(watchedValues[4]) +
        n(watchedValues[5]) +
        n(watchedValues[6]) +
        n(watchedValues[7]) +
        n(watchedValues[8]) +
        n(watchedValues[9]),
    };
  }, [watchedValues]);

  /* ------------------------------ Submit ------------------------------- */

  const onSubmit = async (formData: UpdateMillDataFormInput) => {
    const dirtyKeys = Object.keys(dirtyFields) as Array<
      keyof UpdateMillDataFormInput
    >;

    if (dirtyKeys.length === 0) {
      toast.error("No changes to save");
      return;
    }

    const payload: Partial<UpdateMillDataFormInput> = {};
    dirtyKeys.forEach((key) => {
      (payload as any)[key] = formData[key];
    });

    try {
      const res = await fetch(`/api/mill-data/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.errors?.properties) {
          Object.entries(json.errors.properties).forEach(
            ([field, val]: any) => {
              setError(field as keyof UpdateMillDataFormInput, {
                message: val.message || val.errors?.[0],
              });
            }
          );

          // --- AUTO SCROLL TO ERROR ---
          const firstErrorField = Object.keys(json.errors.properties)[0];
          const element = document.getElementById(firstErrorField);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          toast.error(json.message || "Update failed");
        }
        return;
      }

      toast.success("Updated successfully");
      router.back();
    } catch {
      toast.error("Failed to connect to server");
    }
  };

  // Helper for scrolling on client-side validation errors
  const onInvalid = () => {
    const firstError = Object.keys(errors)[0];
    const el = document.getElementById(firstError);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (loading) return <EditMillDataSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold rounded-md border bg-muted px-3 py-1">
          Edit Entry
        </h1>
        {date && (
          <div
            className="flex items-center gap-2"
            onClick={() => toast.error("Date cannot be changed")}
          >
            <div className="flex items-center justify-center gap-2 rounded-md border bg-muted hover:bg-primary/20 px-3 py-2 text-sm font-medium transition-colors">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="tabular-nums">{formateIndDate(date)}</span>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="space-y-10 pt-6">
          <Section title="Credits">
            <NumberInput label="Mill Credit" error={errors.millCredit}>
              <Input
                id="millCredit" // ID for scrolling
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
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
                onWheel={(e) => e.currentTarget.blur()}
                {...register("staff1Rs", { valueAsNumber: true })}
              />
            </NumberInput>

            <NumberInput label="Viswa Rs" error={errors.staff2Rs}>
              <Input
                id="staff2Rs"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("staff2Rs", { valueAsNumber: true })}
              />
            </NumberInput>

            <div className="space-y-1 md:col-span-2" id="staffDescription">
              <label className="text-sm font-medium">Staff Selection</label>
              <Select
                value={watch("staffDescription") || ""}
                onValueChange={(v) =>
                  setValue("staffDescription", v, { shouldDirty: true })
                }
              >
                <SelectTrigger className="w-full">
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
                  onWheel={(e) => e.currentTarget.blur()}
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
                  onWheel={(e) => e.currentTarget.blur()}
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
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit, onInvalid)}
              disabled={isSubmitting || Object.keys(dirtyFields).length === 0}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
