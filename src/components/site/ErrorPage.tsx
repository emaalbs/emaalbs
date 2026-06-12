"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";

export function ErrorPage({
	statusCode,
	onRetry,
}: {
	statusCode: number;
	onRetry?: () => void;
}) {
	const { t, locale } = useI18n();
	const is404 = statusCode === 404;
	const translations = is404 ? t.errors.notFound : t.errors.genericError;

	return (
		<>
			<Header forceLight />
			<main className="flex flex-col items-center justify-center bg-warm py-24 min-h-[60vh]">
				<Container className="text-center">
					<p className="text-[var(--color-gold)] text-sm font-semibold uppercase tracking-widest mb-4">
						{is404 ? "404" : "Error"}
					</p>
					<h1 className="text-4xl md:text-5xl font-bold text-[var(--color-navy)] mb-4">
						{translations.title}
					</h1>
					<p className="text-base md:text-lg text-[var(--color-navy)]/70 max-w-md mx-auto mb-8">
						{translations.description}
					</p>
					<div className="flex items-center justify-center gap-4 flex-wrap">
						<Button href={`/${locale}`} variant="gold">
							{translations.cta}
						</Button>
						{onRetry && (
							<Button variant="outline-navy" onClick={onRetry}>
								{t.errors.genericError.retry}
							</Button>
						)}
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
