/**
 * The semantic colours every status chip, stat card accent and note uses, so a
 * "success" looks the same on every page.
 */
export type Tone = "brand" | "success" | "warning" | "danger" | "neutral" | "info" | "slate"

export const TONE_STYLES: Record<Tone, { chip: string, dot: string, text: string }> = {
  brand: { chip: "bg-[#FAF5FF] text-[#9333EA]", dot: "bg-[#9333EA]", text: "text-[#9333EA]" },
  success: { chip: "bg-[#DCFCE7] text-[#16A34A]", dot: "bg-[#22C55E]", text: "text-[#16A34A]" },
  warning: { chip: "bg-[#FFF7ED] text-[#EA7A1B]", dot: "bg-[#FB923C]", text: "text-[#EA7A1B]" },
  danger: { chip: "bg-[#F9E3E3] text-[#991B1B]", dot: "bg-[#C92B2B]", text: "text-[#C92B2B]" },
  neutral: { chip: "bg-[#F4F3F5] text-[#4F4E59]", dot: "bg-[#83818E]", text: "text-[#83818E]" },
  info: { chip: "bg-[#E0F2FE] text-[#0369A1]", dot: "bg-[#0EA5E9]", text: "text-[#0369A1]" },
  slate: { chip: "bg-[#EEF2F6] text-[#1E293B]", dot: "bg-[#1E293B]", text: "text-[#1E293B]" },
}
