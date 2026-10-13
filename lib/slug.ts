/** A URL fragment for a heading: "3. When and with Whom…?" becomes "3-when-and-with-whom". */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
