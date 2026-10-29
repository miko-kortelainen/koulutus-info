import { Field, Input } from "@chakra-ui/react";

interface SearchInputProps {
  ariaLabel?: string;
  label?: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

export default function SearchInput({ ariaLabel, label, onChange, placeholder, value }: SearchInputProps) {
  const inputLabel = ariaLabel ?? label ?? placeholder;
  const input = (
    <Input
      aria-label={inputLabel}
      minHeight={9}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      size="sm"
      value={value}
      width="full"
    />
  );

  if (!label) return input;

  return (
    <Field.Root gap={1} width="full">
      <Field.Label color="fg.muted" fontSize="xs">
        {label}
      </Field.Label>
      {input}
    </Field.Root>
  );
}
