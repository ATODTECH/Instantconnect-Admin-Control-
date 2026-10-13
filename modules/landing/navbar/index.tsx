"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "cn";
import { BrandLogo } from "@/components/brand/brand-logo";
import { StoreButtons } from "@/components/landing/store-buttons";
import { ROUTES } from "@/lib/routes";
import { NAV_LINKS, STORE_LINKS } from "../constants";

const EASE = [0.22, 1, 0.36, 1] as const;
const MotionLink = motion.create(Link);
const PILL =
	"rounded-full bg-white/90 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.35)] ring-1 ring-black/5 backdrop-blur-xl";

/** The id of the section currently under the navbar, for highlighting its link. */
const useActiveSection = () => {
	const [active, setActive] = useState<string | null>(null);

	useEffect(() => {
		const sections = NAV_LINKS.map((link) =>
			document.getElementById(link.href.split("#")[1]),
		).filter((el): el is HTMLElement => !!el);
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActive(`/#${entry.target.id}`);
				}
			},
			{ rootMargin: "-40% 0px -55% 0px" },
		);
		sections.forEach((section) => observer.observe(section));
		return () => observer.disconnect();
	}, []);

	return active;
};

const MobileMenu = ({ onClose }: { onClose: () => void }) => (
	<motion.div
		initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
		animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
		exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
		transition={{ duration: 0.6, ease: EASE }}
		className="fixed inset-0 z-40 flex flex-col bg-brand-gradient px-6 pb-10 pt-28 lg:hidden"
	>
		<nav aria-label="Mobile" className="flex flex-col gap-1">
			{NAV_LINKS.map((link, i) => (
				<MotionLink
					key={link.href}
					href={link.href}
					onClick={onClose}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
					className="flex items-center justify-between border-b border-white/20 py-4 font-display text-4xl font-bold tracking-tight text-white"
				>
					{link.label}
					<ArrowUpRight className="size-6 opacity-60" aria-hidden />
				</MotionLink>
			))}
		</nav>
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.5 }}
			className="mt-auto flex flex-col gap-4"
		>
			<span className="text-sm font-medium text-white/80">Get the app</span>
			<StoreButtons links={STORE_LINKS} tone="light" />
		</motion.div>
	</motion.div>
);

/**
 * Three floating pills: the logo, the links with a highlight that follows the
 * pointer, and the actions. Slides away while scrolling down and returns on
 * the way back up.
 */
const Navbar = () => {
	const { scrollY } = useScroll();
	const [hidden, setHidden] = useState(false);
	const [open, setOpen] = useState(false);
	const [hovered, setHovered] = useState<string | null>(null);
	const active = useActiveSection();

	useMotionValueEvent(scrollY, "change", (y) => {
		const previous = scrollY.getPrevious() ?? 0;
		setHidden(y > 160 && y > previous);
	});

	const highlighted = hovered ?? active;

	return (
		<>
			<motion.header
				animate={{ y: hidden && !open ? "-130%" : "0%" }}
				transition={{ duration: 0.4, ease: EASE }}
				className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
			>
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
					<Link
						href={ROUTES.home}
						aria-label="InstantLinkUp home"
						onClick={() => setOpen(false)}
						className={cn(PILL, "px-3 pt-3 pb-1 pr-5")}
					>
						<BrandLogo size="sm" className="" />
					</Link>

					<nav
						aria-label="Main"
						onMouseLeave={() => setHovered(null)}
						className={cn(PILL, "hidden items-center p-1.5 lg:flex")}
					>
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onMouseEnter={() => setHovered(link.href)}
								className={cn(
									"relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors",
									highlighted === link.href
										? "text-white"
										: "text-ink-muted hover:text-ink-title",
								)}
							>
								{highlighted === link.href && (
									<motion.span
										layoutId="nav-highlight"
										className="absolute inset-0 -z-10 rounded-full bg-ink-title"
										transition={{ type: "spring", stiffness: 420, damping: 34 }}
									/>
								)}
								<span className="relative">{link.label}</span>
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<Link
							href="/#download"
							className="hidden h-12 items-center gap-1.5 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(236,72,153,0.7)] transition-transform hover:scale-[1.03] sm:inline-flex"
						>
							Get the app <ArrowUpRight className="size-4" aria-hidden />
						</Link>
						<button
							type="button"
							aria-label={open ? "Close menu" : "Open menu"}
							aria-expanded={open}
							onClick={() => setOpen((value) => !value)}
							className={cn(
								PILL,
								"flex size-12 items-center justify-center text-ink-title lg:hidden",
							)}
						>
							<AnimatePresence mode="wait" initial={false}>
								<motion.span
									key={open ? "x" : "menu"}
									initial={{ rotate: -90, opacity: 0 }}
									animate={{ rotate: 0, opacity: 1 }}
									exit={{ rotate: 90, opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									{open ? (
										<X className="size-5" />
									) : (
										<Menu className="size-5" />
									)}
								</motion.span>
							</AnimatePresence>
						</button>
					</div>
				</div>
			</motion.header>

			<AnimatePresence>
				{open && <MobileMenu onClose={() => setOpen(false)} />}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
