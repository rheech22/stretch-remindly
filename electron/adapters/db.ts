import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types.js";
import dotenv from "dotenv";
import log from "electron-log";
import { resolve } from "node:path";
import { app } from "electron";

const envPath = app.isPackaged
  ? resolve(app.getAppPath(), "../.env")
  : resolve(app.getAppPath(), ".env");

const loadResult = dotenv.config({ path: envPath });

if (loadResult.error) {
  log.error(`[DB] Error loading .env file from ${envPath}:`, loadResult.error);
} else {
  log.info(
    `[DB] Successfully loaded .env file from ${envPath}. Parsed:`,
    loadResult.parsed,
  );
}

log.initialize();

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";

log.info(`[DB] Supabase URL: ${supabaseUrl}`);
log.info(`[DB] Supabase ANON_KEY: ${supabaseAnonKey}`);

export const db = createClient<Database>(supabaseUrl, supabaseAnonKey);
