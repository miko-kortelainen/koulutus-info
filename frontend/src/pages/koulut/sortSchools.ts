import type { SchoolListItem } from "./+data";
import type { SortOption } from "./components/SortControl";

export default function sortSchools(schools: SchoolListItem[], order: SortOption): SchoolListItem[] {
  return [...schools].sort((a, b) => {
    switch (order) {
      case "desc":
        return b.name.localeCompare(a.name);
      case "most_popular":
        return b.kaikkiHakijat - a.kaikkiHakijat;
      case "least_popular":
        return a.kaikkiHakijat - b.kaikkiHakijat;
      case "most_first_choice":
        return b.ensisijaisetHakijat - a.ensisijaisetHakijat;
      case "least_first_choice":
        return a.ensisijaisetHakijat - b.ensisijaisetHakijat;
      default:
        return a.name.localeCompare(b.name);
    }
  });
}
