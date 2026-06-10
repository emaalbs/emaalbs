/**
 * Generate a PBKDF2 hash + salt for the default admin user.
 * Run this with Node.js to get the SQL INSERT statement.
 *
 * Usage: node scripts/seed-admin.mjs <password> [--super]
 */

const password = process.argv[2] || "admin123";
const isSuper = process.argv.includes("--super");

async function main() {
	const enc = new TextEncoder();
	const salt = crypto.getRandomValues(new Uint8Array(16));

	const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
	const derived = await crypto.subtle.deriveBits(
		{ name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
		keyMaterial,
		256,
	);

	const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");

	const saltB64 = b64(salt);
	const hashB64 = b64(derived);

	const roleLabel = isSuper ? "super admin" : "admin";
	console.log(`\n-- Default ${roleLabel} user (password: "${password}")`);
	console.log(`INSERT INTO admin_users (username, password_hash, salt, is_super_admin, created_at, updated_at) VALUES`);
	console.log(`  ('admin', '${hashB64}', '${saltB64}', ${isSuper ? 1 : 0}, ${Date.now()}, ${Date.now()});`);
	console.log("");
}

main();
