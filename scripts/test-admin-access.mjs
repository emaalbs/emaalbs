// Isolated in-memory database: no live accounts, content, or gateway calls.
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { build } from "esbuild";
import { accountRole, canAccessAdmin } from "../src/lib/admin-access.ts";

const id = "12345678-1234-1234-1234-123456789012";
for (const path of ["/admin/bookings", "/admin/payments", "/api/admin/me", "/api/admin/payments", "/api/admin/bookings", `/api/admin/payments/${id}`])
	assert.equal(canAccessAdmin("payments", path), true, path);
for (const path of ["/admin", "/admin/users", "/admin/blogs", "/admin/ibs/editions", "/api/admin/users", "/api/contact", "/api/subscribers", "/api/media/presign", "/api/ibs/editions/test/booking", "/api/admin/payments-extra", "/api/admin/payments/delete", "/api/admin/translate"]) {
	for (const method of ["GET", "POST", "PATCH", "DELETE"]) assert.equal(canAccessAdmin("payments", path, method), false, path + method);
}
assert.equal(canAccessAdmin("payments", `/api/admin/bookings/${id}/verify-payment`, "POST"), true);
assert.equal(canAccessAdmin("payments", "/api/admin/logout", "POST"), true);
assert.equal(canAccessAdmin("payments", "/api/admin/payments", "DELETE"), false);
assert.equal(canAccessAdmin("admin", "/api/admin/users"), false);
assert.equal(canAccessAdmin("super_admin", "/api/admin/users"), true);
assert.throws(() => accountRole({is_super_admin: 0, role: "typo"}));

const sql = new DatabaseSync(":memory:");
sql.exec("CREATE TABLE admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, salt TEXT, display_name TEXT, is_super_admin INTEGER DEFAULT 0, created_at INTEGER, updated_at INTEGER)");
sql.exec("INSERT INTO admin_users (username,is_super_admin) VALUES ('owner',1),('editor',0)");
sql.exec(readFileSync("db/migrations/0027_admin_payments_role.sql", "utf8"));
assert.equal(sql.prepare("SELECT role FROM admin_users WHERE id=2").get().role,"admin");
globalThis.__roleDB = {prepare(query) {
	let args = [];
	return {bind(...v){args=v;return this;},async first(){return sql.prepare(query).get(...args)||null;},async all(){return {results:sql.prepare(query).all(...args)};},async run(){const r=sql.prepare(query).run(...args);return {success:true,meta:{changes:r.changes,last_row_id:r.lastInsertRowid}};}};
}};
process.env.ADMIN_SESSION_SECRET="isolated-access-test-secret-not-a-real-credential";
const dir=mkdtempSync(join(tmpdir(),"emaal-role-tests-"));
try {
	const outfile=join(dir,"routes.cjs");
	await build({stdin:{contents:`
export { middleware } from "./src/middleware";
export * as auth from "./src/lib/auth";
export * as users from "./src/app/api/admin/users/route";
export * as user from "./src/app/api/admin/users/[id]/route";
export * as login from "./src/app/api/admin/login/route";
export * as me from "./src/app/api/admin/me/route";
`,resolveDir:process.cwd(),loader:"ts"},bundle:true,platform:"node",format:"cjs",outfile,packages:"external",
		plugins:[{name:"isolated-env",setup(b){
			b.onResolve({filter:/cloudflare$/},a=>a.path==="@/lib/cloudflare"||a.path==="@opennextjs/cloudflare"?{path:a.path,namespace:"fixture"}:null);
			b.onLoad({filter:/.*/,namespace:"fixture"},()=>({contents:'export async function getEnv(){return {DB:globalThis.__roleDB,ADMIN_SECRET:process.env.ADMIN_SESSION_SECRET}}; export async function getCloudflareContext(){return {env:await getEnv()}}',loader:"js"}));
		}}]});
	// Resolve framework modules from this repository, not the temporary folder.
	const req=createRequire(resolve("package.json"));
	const Module=req("node:module");process.env.NODE_PATH=resolve("node_modules");Module._initPaths();
	const {auth,users,user,login,me,middleware}=req(outfile);
	const {NextRequest}=req("next/server");
	const token=async uid=>auth.signSession({userId:uid,username:"stale",isSuperAdmin:true,role:"super_admin"},process.env.ADMIN_SESSION_SECRET);
	const owner=await token(1);
	const request=(path,method="GET",cookie=owner,body)=>new Request("https://local.test"+path,{method,headers:{cookie:"emmal-session="+cookie,"content-type":"application/json"},...(body?{body:JSON.stringify(body)}:{})});
	let res=await users.POST(request("/api/admin/users","POST",owner,{username:"cashier",password:"test-only-long-password",role:"payments"}));assert.equal(res.status,201);
	const uid=sql.prepare("SELECT id FROM admin_users WHERE username='cashier'").get().id;
	res=await login.POST(request("/api/admin/login","POST","",{username:"cashier",password:"test-only-long-password"}));
	assert.equal(res.status,200);assert.equal((await res.json()).redirectTo,"/admin/payments");
	const cashier=res.headers.get("set-cookie").match(/^emmal-session=([^;]+)/)[1];
	assert.equal((await (await me.GET(request("/api/admin/me","GET",cashier))).json()).role,"payments");
	for (const path of ["/api/admin/users","/api/contact","/api/subscribers","/api/media/presign","/api/ibs/editions/test/booking"]) {
		await assert.rejects(()=>auth.requireAuth(request(path,"GET",cashier)),/Forbidden/);
	}
	assert.equal((await users.POST(request("/api/admin/users","POST",cashier,{username:"intruder",password:"test",role:"super_admin"}))).status,403);
	assert.equal((await user.PATCH(request("/api/admin/users/"+uid,"PATCH",cashier,{role:"super_admin"}),{params:Promise.resolve({id:String(uid)})})).status,403);
	assert.equal((await users.POST(request("/api/admin/users","POST",owner,{username:"bad",password:"test",role:"root"}))).status,400);
	assert.equal((await user.PATCH(request("/api/admin/users/1","PATCH",owner,{role:"payments"}),{params:Promise.resolve({id:"1"})})).status,403);
	// A formerly unrestricted signed token is denied immediately after demotion.
	const stale=await token(2);
	assert.equal((await auth.requireAuth(request("/api/contact","GET",stale))).role,"admin");
	res=await user.PATCH(request("/api/admin/users/2","PATCH",owner,{role:"payments"}),{params:Promise.resolve({id:"2"})});assert.equal(res.status,200);
	await assert.rejects(()=>auth.requireAuth(request("/api/contact","GET",stale)),/Forbidden/);
	for(const path of ["/admin","/admin/blogs","/admin/users","/admin/ibs/editions/new"]){
		const r=await middleware(new NextRequest(request(path,"GET",cashier)));assert.equal(r.status,307);assert.equal(new URL(r.headers.get("location")).pathname,"/admin/payments");
	}
	assert.equal((await middleware(new NextRequest(request("/api/admin/users","GET",cashier)))).status,403);
	assert.equal((await middleware(new NextRequest(request("/api/blogs","POST",cashier,{title:"forbidden"})))).status,403);
	assert.equal((await middleware(new NextRequest(request("/admin/payments","GET",cashier)))).status,200);
	assert.equal((await middleware(new NextRequest(request("/admin/login","GET","")))).status,200);
	assert.equal((await middleware(new NextRequest(request("/api/blogs","GET","")))).status,200);
	res=await user.DELETE(request("/api/admin/users/"+uid,"DELETE",owner),{params:Promise.resolve({id:String(uid)})});assert.equal(res.status,200);
	await assert.rejects(()=>auth.requireAuth(request("/api/admin/payments","GET",cashier)),/Invalid session/);
	assert.equal((await users.GET(request("/api/admin/users","GET",owner))).status,200);
	console.log("PASS: migration preserves accounts; create/edit/login/delete, API + page deny rules, role escalation, stale sessions, last owner, and public reads.");
} finally {sql.close();rmSync(dir,{recursive:true,force:true});delete globalThis.__roleDB;}
