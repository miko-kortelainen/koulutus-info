import { Box, Button, Flex, HStack, IconButton, Separator, Stack, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { COLORS } from "@/theme";
import {
  LANGUAGE_OPTIONS,
  type YoFormErrors,
  type YoFormState,
  type YoKieliRow,
  type YoReaaliaineRow,
} from "../lib/yoForm";
import { type MathLevel, REAALIAINEET, YO_GRADES, type YoGrade } from "../lib/yoScoring";
import FormSelect from "./FormSelect";

interface YoFormProps {
  errors: YoFormErrors;
  onChange: (state: YoFormState) => void;
  value: YoFormState;
}

const GRADE_OPTIONS = YO_GRADES.map((grade) => ({ label: grade, value: grade }));
const MATH_LEVEL_OPTIONS: { label: string; value: MathLevel }[] = [
  { label: "Pitkä", value: "pitkä" },
  { label: "Lyhyt", value: "lyhyt" },
];
const MATH_GRADE_OPTIONS: { label: string; value: YoGrade | "ei-kirjoitettu" }[] = [
  { label: "Ei kirjoitettu", value: "ei-kirjoitettu" },
  ...GRADE_OPTIONS,
];
const REAALIAINE_OPTIONS = REAALIAINEET.map((subject) => ({ label: subject, value: subject }));

interface KieliRowProps {
  index: number;
  kieli: YoKieliRow;
  onRemove: () => void;
  onUpdate: (patch: Partial<YoKieliRow>) => void;
}

function KieliRow({ index, kieli, onRemove, onUpdate }: KieliRowProps) {
  const rowNumber = index + 1;

  return (
    <Flex>
      <Flex alignItems="center" flex="1" gap={2} minW={0}>
        <Box flex="4">
          <FormSelect
            ariaLabel={`Kieli ${rowNumber}`}
            items={LANGUAGE_OPTIONS}
            onChange={(language) => onUpdate({ language })}
            placeholder="Valitse kieli"
            value={kieli.language}
          />
        </Box>
        <Box flex="3">
          <FormSelect
            ariaLabel={`Kielen ${rowNumber} arvosana`}
            items={GRADE_OPTIONS}
            onChange={(grade) => onUpdate({ grade })}
            placeholder="Arvosana"
            value={kieli.grade}
          />
        </Box>
        <IconButton
          aria-label={`Poista kieli ${rowNumber}`}
          marginInlineStart="auto"
          onClick={onRemove}
          type="button"
          variant="ghost"
        >
          <HiOutlineTrash />
        </IconButton>
      </Flex>
    </Flex>
  );
}

interface ReaaliaineRowProps {
  index: number;
  onRemove: () => void;
  onUpdate: (patch: Partial<YoReaaliaineRow>) => void;
  reaaliaine: YoReaaliaineRow;
}

function ReaaliaineRow({ index, onRemove, onUpdate, reaaliaine }: ReaaliaineRowProps) {
  const rowNumber = index + 1;

  return (
    <Flex alignItems="center">
      <Flex flex="1" gap={2} minW={0}>
        <Box flex="4">
          <FormSelect
            ariaLabel={`Reaaliaine ${rowNumber}`}
            items={REAALIAINE_OPTIONS}
            onChange={(subject) => onUpdate({ subject })}
            placeholder="Valitse reaaliaine"
            value={reaaliaine.subject}
          />
        </Box>
        <Box flex="3">
          <FormSelect
            ariaLabel={`Reaaliaineen ${rowNumber} arvosana`}
            items={GRADE_OPTIONS}
            onChange={(grade) => onUpdate({ grade })}
            placeholder="Arvosana"
            value={reaaliaine.grade}
          />
        </Box>
        <IconButton
          aria-label={`Poista reaaliaine ${rowNumber}`}
          marginInlineStart="auto"
          onClick={onRemove}
          type="button"
          variant="ghost"
        >
          <HiOutlineTrash />
        </IconButton>
      </Flex>
    </Flex>
  );
}

export default function YoForm({ errors, onChange, value }: YoFormProps) {
  const nextId = useRef(0);

  const addKieli = () =>
    onChange({
      ...value,
      kielet: [...value.kielet, { id: nextId.current++, language: "", grade: "" }],
    });
  const removeKieli = (id: number) => onChange({ ...value, kielet: value.kielet.filter((kieli) => kieli.id !== id) });
  const updateKieli = (id: number, patch: Partial<YoKieliRow>) =>
    onChange({
      ...value,
      kielet: value.kielet.map((kieli) => (kieli.id === id ? { ...kieli, ...patch } : kieli)),
    });

  const addReaaliaine = () =>
    onChange({
      ...value,
      reaaliaineet: [...value.reaaliaineet, { id: nextId.current++, subject: "", grade: "" }],
    });
  const removeReaaliaine = (id: number) =>
    onChange({ ...value, reaaliaineet: value.reaaliaineet.filter((reaaliaine) => reaaliaine.id !== id) });
  const updateReaaliaine = (id: number, patch: Partial<YoReaaliaineRow>) =>
    onChange({
      ...value,
      reaaliaineet: value.reaaliaineet.map((reaaliaine) =>
        reaaliaine.id === id ? { ...reaaliaine, ...patch } : reaaliaine,
      ),
    });

  const aidinkieliField = (
    <Stack
      aria-describedby={errors.aidinkieli ? "yo-mother-tongue-error" : undefined}
      aria-invalid={Boolean(errors.aidinkieli)}
      aria-required="true"
      as="fieldset"
      width="full"
    >
      <Text as="legend" fontSize="sm" fontWeight="medium" mb={2}>
        Äidinkieli
      </Text>
      <Stack width="full">
        <FormSelect
          ariaLabel="Äidinkieli"
          items={GRADE_OPTIONS}
          onChange={(aidinkieli) => onChange({ ...value, aidinkieli })}
          placeholder="Valitse arvosana"
          value={value.aidinkieli}
        />
      </Stack>
      {errors.aidinkieli ? (
        <Text color="fg.error" fontSize="sm" id="yo-mother-tongue-error">
          {errors.aidinkieli}
        </Text>
      ) : null}
    </Stack>
  );

  const matematiikkaField = (
    <Stack as="fieldset" width="full">
      <Text as="legend" fontSize="sm" fontWeight="medium" mb={2}>
        Matematiikka
      </Text>
      <HStack gap={2} width="full">
        <Box flex={16}>
          <FormSelect
            ariaLabel="Matematiikan oppimäärä"
            items={MATH_LEVEL_OPTIONS}
            onChange={(matematiikkaLevel) => onChange({ ...value, matematiikkaLevel })}
            placeholder="Valitse oppimäärä"
            value={value.matematiikkaLevel}
          />
        </Box>
        <Box flex={17}>
          <FormSelect
            ariaLabel="Matematiikan arvosana"
            items={MATH_GRADE_OPTIONS}
            onChange={(grade) => onChange({ ...value, matematiikkaGrade: grade === "ei-kirjoitettu" ? "" : grade })}
            placeholder="Valitse arvosana"
            value={value.matematiikkaGrade || "ei-kirjoitettu"}
          />
        </Box>
      </HStack>
    </Stack>
  );

  const kieletField = (
    <Stack
      aria-describedby={errors.kielet ? "yo-languages-error" : undefined}
      aria-invalid={Boolean(errors.kielet)}
      as="fieldset"
      width="full"
    >
      <Text as="legend" fontSize="sm" fontWeight="medium" mb={2}>
        Kielet
      </Text>
      <Stack width="full">
        {value.kielet.map((kieli, index) => (
          <KieliRow
            index={index}
            key={kieli.id}
            kieli={kieli}
            onRemove={() => removeKieli(kieli.id)}
            onUpdate={(patch) => updateKieli(kieli.id, patch)}
          />
        ))}
      </Stack>
      {errors.kielet ? (
        <Text color="fg.error" fontSize="sm" id="yo-languages-error">
          {errors.kielet}
        </Text>
      ) : null}
      <Box>
        <Button borderColor={COLORS.accent} onClick={addKieli} size="xs" type="button" variant="outline" w="7rem">
          + Lisää kieli
        </Button>
      </Box>
    </Stack>
  );

  const reaaliaineetField = (
    <Stack
      aria-describedby={errors.reaaliaineet ? "yo-real-subjects-error" : undefined}
      aria-invalid={Boolean(errors.reaaliaineet)}
      as="fieldset"
      width="full"
    >
      <Text as="legend" fontSize="sm" fontWeight="medium" mb={2}>
        Reaaliaineet
      </Text>
      <Stack width="full">
        {value.reaaliaineet.map((reaaliaine, index) => (
          <ReaaliaineRow
            index={index}
            key={reaaliaine.id}
            onRemove={() => removeReaaliaine(reaaliaine.id)}
            onUpdate={(patch) => updateReaaliaine(reaaliaine.id, patch)}
            reaaliaine={reaaliaine}
          />
        ))}
      </Stack>
      {errors.reaaliaineet ? (
        <Text color="fg.error" fontSize="sm" id="yo-real-subjects-error" px={4}>
          {errors.reaaliaineet}
        </Text>
      ) : null}
      <Box>
        <Button borderColor={COLORS.accent} onClick={addReaaliaine} size="xs" type="button" variant="outline" w="7rem">
          + Lisää aine
        </Button>
      </Box>
    </Stack>
  );

  return (
    <Stack gap={4}>
      {aidinkieliField}
      <Separator bg={COLORS.accent} />
      {matematiikkaField}
      <Separator bg={COLORS.accent} />
      {kieletField}
      <Separator bg={COLORS.accent} />
      {reaaliaineetField}
    </Stack>
  );
}
