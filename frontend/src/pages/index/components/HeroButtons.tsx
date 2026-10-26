import { Button, HStack, Link, Spinner, Stack, Text } from "@chakra-ui/react";
import { motion } from "motion/react";
import { type MouseEvent, useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { PiStudent } from "react-icons/pi";

function isUnmodifiedLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export default function HeroButtons() {
  const [isPending, setIsPending] = useState(false);

  return (
    <Stack align="center" gap={8} maxW={{ md: "28rem" }} width="100%">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 8 }}
        style={{ width: "100%" }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Button
          _active={{ transform: "scale(0.96)" }}
          _hover={{ bg: "accentFg", color: "bg" }}
          asChild
          bg="accent"
          borderWidth="0"
          boxShadow="0 3px 6px rgba(0, 0, 0, 0.2), 0 8px 18px rgba(0, 0, 0, 0.25)"
          color="onAccent"
          height="3rem"
          transitionDuration="0.15s"
          transitionProperty="transform, background-color, color"
          transitionTimingFunction="ease-out"
          variant="solid"
          width="100%"
        >
          <a
            aria-busy={isPending || undefined}
            href="/hakijalle/"
            onClick={(event) => {
              if (!isUnmodifiedLeftClick(event)) return;
              setIsPending(true);
            }}
          >
            <HStack gap={2}>
              <PiStudent aria-hidden="true" style={{ width: "1.375rem", height: "1.375rem" }} />
              <Text as="span" fontSize="0.9375rem" fontWeight="medium">
                Katso hakijan työkalut
              </Text>
              {isPending ? (
                <Spinner aria-hidden="true" color="currentColor" size="inherit" />
              ) : (
                <HiOutlineArrowRight aria-hidden="true" style={{ width: "0.8125rem", height: "0.8125rem" }} />
              )}
            </HStack>
          </a>
        </Button>
      </motion.div>
      <Link color="fg.muted" fontSize="xs" href="/opolle/" textDecoration="underline">
        olen opinto-ohjaaja
      </Link>
    </Stack>
  );
}
