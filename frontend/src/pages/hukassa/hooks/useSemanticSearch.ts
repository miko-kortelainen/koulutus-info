import { useQuery } from "@tanstack/react-query";

const BFF_URL = "https://opinto-vector-3lpaz.ondigitalocean.app/search";

export type SemanticSearchResult = {
  id: string;
  koulutusOid: string;
  label: string;
  school: string;
  cities: string[];
  description: string;
  type: string;
  score: number;
  url: string;
};

export default function useSemanticSearch(query: string) {
  return useQuery<SemanticSearchResult[]>({
    queryKey: ["semanticSearch", query],
    queryFn: async () => {
      const res = await fetch(`${BFF_URL}?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`BFF error ${res.status}`);
      return res.json();
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
