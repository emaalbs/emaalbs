"use client";

import { ErrorPage } from "@/components/site/ErrorPage";

export default function NotFound() {
	return <ErrorPage statusCode={404} />;
}
