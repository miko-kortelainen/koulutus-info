import { useEffect, useState } from "react";
import { quickLinkSections } from "@/components/quickLinks/quickLinks";

const STORAGE_KEY = "yhteishaku:hakijalle-education-level";

export default function useEducationLevel(remember = true) {
  const [section, setSection] = useState(quickLinkSections[0].id);

  useEffect(() => {
    if (!remember) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && quickLinkSections.some((item) => item.id === saved)) setSection(saved);
    } catch {
      // Use the default when storage is unavailable.
    }
  }, [remember]);

  function selectSection(value: string) {
    setSection(value);
    if (!remember) return;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // The selection still works for this visit.
    }
  }

  return [section, selectSection] as const;
}
