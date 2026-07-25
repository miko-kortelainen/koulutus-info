import type { SchoolListItem } from "../+data";

export type SortOption =
  | "asc"
  | "desc"
  | "most_popular"
  | "least_popular"
  | "most_first_choice"
  | "least_first_choice"
  | "highest_feedback"
  | "lowest_feedback";

export default function sortSchools(schools: SchoolListItem[], order: SortOption): SchoolListItem[] {
  return [...schools].sort((a, b) => {
    switch (order) {
      case "desc":
        return b.name.localeCompare(a.name, "fi");
      case "most_popular":
        return b.kaikkiHakijat - a.kaikkiHakijat;
      case "least_popular":
        return a.kaikkiHakijat - b.kaikkiHakijat;
      case "most_first_choice":
        return b.ensisijaisetHakijat - a.ensisijaisetHakijat;
      case "least_first_choice":
        return a.ensisijaisetHakijat - b.ensisijaisetHakijat;
      case "highest_feedback":
        return (b.feedbackAverage ?? Number.NEGATIVE_INFINITY) - (a.feedbackAverage ?? Number.NEGATIVE_INFINITY);
      case "lowest_feedback":
        return (a.feedbackAverage ?? Number.POSITIVE_INFINITY) - (b.feedbackAverage ?? Number.POSITIVE_INFINITY);
      default:
        return a.name.localeCompare(b.name, "fi");
    }
  });
}
