import { Field, Input, Stack, Text } from "@chakra-ui/react";
import { AMM_GRADES, type AmmGrade, type AmmInput, type AmmScale } from "../lib/ammScoring";
import FormSelect from "./FormSelect";

const OSA_ALUEET = [
  "Viestintä- ja vuorovaikutusosaaminen",
  "Matemaattis-luonnontieteellinen osaaminen",
  "Yhteiskunta- ja työelämäosaaminen",
] as const;

export interface AmmFormState {
  scale: AmmScale;
  grades: ["" | AmmGrade, "" | AmmGrade, "" | AmmGrade];
  keskiarvoInput: string;
}

export interface AmmFormErrors {
  grades?: string;
  keskiarvo?: string;
}

export const emptyAmmFormState = (): AmmFormState => ({ scale: "1-5", grades: ["", "", ""], keskiarvoInput: "" });

const parseKeskiarvo = (value: string): number | null => {
  const normalized = value.trim().replace(",", ".");
  if (normalized === "") return null;
  const keskiarvo = Number(normalized);
  return Number.isFinite(keskiarvo) ? keskiarvo : null;
};

export const parseAmmForm = (
  state: AmmFormState,
): { input: AmmInput; errors?: undefined } | { errors: AmmFormErrors } => {
  const errors: AmmFormErrors = {};
  if (state.grades.some((grade) => grade === "")) errors.grades = "Valitse arvosana kaikille kolmelle osa-alueelle.";

  const keskiarvo = parseKeskiarvo(state.keskiarvoInput);
  const maxKeskiarvo = state.scale === "1-5" ? 5 : 3;
  if (keskiarvo === null || keskiarvo < 1 || keskiarvo > maxKeskiarvo) {
    errors.keskiarvo = `Anna painotettu keskiarvo väliltä 1,00–${maxKeskiarvo},00.`;
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    input: {
      scale: state.scale,
      grades: state.grades as [AmmGrade, AmmGrade, AmmGrade],
      // biome-ignore lint/style/noNonNullAssertion: validated above
      keskiarvo: keskiarvo!,
    },
  };
};

interface AmmFormProps {
  errors: AmmFormErrors;
  onChange: (state: AmmFormState) => void;
  value: AmmFormState;
}

const SCALE_OPTIONS: { label: string; value: AmmScale }[] = [
  { label: "1–5", value: "1-5" },
  { label: "1–3", value: "1-3" },
];

export default function AmmForm({ errors, onChange, value }: AmmFormProps) {
  const scaleField = (
    <Field.Root required>
      <Field.Label>Arvosana-asteikko</Field.Label>
      <FormSelect
        ariaLabel="Arvosana-asteikko"
        items={SCALE_OPTIONS}
        onChange={(scale) => onChange({ ...value, grades: ["", "", ""], scale })}
        placeholder="Valitse arvosana-asteikko"
        value={value.scale}
      />
    </Field.Root>
  );

  const gradesField = (
    <Stack
      aria-describedby={errors.grades ? "amm-grades-error" : undefined}
      aria-invalid={Boolean(errors.grades)}
      as="fieldset"
      border="0"
      gap={2}
      minW={0}
      p={0}
      width="full"
    >
      <Text as="legend" fontSize="sm" fontWeight="medium">
        Yhteisten tutkinnon osien arvosanat
      </Text>
      <Stack gap={2} width="full">
        {OSA_ALUEET.map((osaAlue, index) => (
          <Stack gap={1} key={osaAlue}>
            <Text color="fg.muted" fontSize="sm">
              {osaAlue}
            </Text>
            <FormSelect
              ariaLabel={osaAlue}
              items={AMM_GRADES[value.scale].map((grade) => ({ label: String(grade), value: String(grade) }))}
              onChange={(grade) => {
                const grades = [...value.grades] as AmmFormState["grades"];
                grades[index] = Number(grade) as AmmGrade;
                onChange({ ...value, grades });
              }}
              placeholder="Valitse arvosana"
              value={value.grades[index] ? String(value.grades[index]) : ""}
            />
          </Stack>
        ))}
      </Stack>
      {errors.grades ? (
        <Text color="fg.error" fontSize="sm" id="amm-grades-error">
          {errors.grades}
        </Text>
      ) : null}
    </Stack>
  );

  const keskiarvoField = (
    <Field.Root invalid={Boolean(errors.keskiarvo)} required>
      <Field.Label>Tutkinnon painotettu keskiarvo</Field.Label>
      <Input
        inputMode="decimal"
        onChange={(event) => onChange({ ...value, keskiarvoInput: event.target.value })}
        placeholder={value.scale === "1-5" ? "Esimerkiksi 3,96" : "Esimerkiksi 2,37"}
        value={value.keskiarvoInput}
      />
      <Field.ErrorText>{errors.keskiarvo}</Field.ErrorText>
    </Field.Root>
  );

  return (
    <Stack gap={4}>
      {scaleField}
      {gradesField}
      {keskiarvoField}
    </Stack>
  );
}
