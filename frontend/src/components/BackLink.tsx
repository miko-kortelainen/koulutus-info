import { Link } from "@chakra-ui/react";
import type { MouseEvent } from "react";
import { COLORS } from "@/theme";

interface BackLinkProps {
  href: string;
}

export default function BackLink({ href }: BackLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // ponytail: history.length is imperfect for new tabs; href covers cold landings
    if (window.history.length <= 1) return;
    event.preventDefault();
    window.history.back();
  };

  return (
    <Link
      fontSize="sm"
      href={href}
      onClick={handleClick}
      textDecoration="underline"
      textDecorationColor={COLORS.accentFg}
      textDecorationStyle="dotted"
    >
      ← Takaisin
    </Link>
  );
}
