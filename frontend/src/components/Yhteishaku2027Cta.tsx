import { HStack, Link, Text } from "@chakra-ui/react";
import { HiOutlineArrowRight, HiOutlineCalendar } from "react-icons/hi";
import { COLORS } from "@/theme";

export default function Yhteishaku2027Cta() {
  return (
    <Link href="/yhteishaku-2027/">
      <HStack gap={2} justify="center">
        <HiOutlineCalendar aria-hidden="true" color={COLORS.accentFg} size="1rem" style={{ flexShrink: 0 }} />
        <Text
          as="span"
          borderBottomColor="fg.accent"
          borderBottomStyle="dotted"
          borderBottomWidth="2px"
          color="fg.muted"
          fontSize="sm"
        >
          Katso 2027 yhteishaun hakuaikataulut
        </Text>
        <HiOutlineArrowRight aria-hidden="true" color={COLORS.accentFg} size="1rem" style={{ flexShrink: 0 }} />
      </HStack>
    </Link>
  );
}
