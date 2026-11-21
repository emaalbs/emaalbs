import { getEnv } from "@/lib/cloudflare";
import { DEFAULT_WELCOME_PAGE, parseWelcomePage, type WelcomePageSettings } from "@/data/welcome-page";
export async function getWelcomePage(): Promise<WelcomePageSettings> {
 const { DB } = await getEnv();
 const row = await DB.prepare("SELECT config_json FROM welcome_page WHERE id=1").first<{config_json: string}>();
 return row ? parseWelcomePage(JSON.parse(row.config_json)) : DEFAULT_WELCOME_PAGE;
}
export async function updateWelcomePage(config: WelcomePageSettings) {
 const { DB } = await getEnv();
 await DB.prepare("INSERT INTO welcome_page (id,config_json,updated_at) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET config_json=excluded.config_json,updated_at=excluded.updated_at").bind(JSON.stringify(config), Date.now()).run();
 return config;
}
