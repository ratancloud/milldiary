"use client";

import { Input } from "../ui/input";
import { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";
import { NumberInput } from "./NumberInput";

interface KgRsProps<T extends FieldValues> {
  label: string;
  kg: Path<T>;
  rs: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export function KgRs<T extends FieldValues>({ 
  label, 
  kg, 
  rs, 
  register, 
  errors 
}: KgRsProps<T>) {
  const kgError = errors[kg] as { message?: string } | undefined;
  const rsError = errors[rs] as { message?: string } | undefined;

  return (
    <div className="grid grid-cols-2 gap-3">
      <NumberInput
        label={`${label} (Kg)`}
        error={kgError?.message ? { type: "manual", message: kgError.message } : undefined}
      >
        <div className="relative flex items-center">
          <Input
            id={kg as string}
            type="number"
            step="any"
            placeholder="0"
            onWheel={(e) => e.currentTarget.blur()}
            {...register(kg, { valueAsNumber: true })}
            className="pr-8 font-medium tabular-nums"
          />
          <span className="absolute right-2.5 text-xs text-muted-foreground font-semibold pointer-events-none select-none">
            kg
          </span>
        </div>
      </NumberInput>
      
      <NumberInput
        label={`${label} (Rs)`}
        error={rsError?.message ? { type: "manual", message: rsError.message } : undefined}
      >
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-xs text-muted-foreground font-semibold pointer-events-none select-none">
            ₹
          </span>
          <Input
            id={rs as string}
            type="number"
            step="any"
            placeholder="0"
            onWheel={(e) => e.currentTarget.blur()}
            {...register(rs, { valueAsNumber: true })}
            className="pl-7 font-medium tabular-nums"
          />
        </div>
      </NumberInput>
    </div>
  );
}