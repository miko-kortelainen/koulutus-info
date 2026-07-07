import { useState, type SubmitEvent } from "react";
import { Button, Heading, Stack, Text, Textarea } from "@chakra-ui/react";
import { COLORS } from "@/theme";
import PageContainer from "@/layout/PageContainer";

const FORMSUBMIT_URL = "https://formsubmit.co/834cceb5eea9f272c02b5e0b16c11f18";

export default function PalautePage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const body = new FormData();
      body.append("message", message);
      body.append("_subject", "Palaute – yhteishaku.app");
      body.append("_captcha", "false");
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      if (!res.ok) throw new Error(`formsubmit error ${res.status}`);
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Palaute
      </Heading>
      <Text color="fg.muted" textWrapMode="wrap" textWrap="pretty">
        Huomasitko bugin tai keksitkö kehitysidean? Kerro siitä alla.
      </Text>
    </Stack>
  );

  const form =
    status === "sent" ? (
      <Text color="fg.muted">Kiitos palautteesta!</Text>
    ) : (
      <Stack as="form" gap={2} onSubmit={handleSubmit}>
        <Textarea
          name="message"
          required
          minH="10rem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Kirjoita palautteesi tähän..."
        />

        <Button
          bg={COLORS.accent}
          color={COLORS.text}
          type="submit"
          size="sm"
          alignSelf="flex-end"
          loading={status === "sending"}
        >
          Lähetä
        </Button>

        {status === "error" && <Text color="fg.muted">Lähetys epäonnistui, yritä uudelleen.</Text>}
      </Stack>
    );

  return (
    <PageContainer align="flex-start">
      {header}
      {form}
    </PageContainer>
  );
}
