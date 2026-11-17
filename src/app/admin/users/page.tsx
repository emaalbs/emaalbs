"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accountRole, type AdminRole } from "@/lib/admin-access";

type AdminUser = {
	id: number;
	username: string;
	display_name: string | null;
	is_super_admin: number;
	role: string;
	created_at: number;
	updated_at: number;
};

type Me = { id: number; username: string; isSuperAdmin: boolean };

export default function AdminUsersPage() {
	const router = useRouter();
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [me, setMe] = useState<Me | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
	const [form, setForm] = useState({
		username: "",
		password: "",
		displayName: "",
		role: "admin" as AdminRole,
	});
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetch("/api/admin/me", { credentials: "same-origin" })
			.then((r) => (r.ok ? (r.json() as Promise<Me>) : null))
			.then((data) => {
				if (!data || !data.isSuperAdmin) {
					router.push("/admin");
					return;
				}
				setMe(data);
			})
			.catch(() => router.push("/admin"));
	}, [router]);

	useEffect(() => {
		if (me?.isSuperAdmin) load();
	}, [me]);

	async function load() {
		setLoading(true);
		const res = await fetch("/api/admin/users", { credentials: "same-origin" });
		if (res.ok) {
			const data = (await res.json()) as AdminUser[];
			setUsers(data);
		}
		setLoading(false);
	}

	function openAdd() {
		setEditingUser(null);
		setForm({ username: "", password: "", displayName: "", role: "admin" });
		setError("");
		setModalOpen(true);
	}

	function openEdit(user: AdminUser) {
		setEditingUser(user);
		setForm({
			username: user.username,
			password: "",
			displayName: user.display_name || "",
			role: accountRole(user),
		});
		setError("");
		setModalOpen(true);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		setError("");

		try {
			if (editingUser) {
				const payload: Record<string, unknown> = {
					username: form.username,
					displayName: form.displayName || null,
					role: form.role,
				};
				if (form.password) payload.password = form.password;

				const res = await fetch(`/api/admin/users/${editingUser.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					credentials: "same-origin",
				});
				if (!res.ok) {
					const data = (await res.json()) as { error?: string };
					setError(data.error || "Failed to update user");
					setSaving(false);
					return;
				}
			} else {
				if (!form.password) {
					setError("Password is required");
					setSaving(false);
					return;
				}
				const res = await fetch("/api/admin/users", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						username: form.username,
						password: form.password,
						displayName: form.displayName || null,
						role: form.role,
					}),
					credentials: "same-origin",
				});
				if (!res.ok) {
					const data = (await res.json()) as { error?: string };
					setError(data.error || "Failed to create user");
					setSaving(false);
					return;
				}
			}
			setModalOpen(false);
			load();
		} catch {
			setError("Network error");
		} finally {
			setSaving(false);
		}
	}

	async function deleteUser(id: number) {
		if (!confirm("Delete this admin user?")) return;
		const res = await fetch(`/api/admin/users/${id}`, {
			method: "DELETE",
			credentials: "same-origin",
		});
		if (!res.ok) {
			const data = (await res.json()) as { error?: string };
			alert(data.error || "Failed to delete user");
			return;
		}
		load();
	}

	if (!me) return <div className="text-gray-400">Loading...</div>;

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Users</h1>
				<button
					onClick={openAdd}
					className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F]"
				>
					+ New User
				</button>
			</div>

			{loading ? (
				<div className="text-gray-400">Loading...</div>
			) : users.length === 0 ? (
				<div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
					<p className="text-gray-500">No admin users yet.</p>
				</div>
			) : (
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<table className="w-full text-left text-sm text-gray-600">
						<thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
							<tr>
								<th className="px-6 py-3">Username</th>
								<th className="px-6 py-3">Display Name</th>
								<th className="px-6 py-3">Role</th>
								<th className="px-6 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{users.map((user) => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="px-6 py-3 font-medium text-gray-900">{user.username}</td>
									<td className="px-6 py-3">{user.display_name || "—"}</td>
									<td className="px-6 py-3">
										{user.is_super_admin === 1 ? (
											<span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
												Super Admin
											</span>
										) : (
											<span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
												{user.role === "payments" ? "Payments only / المدفوعات فقط" : "Admin"}
											</span>
										)}
									</td>
									<td className="px-6 py-3 text-right">
										<button
											onClick={() => openEdit(user)}
											className="mr-4 text-sm font-medium text-blue-600 hover:text-blue-800"
										>
											Edit
										</button>
										{user.id !== me.id && (
											<button
												onClick={() => deleteUser(user.id)}
												className="text-sm font-medium text-red-600 hover:text-red-800"
											>
												Delete
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Modal */}
			{modalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-lg font-bold text-gray-900">
							{editingUser ? "Edit User" : "New User"}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Username
								</label>
								<input
									type="text"
									value={form.username}
									onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
									className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									required
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Display Name
								</label>
								<input
									type="text"
									value={form.displayName}
									onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
									className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Password {editingUser && <span className="text-gray-400">(leave blank to keep current)</span>}
								</label>
								<input
									type="password"
									value={form.password}
									onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
									className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									{...(!editingUser ? { required: true } : {})}
								/>
							</div>
							<label className="block text-sm font-medium text-gray-700">
								Role / صلاحية الحساب
								<select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminRole }))}
									className="mt-2 min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 focus:border-[var(--color-teal)]"
									aria-describedby="role-description">
									<option value="admin">Admin / إدارة المحتوى</option>
									<option value="payments">Payments only / المدفوعات فقط</option>
									<option value="super_admin">Super Admin / مدير شامل</option>
								</select>
							</label>
							<p id="role-description" dir="rtl" className="text-sm leading-6 text-gray-600">
								{form.role === "payments" ? "يمكنه مشاهدة الحجوزات والمدفوعات والتحقق من حالة الدفع فقط. لا يمكنه تعديل الموقع أو الأسعار أو إدارة الحسابات."
									: form.role === "super_admin" ? "وصول كامل إلى لوحة الإدارة وإدارة الحسابات والصلاحيات." : "وصول إلى أقسام الإدارة والمحتوى، دون إدارة الحسابات."}
							</p>
							{error && <p className="text-sm text-red-600">{error}</p>}
							<div className="flex justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => setModalOpen(false)}
									className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={saving}
									className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50"
								>
									{saving ? "Saving..." : "Save"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
