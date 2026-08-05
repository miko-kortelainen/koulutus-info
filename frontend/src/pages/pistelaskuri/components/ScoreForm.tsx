import { Box, Button, Stack, Tabs, Text } from "@chakra-ui/react";
import { type SubmitEvent, useEffect, useRef, useState } from "react";
import { HiOutlineCalculator } from "react-icons/hi";
import type { CutoffRound } from "@/config/cutoffRounds";
import { COLORS } from "@/theme";
import type { Calculation } from "../lib/scoreResults";
import { recalculateFromGrades } from "../lib/todistusvalinta";
import {
  emptyYoFormState,
  isYoFormState,
  parseYoForm,
  toUniversityGrades,
  type YoFormErrors,
  type YoFormState,
} from "../lib/yoForm";
import { isScoreType, type ScoreType } from "../scoreTypes";
import AmmForm, {
  type AmmFormErrors,
  type AmmFormState,
  emptyAmmFormState,
  isAmmFormState,
  parseAmmForm,
} from "./AmmForm";
import YoForm from "./YoForm";

interface ScoreFormProps {
  onModeChange: (selectionMethod: ScoreType) => void;
  onSubmit: (calculation: Calculation) => void;
  round: CutoffRound;
}

interface StoredForms {
  amm?: AmmFormState;
  version: 1;
  yo?: YoFormState;
}

const STORAGE_KEY = "yhteishaku:pistelaskuri";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readStoredForms = (): Omit<StoredForms, "version"> => {
  if (typeof localStorage === "undefined") return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) return {};

    return {
      amm: isAmmFormState(parsed.amm) ? parsed.amm : undefined,
      yo: isYoFormState(parsed.yo) ? parsed.yo : undefined,
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

export default function ScoreForm({ onModeChange, onSubmit, round }: ScoreFormProps) {
  const [mode, setMode] = useState<ScoreType>("Todistusvalinta (YO)");
  const [yoState, setYoState] = useState(emptyYoFormState());
  const [yoErrors, setYoErrors] = useState<YoFormErrors>({});
  const [ammState, setAmmState] = useState(emptyAmmFormState());
  const [ammErrors, setAmmErrors] = useState<AmmFormErrors>({});
  const [calcError, setCalcError] = useState<string>();
  const [isCalculating, setIsCalculating] = useState(false);
  const isSubmitting = useRef(false);

  useEffect(() => {
    const storedForms = readStoredForms();
    if (storedForms.yo) setYoState(storedForms.yo);
    if (storedForms.amm) setAmmState(storedForms.amm);
  }, []);

  const handleModeChange = (value: string) => {
    if (isCalculating || !isScoreType(value)) return;

    setMode(value);
    setYoErrors({});
    setAmmErrors({});
    setCalcError(undefined);
    onModeChange(value);
  };

  const runCalculation = async (build: () => Promise<Calculation>) => {
    isSubmitting.current = true;
    setIsCalculating(true);
    try {
      onSubmit(await build());
      window.sa_event?.("calculate_score");
    } catch (error) {
      setCalcError(error instanceof Error ? error.message : "Todistuspisteiden laskenta epäonnistui.");
    } finally {
      isSubmitting.current = false;
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting.current) return;
    setCalcError(undefined);

    if (mode === "Todistusvalinta (YO)") {
      const result = parseYoForm(yoState);
      if (!("input" in result)) {
        setYoErrors(result.errors);
        return;
      }
      setYoErrors({});
      await runCalculation(async () => {
        const yoGrades = toUniversityGrades(yoState);
        const scored = await recalculateFromGrades({ selectionMethod: "Todistusvalinta (YO)", yoGrades }, round);
        writeStoredForms({ yo: yoState });
        return { ...scored, selectionMethod: "Todistusvalinta (YO)", yoGrades };
      });
      return;
    }

    if (mode === "Todistusvalinta (AMM)") {
      const result = parseAmmForm(ammState);
      if (!("input" in result)) {
        setAmmErrors(result.errors);
        return;
      }
      setAmmErrors({});
      await runCalculation(async () => {
        const ammGrades = result.input;
        const scored = await recalculateFromGrades({ selectionMethod: "Todistusvalinta (AMM)", ammGrades }, round);
        writeStoredForms({ amm: ammState });
        return { ...scored, ammGrades, selectionMethod: "Todistusvalinta (AMM)" };
      });
    }
  };

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
                setCalcError(undefined);
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
          <Box display="flex" justifyContent="flex-end">
            <Button
              bg={COLORS.accent}
              color={COLORS.onAccent}
              loading={isCalculating}
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
          {calcError ? (
            <Text color="fg.error" fontSize="xs" mt={2} role="alert">
              {calcError}
            </Text>
          ) : null}
        </Box>
      </Tabs.Root>
    </form>
  );
}
