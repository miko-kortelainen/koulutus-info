import { Box, Input, Separator, Stack, Text, VStack } from "@chakra-ui/react";
import { COLORS } from "@/theme";
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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

export const isAmmFormState = (value: unknown): value is AmmFormState => {
  if (!isRecord(value)) return false;

  const { grades, keskiarvoInput, scale } = value;
  if (
    (scale !== "1-5" && scale !== "1-3") ||
    !Array.isArray(grades) ||
    grades.length !== 3 ||
    !grades.every((grade) => typeof grade === "number" && AMM_GRADES[scale].includes(grade as AmmGrade)) ||
    typeof keskiarvoInput !== "string"
  ) {
    return false;
  }

  return "input" in parseAmmForm(value as unknown as AmmFormState);
};

interface AmmFormProps {
  errors: AmmFormErrors;
  onChange: (state: AmmFormState) => void;
  value: AmmFormState;
}

const SCALE_OPTIONS: { label: string; value: AmmScale }[] = [
  { label: "1-5", value: "1-5" },
  { label: "1-3", value: "1-3" },
];

export default function AmmForm({ errors, onChange, value }: AmmFormProps) {
  const scaleField = (
    <Stack aria-required="true" as="fieldset" width="full">
      <Text as="legend" fontSize="sm" fontWeight="medium" mb={2}>
        Arvosana-asteikko
      </Text>
      <Stack width="full">
        <FormSelect
          ariaLabel="Arvosana-asteikko"
          items={SCALE_OPTIONS}
          onChange={(scale) => onChange({ ...value, grades: ["", "", ""], scale })}
          placeholder="Valitse arvosana-asteikko"
          value={value.scale}
        />
      </Stack>
    </Stack>
  );

  const gradesField = (
    <Stack
      aria-describedby={errors.grades ? "amm-grades-error" : undefined}
      aria-invalid={Boolean(errors.grades)}
      as="fieldset"
    >
      <Text as="legend" fontSize="sm" fontWeight="semibold" mb={2}>
        Yhteisten tutkinnon osien arvosanat
      </Text>
      <VStack alignItems="flex-start" flex={1} gap={4}>
        {OSA_ALUEET.map((osaAlue, index) => (
          <VStack alignItems="flex-start" key={osaAlue} width="100%">
            <Text fontSize="xs" fontWeight="medium">
              {osaAlue}
            </Text>
            <Box width="100%">
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
            </Box>
          </VStack>
        ))}
      </VStack>
      {errors.grades ? (
        <Text color="fg.error" fontSize="sm" id="amm-grades-error" px={4}>
          {errors.grades}
        </Text>
      ) : null}
    </Stack>
  );

  const keskiarvoField = (
    <Stack
      aria-describedby={errors.keskiarvo ? "amm-average-error" : undefined}
      aria-invalid={Boolean(errors.keskiarvo)}
      aria-required="true"
      as="fieldset"
      width="full"
    >
      <Text as="legend" fontSize="sm" fontWeight="medium" mb={2}>
        Tutkinnon painotettu keskiarvo
      </Text>
      <Stack width="full">
        <Input
          aria-label="Tutkinnon painotettu keskiarvo"
          inputMode="decimal"
          onChange={(event) => onChange({ ...value, keskiarvoInput: event.target.value })}
          placeholder={value.scale === "1-5" ? "Esimerkiksi 3,96" : "Esimerkiksi 2,37"}
          size="xs"
          value={value.keskiarvoInput}
        />
      </Stack>
      {errors.keskiarvo ? (
        <Text color="fg.error" fontSize="sm" id="amm-average-error">
          {errors.keskiarvo}
        </Text>
      ) : null}
    </Stack>
  );

  return (
    <Stack gap={4}>
      {scaleField}
      <Separator bg={COLORS.accentFg} />
      {gradesField}
      <Separator bg={COLORS.accentFg} />
      {keskiarvoField}
    </Stack>
  );
}
