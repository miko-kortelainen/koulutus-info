import { Box, Button, Checkbox, Field, Input, Stack, Tabs, Text } from "@chakra-ui/react";
import { type SubmitEvent, useEffect, useState } from "react";
import { HiOutlineCalculator } from "react-icons/hi";
import { COLORS } from "@/theme";
import { calculateAmmScore } from "../lib/ammScoring";
import { emptyYoFormState, parseYoForm, type YoFormErrors, type YoFormState } from "../lib/yoForm";
import { calculateYoScore } from "../lib/yoScoring";
import { isScoreType, type ScoreType } from "../scoreTypes";
import AmmForm, { type AmmFormErrors, type AmmFormState, emptyAmmFormState, parseAmmForm } from "./AmmForm";
import YoForm from "./YoForm";

interface ScoreFormProps {
  isFirstTimeApplicant: boolean;
  onFirstTimeApplicantChange: (isFirstTimeApplicant: boolean) => void;
  onModeChange: (selectionMethod: ScoreType) => void;
  onSubmit: (selectionMethod: ScoreType, score: number) => void;
}

interface StoredForms {
  amm?: AmmFormState;
  version: 1;
  yo?: YoFormState;
}

const STORAGE_KEY = "yhteishaku:pistelaskuri";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStoredYoForm = (value: unknown): value is YoFormState => {
  try {
    return isRecord(value) && "input" in parseYoForm(value as unknown as YoFormState);
  } catch {
    return false;
  }
};

const isStoredAmmForm = (value: unknown): value is AmmFormState => {
  try {
    return isRecord(value) && "input" in parseAmmForm(value as unknown as AmmFormState);
  } catch {
    return false;
  }
};

const readStoredForms = (): Omit<StoredForms, "version"> => {
  if (typeof localStorage === "undefined") return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) return {};

    return {
      amm: isStoredAmmForm(parsed.amm) ? parsed.amm : undefined,
      yo: isStoredYoForm(parsed.yo) ? parsed.yo : undefined,
    };
  } catch {
    return {};
  }
};

const writeStoredForms = (next: Omit<StoredForms, "version">) => {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...readStoredForms(), ...next }));
  } catch {
    // Storage is an optional enhancement; calculation should still succeed if it is unavailable.
  }
};

const parseAmkScore = (value: string): number | null => {
  const normalizedValue = value.trim().replace(",", ".");
  if (normalizedValue === "") return null;

  const score = Number(normalizedValue);
  return Number.isFinite(score) && score >= 0 ? score : null;
};

export default function ScoreForm({
  isFirstTimeApplicant,
  onFirstTimeApplicantChange,
  onModeChange,
  onSubmit,
}: ScoreFormProps) {
  const [mode, setMode] = useState<ScoreType>("Todistusvalinta (YO)");
  const [yoState, setYoState] = useState(emptyYoFormState());
  const [yoErrors, setYoErrors] = useState<YoFormErrors>({});
  const [ammState, setAmmState] = useState(emptyAmmFormState());
  const [ammErrors, setAmmErrors] = useState<AmmFormErrors>({});
  const [amkScoreInput, setAmkScoreInput] = useState("");
  const [amkScoreError, setAmkScoreError] = useState<string>();

  useEffect(() => {
    const storedForms = readStoredForms();
    if (storedForms.yo) setYoState(storedForms.yo);
    if (storedForms.amm) setAmmState(storedForms.amm);
  }, []);

  const handleModeChange = (value: string) => {
    if (!isScoreType(value)) return;

    setMode(value);
    setYoErrors({});
    setAmmErrors({});
    setAmkScoreError(undefined);
    onModeChange(value);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "Todistusvalinta (YO)") {
      const result = parseYoForm(yoState);
      if (!("input" in result)) {
        setYoErrors(result.errors);
        return;
      }
      setYoErrors({});
      writeStoredForms({ yo: yoState });
      onSubmit(mode, calculateYoScore(result.input));
      return;
    }

    if (mode === "Todistusvalinta (AMM)") {
      const result = parseAmmForm(ammState);
      if (!("input" in result)) {
        setAmmErrors(result.errors);
        return;
      }
      setAmmErrors({});
      writeStoredForms({ amm: ammState });
      onSubmit(mode, calculateAmmScore(result.input));
      return;
    }

    if (mode === "AMK-valintakoe") {
      const score = parseAmkScore(amkScoreInput);
      setAmkScoreError(score === null ? "Anna pistemäärä numerona." : undefined);
      if (score === null) return;
      onSubmit(mode, score);
      return;
    }
  };

  const amkScoreField = (
    <Field.Root invalid={Boolean(amkScoreError)} required={mode === "AMK-valintakoe"}>
      <Field.Label>Pistemäärä</Field.Label>
      <Input
        inputMode="decimal"
        onChange={(event) => {
          setAmkScoreInput(event.target.value);
          setAmkScoreError(undefined);
        }}
        placeholder="Esimerkiksi 120,5"
        size="xs"
        value={amkScoreInput}
      />
      <Field.ErrorText>{amkScoreError}</Field.ErrorText>
    </Field.Root>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Tabs.Root onValueChange={({ value }) => handleModeChange(value)} size="sm" value={mode}>
        <Stack>
          <Text fontSize="sm" fontWeight="medium">
            Valintatapa
          </Text>
          <Tabs.List aria-label="Valintatapa" borderRadius="md" borderWidth="1px" width="full">
            {(
              [
                ["Todistusvalinta (YO)", "YO"],
                ["Todistusvalinta (AMM)", "AMM"],
                ["AMK-valintakoe", "AMK-valintakoe"],
              ] as const
            ).map(([value, label]) => (
              <Tabs.Trigger flex="1" fontSize="xs" justifyContent="center" key={value} value={value}>
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Stack>

        <Box borderColor="border" borderRadius="lg" borderWidth="1px" mt={4} p={{ base: 3, md: 5 }}>
          <Tabs.Content p={0} value="Todistusvalinta (YO)">
            <YoForm
              errors={yoErrors}
              onChange={(state) => {
                setYoState(state);
                setYoErrors({});
              }}
              value={yoState}
            />
          </Tabs.Content>
          <Tabs.Content p={0} value="Todistusvalinta (AMM)">
            <AmmForm
              errors={ammErrors}
              onChange={(state) => {
                setAmmState(state);
                setAmmErrors({});
              }}
              value={ammState}
            />
          </Tabs.Content>
          <Tabs.Content p={0} value="AMK-valintakoe">
            {amkScoreField}
          </Tabs.Content>

          <Stack gap={1} mt={4}>
            <Checkbox.Root
              checked={isFirstTimeApplicant}
              onCheckedChange={({ checked }) => onFirstTimeApplicantChange(checked === true)}
              size="sm"
            >
              <Checkbox.HiddenInput aria-describedby="first-time-applicant-help" />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>Olen ensikertalainen</Checkbox.Label>
            </Checkbox.Root>
            <Text color="fg.muted" fontSize="xs" id="first-time-applicant-help">
              Käytämme ensikertalaisten pisterajaa, jos se on saatavilla.
            </Text>
          </Stack>

          <Box display="flex" justifyContent="flex-end">
            <Button
              bg={COLORS.accent}
              mt={4}
              size="xs"
              type="submit"
              variant="solid"
              width={{ base: "full", md: "auto" }}
            >
              <HiOutlineCalculator aria-hidden="true" />
              Laske pisteet / näytä koulutukset
            </Button>
          </Box>
        </Box>
      </Tabs.Root>
    </form>
  );
}
