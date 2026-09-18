import { Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { HiOutlineShare } from "react-icons/hi";

interface ShareButtonProps {
  label: string;
  onShared: () => void;
  getShareFile?: () => Promise<File>;
}

export default function ShareButton({ label, onShared, getShareFile }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const inFlight = useRef(false);
  const preparedFile = useRef<Promise<File> | null>(null);

  useEffect(() => {
    preparedFile.current = getShareFile ? getShareFile() : null;
  }, [getShareFile]);

  const share = async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      if (getShareFile) {
        await shareFile(() => preparedFile.current ?? getShareFile(), onShared, setCopied);
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

  // Safari's canShare() often rejects canvas Files even when share() would open the iOS share sheet.
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ files: [file], title: "Oma hakulista" });
      onShared();
      return;
    } catch (error) {
      if (isShareCancellation(error)) return;
    }
  }

  downloadFile(file);
  onShared();
  flashCopied(setCopied);
}

function isShareCancellation(error: unknown) {
  return typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
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
