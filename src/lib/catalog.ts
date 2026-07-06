// Shared between server pages and client components — must stay free of
// node-only imports (content.ts uses fs and can't be bundled for the client).

// Catalog number, like a pressing: FRA-001, FRA-002…
export function catalogNumber(order: number) {
  return `FRA-${String(order).padStart(3, "0")}`;
}
