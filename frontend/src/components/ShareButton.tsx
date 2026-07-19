import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { HiOutlineShare } from "react-icons/hi";

interface ShareButtonProps {
  label: string;
}

export default function ShareButton({ label }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      // AbortError when the user dismisses the share sheet
      await navigator.share({ title: document.title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button borderColor="accent" onClick={share} size="2xs" variant="outline">
      <HiOutlineShare /> {copied ? "Linkki kopioitu" : label}
    </Button>
  );
}
