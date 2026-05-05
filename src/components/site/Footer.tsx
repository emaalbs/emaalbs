import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import {
	InstagramIcon,
	LinkedInIcon,
	MailIcon,
	MapPinIcon,
	PhoneIcon,
	XIcon,
	YouTubeIcon,
} from "@/components/ui/icons";

const COL_COMPANY = [
	{ label: "About EMAAL", href: "#about" },
	{ label: "Our Services", href: "#services" },
	{ label: "EMAAL Group", href: "#group" },
	{ label: "Why EMAAL", href: "#why" },
	{ label: "Insights", href: "#insights" },
];

const COL_IBS = [
	{ label: "About IBS", href: "#ibs" },
	{ label: "IBS 2026", href: "#ibs" },
	{ label: "Ports Summit", href: "#ibs" },
	{ label: "Sponsors", href: "#ibs" },
	{ label: "Publications", href: "#insights" },
];

export function Footer() {
	const heading = "text-[10px] font-bold uppercase tracking-[0.22em] text-white/50";
	const linkBase = "text-[13px] text-white/70 transition-colors hover:text-white";
	return (
		<footer
			id="contact"
			className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] text-white"
		>
			{/* Subtle accents */}
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-teal)]/60 to-transparent" />
			<div className="absolute -left-40 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)]/10 blur-3xl" />
			<div className="absolute -right-40 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-[var(--color-gold)]/8 blur-3xl" />

			<Container>
				{/* Big editorial CTA / brand row */}
				<div className="grid grid-cols-1 gap-10 border-b border-white/8 py-16 lg:grid-cols-12 lg:gap-12">
					<div className="lg:col-span-7">
						<Logo tone="dark" height={36} />
						<h3 className="mt-7 max-w-xl font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.2] tracking-display text-white">
							A platform for business —
							<br />
							<span className="text-white/50">connecting Iraq's economy to the world.</span>
						</h3>
					</div>
					<div className="lg:col-span-5">
						<div className={heading}>Stay Informed</div>
						<p className="mt-3 text-[13.5px] leading-[1.6] text-white/65">
							Quarterly insights from Iraq's business platform — straight to your inbox.
						</p>
						<form className="mt-4 flex gap-2">
							<input
								type="email"
								placeholder="you@company.com"
								className="h-11 flex-1 rounded-md border border-white/15 bg-white/[0.04] px-3.5 text-[13px] text-white placeholder:text-white/40 focus:border-[var(--color-teal)] focus:bg-white/[0.08] focus:outline-none"
							/>
							<button
								type="submit"
								className="h-11 rounded-md bg-[var(--color-gold)] px-4 text-[12.5px] font-semibold text-[var(--color-navy)] hover:bg-[var(--color-gold-deep)] hover:text-white transition-colors"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>

				{/* Link columns */}
				<div className="grid grid-cols-2 gap-y-10 py-14 lg:grid-cols-12 lg:gap-x-8">
					<div className="col-span-2 lg:col-span-4">
						<div className={heading}>Get in Touch</div>
						<div className="mt-5 space-y-3 text-[13px] text-white/70">
							<div className="flex items-start gap-2.5">
								<MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
								<span>Baghdad · Al-Salihiya, near Al-Rashid Cinema</span>
							</div>
							<div className="flex items-start gap-2.5">
								<PhoneIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
								<span>+964 776 262 6777 · +971 54 530 1452</span>
							</div>
							<div className="flex items-start gap-2.5">
								<MailIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
								<a href="mailto:info@emaalbs.com" className="hover:text-white">
									info@emaalbs.com
								</a>
							</div>
						</div>
					</div>

					<div className="lg:col-span-2">
						<div className={heading}>Company</div>
						<ul className="mt-5 space-y-3">
							{COL_COMPANY.map((l) => (
								<li key={l.label}>
									<Link href={l.href} className={linkBase}>
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="lg:col-span-2">
						<div className={heading}>IBS</div>
						<ul className="mt-5 space-y-3">
							{COL_IBS.map((l) => (
								<li key={l.label}>
									<Link href={l.href} className={linkBase}>
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="col-span-2 lg:col-span-4">
						<div className={heading}>Follow EMAAL</div>
						<div className="mt-5 flex items-center divide-x divide-white/10 border-y border-white/10">
							{[
								{ Icon: LinkedInIcon, label: "LinkedIn", href: "#" },
								{ Icon: XIcon, label: "X / Twitter", href: "#" },
								{ Icon: InstagramIcon, label: "Instagram", href: "#" },
								{ Icon: YouTubeIcon, label: "YouTube", href: "#" },
							].map(({ Icon, label, href }) => (
								<a
									key={label}
									href={href}
									aria-label={label}
									className="group flex h-12 flex-1 items-center justify-center text-white/55 transition-all hover:bg-white/[0.04] hover:text-[var(--color-gold)]"
								>
									<Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col items-start justify-between gap-2 border-t border-white/8 py-6 text-[11.5px] text-white/40 sm:flex-row sm:items-center">
					<div>© {new Date().getFullYear()} EMAAL Business Space. All rights reserved.</div>
					<div className="flex gap-5">
						<Link href="#" className="hover:text-white">Privacy</Link>
						<Link href="#" className="hover:text-white">Terms</Link>
						<Link href="#" className="hover:text-white">Cookies</Link>
					</div>
				</div>
			</Container>
		</footer>
	);
}
