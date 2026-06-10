"use client";

import { I18nProvider } from "@/i18n/provider";
import { ErrorPage } from "@/components/site/ErrorPage";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>
				<I18nProvider>
					<ErrorPage statusCode={500} onRetry={reset} />
				</I18nProvider>
			</body>
		</html>
	);
}
