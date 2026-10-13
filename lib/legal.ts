import "server-only"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { slugify } from "@/lib/slug"

export type LegalSlug = "privacy-notice" | "terms-of-use"

export type LegalHeading = { id: string, title: string }

export type LegalDocument = {
  title: string
  lastUpdated: string
  /** The document after its title and date, as Markdown. */
  body: string
  /** The `##` sections, for the page's own table of contents. */
  headings: LegalHeading[]
}

/**
 * Reads one of the legal documents generated into `content/legal` by
 * `legal/build-app-copy.py`. Edit the Markdown in the repo's `legal/` folder
 * and rerun the script; never edit the generated copy.
 */
export const getLegalDocument = async (slug: LegalSlug): Promise<LegalDocument> => {
  const source = await readFile(path.join(process.cwd(), "content", "legal", `${slug}.md`), "utf8")
  const lines = source.replace(/<!--[\s\S]*?-->/g, "").trim().split("\n")

  const title = lines.find((line) => line.startsWith("# "))?.slice(2).trim() ?? ""
  const lastUpdated = lines.find((line) => line.startsWith("_Last updated"))?.replace(/^_Last updated\s*|_$/g, "") ?? ""
  const body = lines.filter((line) => !line.startsWith("# ") && !line.startsWith("_Last updated")).join("\n").trim()
  const headings = lines
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.slice(3).trim()
      return { id: slugify(text), title: text }
    })

  return { title, lastUpdated, body, headings }
}
