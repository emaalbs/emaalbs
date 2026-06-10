"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
				credentials: "same-origin",
			});
			if (res.ok) {
				router.push("/admin");
			} else {
				const data = (await res.json()) as { error?: string };
				setError(data.error || "Invalid credentials");
			}
		} catch {
			setError("Network error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
				<h1 className="mb-6 text-center text-2xl font-bold text-[#01334D]">
					EMAAL Admin
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							required
						/>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							required
						/>
					</div>
					{error && (
						<p className="text-sm text-red-600">{error}</p>
					)}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-[#01334D] px-4 py-2.5 font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50"
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>
			</div>
		</div>
	);
}
