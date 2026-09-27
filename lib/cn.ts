/** Unește clasele CSS, ignorând valorile false / goale. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
