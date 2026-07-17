import OptionSelect from "@/components/OptionSelect";
import { YEAR_OPTIONS, type YearOption } from "@/config/yearOptions";

interface YearControlProps {
  value: YearOption;
  onChange: (value: YearOption) => void;
}

export default function YearControl({ value, onChange }: YearControlProps) {
  return (
    <OptionSelect
      ariaLabel="Yhteishaku"
      items={YEAR_OPTIONS}
      onChange={onChange}
      placeholder="Valitse yhteishaku"
      size="sm"
      value={value}
    />
  );
}
