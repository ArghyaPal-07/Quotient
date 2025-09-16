import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl) {
	throw new Error(
		"VITE_SUPABASE_URL is required. Copy .env.example to .env.local and set VITE_SUPABASE_URL"
	);
}

if (!supabaseAnonKey) {
	throw new Error(
		"VITE_SUPABASE_ANON_KEY is required. Copy .env.example to .env.local and set VITE_SUPABASE_ANON_KEY"
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


