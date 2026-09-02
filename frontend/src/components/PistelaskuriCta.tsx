import { Button } from "@chakra-ui/react";
import { HiOutlineArrowRight, HiOutlineCalculator } from "react-icons/hi";

export default function PistelaskuriCta() {
  return (
    <Button
      _active={{ transform: "scale(0.96)" }}
      _hover={{ bg: "accentFg", color: "bg" }}
      alignSelf={{ md: "flex-start" }}
      asChild
      bg="accent"
      color="onAccent"
      transitionDuration="0.15s"
      transitionProperty="transform, background-color, color"
      transitionTimingFunction="ease-out"
      variant="solid"
      width={{ base: "full", md: "auto" }}
    >
      <a href="/pistelaskuri/">
        <HiOutlineCalculator aria-hidden="true" />
        Laske todistusvalintapisteesi
        <HiOutlineArrowRight aria-hidden="true" />
      </a>
    </Button>
  );
}
