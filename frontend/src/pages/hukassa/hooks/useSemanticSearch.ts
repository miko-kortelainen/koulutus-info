import { useQuery } from "@tanstack/react-query";

const BFF_URL =
  "https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-896dbaaf-a0a9-4b7d-b162-432be6944d13/default/yhteishaku-bff";

export type SemanticSearchResult = {
  id: string;
  label: string;
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
