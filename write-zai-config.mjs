/**
 * Writes `.z-ai-config` into the project root at build time — used on
 * ephemeral hosts (Vercel) where /etc and $HOME are not writable.
 *
 * Vercel build command:  node write-zai-config.mjs && prisma generate && npm run build
 * Requires the env var ZAI_CONFIG_JSON (the JSON config, provided via the
 * dashboard/CLI). When unset (e.g. local dev, where the SDK already finds
 * ~/.z-ai-config or /etc/.z-ai-config), this script exits without writing
 * anything so local behaviour is unchanged.
 */
import { writeFileSync, existsSync, readFileSync } from 'node:fs';

const raw = process.env.ZAI_CONFIG_JSON;

if (!raw) {
  console.log('[write-zai-config] ZAI_CONFIG_JSON not set — skipping (local dev uses its own config).');
  process.exit(0);
}

try {
  const parsed = JSON.parse(raw);
  writeFileSync('.z-ai-config', JSON.stringify(parsed), { encoding: 'utf8', flag: 'w' });
  console.log('[write-zai-config] .z-ai-config written to project root.');
} catch {
  // Support passing the config file path via env instead of raw JSON.
  if (raw && existsSync(raw)) {
    const content = readFileSync(raw, 'utf8');
    JSON.parse(content); // validate
    writeFileSync('.z-ai-config', content, 'utf8');
    console.log('[write-zai-config] .z-ai-config copied from path.');
  } else {
    console.error('[write-zai-config] ZAI_CONFIG_JSON is neither valid JSON nor a file path — skipping.');
  }
}
