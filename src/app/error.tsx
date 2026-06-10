"use client";

import { ErrorPage } from "@/components/site/ErrorPage";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <ErrorPage statusCode={500} onRetry={reset} />;
}
