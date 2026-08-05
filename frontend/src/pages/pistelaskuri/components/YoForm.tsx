import { Box, Button, Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { COLORS } from "@/theme";
import {
  SUBJECT_OPTIONS,
  type YoAineRow,
  type YoFormErrors,
  type YoFormState,
} from "../lib/yoForm";
import { YO_GRADES } from "../lib/yoScoring";
import FormSelect from "./FormSelect";

interface YoFormProps {
  errors: YoFormErrors;
  onChange: (state: YoFormState) => void;
  value: YoFormState;
}

const GRADE_OPTIONS = YO_GRADES.map((grade) => ({ label: grade, value: grade }));
const AINE_OPTIONS = SUBJECT_OPTIONS.map((option) => ({ label: option.label, value: option.value }));

interface AineRowProps {
  canRemove: boolean;
  index: number;
  onRemove: () => void;
  onUpdate: (patch: Partial<YoAineRow>) => void;
  row: YoAineRow;
}

function AineRow({ canRemove, index, onRemove, onUpdate, row }: AineRowProps) {
  const rowNumber = index + 1;

  return (
    <Flex alignItems="center">
      <Flex flex="1" gap={2} minW={0}>
        <Box flex="10">
          <FormSelect
            ariaLabel={`Aine ${rowNumber}`}
            items={AINE_OPTIONS}
            onChange={(subject) => onUpdate({ subject })}
            placeholder="Valitse aine"
            value={row.subject}
            
          />
        </Box>
        <Box flex="3">
          <FormSelect
            ariaLabel={`Aineen ${rowNumber} arvosana`}
            items={GRADE_OPTIONS}
            onChange={(grade) => onUpdate({ grade })}
            placeholder="Arvosana"
            value={row.grade}
            
          />
        </Box>
        {canRemove ? (
          <IconButton
            aria-label={`Poista aine ${rowNumber}`}
            marginInlineStart="auto"
            onClick={onRemove}
            size="sm"
            type="button"
            variant="ghost"
          >
            <HiOutlineTrash />
          </IconButton>
        ) : null}
      </Flex>
    </Flex>
  );
}

export default function YoForm({ errors, onChange, value }: YoFormProps) {
  const nextId = useRef(0);
  const canRemove = value.aineet.length > 1;

  const getNextId = () => {
    const highestId = value.aineet.reduce((highest, row) => Math.max(highest, row.id), -1);
    const id = Math.max(nextId.current, highestId + 1);
    nextId.current = id + 1;
    return id;
  };

  const addAine = () =>
    onChange({
      aineet: [...value.aineet, { id: getNextId(), subject: "", grade: "" }],
    });

  const removeAine = (id: number) => {
    if (value.aineet.length <= 1) return;
    onChange({ aineet: value.aineet.filter((row) => row.id !== id) });
  };

  const updateAine = (id: number, patch: Partial<YoAineRow>) =>
    onChange({
      aineet: value.aineet.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    });

  return (
    <Stack
      aria-describedby={errors.aineet ? "yo-subjects-error" : undefined}
      aria-invalid={Boolean(errors.aineet)}
      aria-label="Ylioppilastutkinnon aineet"
      as="fieldset"
      gap={4}
      width="full"
    >
      <Stack gap={6} width="full">
        {value.aineet.map((row, index) => (
          <AineRow
            canRemove={canRemove}
            index={index}
            key={row.id}
            onRemove={() => removeAine(row.id)}
            onUpdate={(patch) => updateAine(row.id, patch)}
            row={row}
          />
        ))}
      </Stack>
      {errors.aineet ? (
        <Text color="fg.error" fontSize="xs" id="yo-subjects-error">
          {errors.aineet}
        </Text>
      ) : null}
      <Box>
        <Button
          borderColor={COLORS.accentFg}
          onClick={addAine}
          size="xs"
          type="button"
          variant="outline"
          w={{ base: "100%", md: "8rem" }}
          mt={2}
        >
          + Lisää aine
        </Button>
      </Box>
    </Stack>
  );
}
