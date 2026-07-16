# component tests

run with `pnpm run test:component`.

- `useFilteredDegrees`: combines filter groups and hides upper AMK degrees by default.
- `useFilteredDegrees`: trims search terms and searches translated names.
- `useFilteredStatistics`: handles missing data and combines filters with trimmed search.
- `useFilteredStatistics`: supports every statistics sort order without mutating input.
- `useFilteredProgrammes`: trims search and sorts both directions without mutating input.
- `sortSchools`: supports every school sort order without mutating input.
- `ComparisonTable`: masks small counts and omits unavailable trends.
- `ComparisonTable`: renders accessible trends, pressure values, and pressure tiers.
- `CompareBar`: disables incomplete comparisons and removes selected entries.
- `CompareBar`: creates an encoded comparison URL for two selections.
- `TopBarList`: aggregates, sorts, and limits trend data.
- `TopBarList`: keeps all comparison data and shows changes and new categories.
- `TopBarList`: handles zero totals without invalid percentages or bar widths.
- `TopBarList`: renders the empty-data state.
- `PalautePage`: preserves feedback and shows an error when submission fails.
- `useCountdown`: counts down to the next configured application round.
- `useCountdown`: returns no countdown after the final configured round.
