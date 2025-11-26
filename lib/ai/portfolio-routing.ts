export const PORTFOLIO_PRIMARY_SECTIONS = [
  "home",
  "ventures",
  "about",
  "contact",
] as const;

export const PORTFOLIO_CASE_STUDIES = [
  "project-findu",
  "project-mkrs",
  "project-flock",
  "project-bloom",
] as const;

export const PORTFOLIO_DESTINATIONS = [
  ...PORTFOLIO_PRIMARY_SECTIONS,
  ...PORTFOLIO_CASE_STUDIES,
] as const;

export type PortfolioNavigationTarget =
  (typeof PORTFOLIO_DESTINATIONS)[number];

export const PORTFOLIO_ROUTE_MAP: Record<PortfolioNavigationTarget, string> = {
  home: "/",
  ventures: "/ventures",
  about: "/about",
  contact: "/contact",
  "project-findu": "/projects/findu",
  "project-mkrs": "/projects/mkrs",
  "project-flock": "/projects/flock",
  "project-bloom": "/projects/bloom",
};

export const PORTFOLIO_DESTINATION_LABELS: Record<
  PortfolioNavigationTarget,
  string
> = {
  home: "Home / Work overview",
  ventures: "Ventures overview",
  about: "About Kenny",
  contact: "Contact + collaborations",
  "project-findu": "FindU case study",
  "project-mkrs": "Mkrs case study",
  "project-flock": "Flock case study",
  "project-bloom": "Bloom case study",
};

export function resolvePortfolioPath(
  target: PortfolioNavigationTarget | string,
): string | null {
  return PORTFOLIO_ROUTE_MAP[target as PortfolioNavigationTarget] ?? null;
}
