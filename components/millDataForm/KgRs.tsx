import { Input } from "../ui/input";
import { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";
import { NumberInput } from "./NumberInput";

// We use <T extends FieldValues> to make the component generic
interface KgRsProps<T extends FieldValues> {
  label: string;
  kg: Path<T>;        // Path ensures the string matches a key in your schema
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
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Accessing errors[kg] with generics requires casting to any 
          or using a helper because TS can't guarantee the nested structure 
      */}
      <NumberInput label={`${label} (Kg)`} error={errors[kg] as any}>
        <Input
          id={kg as string}
          type="number"
          onWheel={(e) => e.currentTarget.blur()}
          {...register(kg, { valueAsNumber: true })}
        />
      </NumberInput>
      
      <NumberInput label={`${label} (Rs)`} error={errors[rs] as any}>
        <Input
          id={rs as string}
          type="number"
          onWheel={(e) => e.currentTarget.blur()}
          {...register(rs, { valueAsNumber: true })}
        />
      </NumberInput>
    </div>
  );
}