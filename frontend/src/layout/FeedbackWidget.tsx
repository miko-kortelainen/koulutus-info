import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  IconButton,
  Portal,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiOutlineChatAlt2, HiOutlineStar, HiStar } from "react-icons/hi";
import { COLORS } from "@/theme";

const STORAGE_KEY = "yhteishaku:feedback-given";
const VISIT_COUNT_KEY = "yhteishaku:visit-count";
const VISIT_COUNTED_KEY = "yhteishaku:visit-counted"; // sessionStorage: one increment per session
const VISIBLE_FROM_VISIT = 2;
const FORMSUBMIT_URL = "https://formsubmit.co/834cceb5eea9f272c02b5e0b16c11f18";

export default function FeedbackWidget() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") return;

      let visits = Number(localStorage.getItem(VISIT_COUNT_KEY)) || 0;
      if (sessionStorage.getItem(VISIT_COUNTED_KEY) !== "true") {
        visits += 1;
        localStorage.setItem(VISIT_COUNT_KEY, String(visits));
        sessionStorage.setItem(VISIT_COUNTED_KEY, "true");
      }

      if (visits >= VISIBLE_FROM_VISIT) setVisible(true);
    } catch {
      // Storage is optional; visit counting is best-effort.
    }
  }, []);

  if (!visible) return null;

  const markGiven = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Storage is optional; hide the widget for the current session even if persistence fails.
    }
    setVisible(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setRating(0);
      setMessage("");
      setStatus("idle");
    }
  };

  const handleSubmit = async () => {
    setStatus("sending");
    try {
      const body = new FormData();
      body.append("rating", String(rating));
      if (message) body.append("message", message);
      body.append("_subject", "Palaute (arvio) – yhteishaku.app");
      body.append("_captcha", "false");
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      if (!res.ok) throw new Error(`formsubmit error ${res.status}`);
      markGiven();
      setOpen(false);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog.Root onOpenChange={(e) => handleOpenChange(e.open)} open={open} placement="center" size="xs">
      <Dialog.Trigger asChild>
        <Button
          bg={COLORS.accent}
          bottom="0.75rem"
          color={COLORS.text}
          position="fixed"
          right="0.75rem"
          size="xs"
          zIndex="popover"
        >
          <HiOutlineChatAlt2 /> Anna palautetta
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <VStack alignItems="flex-start" gap={0}>
                <Dialog.Title fontSize="sm">Miten hyödyllisenä pidät tätä sivustoa? 1-5</Dialog.Title>
                <Text color="fg.muted" fontSize="xs">
                  Palaute auttaa kehittämään!
                </Text>
              </VStack>
            </Dialog.Header>
            <Dialog.Body>
              <Stack>
                <HStack gap={1} justifyContent="center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <IconButton
                      aria-label={`Anna arvosana ${value}/5`}
                      color={value <= rating ? COLORS.accentFg : "fg.muted"}
                      key={value}
                      onClick={() => setRating(value)}
                      size="2xl"
                      variant="ghost"
                    >
                      {value <= rating ? <HiStar /> : <HiOutlineStar />}
                    </IconButton>
                  ))}
                </HStack>

                {rating > 0 && rating < 4 && (
                  <Textarea
                    aria-label="Palaute"
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mikä ei toiminut? (valinnainen)"
                    value={message}
                  />
                )}

                {status === "error" && (
                  <Text color="fg.muted" role="alert">
                    Lähetys epäonnistui, yritä uudelleen.
                  </Text>
                )}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer justifyContent="space-between">
              <Button onClick={markGiven} size="xs" variant="outline">
                Älä näytä uudelleen
              </Button>
              <Button
                bg={COLORS.accent}
                color={COLORS.text}
                disabled={rating === 0}
                loading={status === "sending"}
                onClick={handleSubmit}
                size="xs"
              >
                Lähetä
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton aria-label="Sulje" size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
