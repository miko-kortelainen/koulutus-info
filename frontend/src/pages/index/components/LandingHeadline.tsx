import { Box, Heading, VisuallyHidden } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const MotionHeading = motion.create(Heading);

const HERO_TOPICS = ["hakijamäärät", "pisterajat", "koulutukset", "koulut", "trendit"] as const;

export const HERO_HEADING_NAME = "Katso yhteishaun hakijamäärät, pisterajat, koulutukset, koulut ja trendit.";

const SWAP_MS = 2500;

function TopicSwap() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion !== false) {
      return;
    }

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % HERO_TOPICS.length);
    }, SWAP_MS);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const topic = HERO_TOPICS[index];

  return (
    <Box as="span" display="inline-grid" justifyItems="center" pb="0.28em" position="relative" pt="0.1em">
      {/* ponytail: first topic is the widest; extra sizers if a longer label lands */}
      <Box aria-hidden="true" as="span" gridArea="1 / 1" visibility="hidden" whiteSpace="nowrap">
        {HERO_TOPICS[0]}
      </Box>
      <AnimatePresence initial={false}>
        <motion.span
          animate={{ opacity: 1, transform: "translateY(0)" }}
          exit={{ opacity: 0, transform: "translateY(-0.4em)" }}
          initial={{ opacity: 0, transform: "translateY(0.4em)" }}
          key={topic}
          style={{ display: "inline-block", gridArea: "1 / 1", whiteSpace: "nowrap" }}
          transition={{ duration: 0.3 }}
        >
          {topic}
        </motion.span>
      </AnimatePresence>
    </Box>
  );
}

export default function LandingHeadline() {
  return (
    <MotionHeading
      animate={{ opacity: 1, transform: "translateY(0)" }}
      as="h1"
      fontSize={{ base: "3xl", md: "5xl", lg: "56px" }}
      fontWeight="semibold"
      initial={{ opacity: 0, transform: "translateY(30px)" }}
      lineHeight={1.25}
      textWrap="balance"
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <VisuallyHidden>{HERO_HEADING_NAME}</VisuallyHidden>
      <Box aria-hidden="true" as="span">
        <Box as="span" display="block">
          Katso yhteishaun
        </Box>
        <TopicSwap />
      </Box>
    </MotionHeading>
  );
}
