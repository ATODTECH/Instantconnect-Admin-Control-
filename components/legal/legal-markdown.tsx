import { Children, isValidElement } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Lightbulb } from "lucide-react"
import { slugify } from "@/lib/slug"

/** The plain text inside a rendered heading, for its anchor id. */
const textOf = (children: React.ReactNode): string =>
  Children.toArray(children)
    .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : isValidElement<{ children?: React.ReactNode }>(child) ? textOf(child.props.children) : ""))
    .join("")

type HastNode = { type: string, tagName?: string, value?: string, children?: HastNode[] }

/** Each section opens with "**In short:** …", which the page lifts into a callout. */
const isSummary = (node?: HastNode) => {
  const first = node?.children?.[0]
  return first?.tagName === "strong" && first.children?.[0]?.value?.trim() === "In short:"
}

const COMPONENTS: Components = {
  h2: ({ children }) => (
    <h2
      id={slugify(textOf(children))}
      className="mt-16 scroll-mt-28 border-t border-ink-border pt-10 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-ink-title first:mt-0 first:border-0 first:pt-0 sm:text-3xl"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-9 text-lg font-semibold text-ink-title">{children}</h3>,
  p: ({ node, children }) =>
    isSummary(node as HastNode) ? (
      <p className="mt-5 flex gap-3 rounded-2xl bg-brand-surface-subtle p-4 text-[0.95rem] leading-relaxed text-ink-body ring-1 ring-brand-tint">
        <Lightbulb className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden />
        <span>{children}</span>
      </p>
    ) : (
      <p className="mt-5 text-base leading-[1.75] text-ink-body">{children}</p>
    ),
  ul: ({ children }) => <ul className="mt-5 flex flex-col gap-3">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 flex list-decimal flex-col gap-3 pl-5 marker:font-semibold marker:text-brand">{children}</ol>,
  li: ({ children }) => (
    <li className="relative pl-6 text-base leading-[1.7] text-ink-body before:absolute before:left-0 before:top-[0.7em] before:size-2 before:rounded-full before:bg-brand-gradient in-[ol]:pl-1 in-[ol]:before:hidden">
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-ink-title">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="font-medium text-brand underline decoration-brand-tint underline-offset-4 transition-colors hover:decoration-brand">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-ink-border">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-brand-surface-subtle">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brand-deep">{children}</th>,
  td: ({ children }) => <td className="border-t border-ink-border px-4 py-3 align-top leading-relaxed text-ink-body">{children}</td>,
}

/** A legal document's body, in the landing page's type and colours. */
export const LegalMarkdown = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
    {children}
  </ReactMarkdown>
)
