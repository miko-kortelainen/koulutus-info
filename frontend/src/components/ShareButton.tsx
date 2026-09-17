import { Button } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HiOutlineShare } from "react-icons/hi";

interface ShareButtonProps {
  label: string;
  onShared: () => void;
  getShareFile?: () => Promise<File>;
}

export default function ShareButton({ label, onShared, getShareFile }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const inFlight = useRef(false);

  const share = async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      if (getShareFile) {
        await shareFile(getShareFile, onShared, setCopied);
        return;
      }
      await shareUrl(onShared, setCopied);
    } finally {
      inFlight.current = false;
    }
  };

  const copiedLabel = getShareFile ? "Kuva ladattu" : "Linkki kopioitu";

  return (
    <Button borderColor="accent" onClick={share} size="2xs" variant="outline">
      <HiOutlineShare /> {copied ? copiedLabel : label}
    </Button>
  );
}

async function shareUrl(onShared: () => void, setCopied: (copied: boolean) => void) {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url });
      onShared();
    } catch {}
    return;
  }

  await navigator.clipboard.writeText(url);
  onShared();
  flashCopied(setCopied);
}

async function shareFile(
  getShareFile: () => Promise<File>,
  onShared: () => void,
  setCopied: (copied: boolean) => void,
) {
  let file: File;
  try {
    file = await getShareFile();
  } catch {
    return;
  }

  if (canShareFiles(file)) {
    try {
      await navigator.share({ files: [file], title: "Oma hakulista" });
      onShared();
    } catch {}
    return;
  }

  downloadFile(file);
  onShared();
  flashCopied(setCopied);
}

function canShareFiles(file: File) {
  if (typeof navigator.canShare !== "function") return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

function downloadFile(file: File) {
  const href = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.download = file.name;
  link.href = href;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 0);
}

function flashCopied(setCopied: (copied: boolean) => void) {
  setCopied(true);
  window.setTimeout(() => setCopied(false), 2000);
}
