import { useData } from "vike-react/useData";
import type { YoPisterajatPageData } from "@/pages/yo-pisterajat/+data";

export function Head() {
  const rounds = useData<YoPisterajatPageData>();
  const description = `Kevään ja syksyn YO-pisterajat ${rounds[rounds.length - 1].vuosi}–${rounds[0].vuosi}: äidinkieli, matematiikka, kielet ja reaaliaineet. Katso rajat arvosanoille L, E, M, C, B ja A.`;

  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/yo-pisterajat/" rel="canonical" />
      <meta content="https://yhteishaku.app/yo-pisterajat/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
