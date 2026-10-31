import OptionSelect from "@/components/OptionSelect";
import { YEAR_OPTIONS, type YearOption } from "@/config/yearOptions";

interface YearControlProps {
  label?: string;
  value: YearOption;
  onChange: (value: YearOption) => void;
}

export default function YearControl({ label, value, onChange }: YearControlProps) {
  return (
    <OptionSelect
      ariaLabel="Yhteishaku"
      items={YEAR_OPTIONS}
      label={label}
      onChange={onChange}
      placeholder="Valitse yhteishaku"
      size="sm"
      value={value}
    />
  );
}
