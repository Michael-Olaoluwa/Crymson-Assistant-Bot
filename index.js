import { Bot, webhookCallback } from "grammy";
import http from "node:http";
import cron from "node-cron";
import "dotenv/config";
import { addGroup, removeGroup } from "./db.js";
import { startCommand } from "./commands/start.js";
import { helpCommand } from "./commands/help.js";
import { productsCommand } from "./commands/products.js";
import { submitCommand, handleMessage } from "./commands/submit.js";
import { broadcastNowCommand } from "./commands/broadcastNow.js";
import { sendBroadcast } from "./broadcast.js";

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const handled = await handleMessage(ctx);
  if (!handled) await next();
});

bot.command("start", startCommand);
bot.command("help", helpCommand);
bot.command("products", productsCommand);
bot.command("submit", submitCommand);
bot.command("broadcast_now", broadcastNowCommand);

bot.on("my_chat_member", async (ctx) => {
  try {
    const update = ctx.myChatMember;
    const chat = update.chat;
    const newStatus = update.new_chat_member.status;
    const oldStatus = update.old_chat_member.status;

    if (chat.type === "private") return;

    const wasAdded =
      (oldStatus === "left" || oldStatus === "kicked") &&
      (newStatus === "member" ||
        newStatus === "administrator" ||
        newStatus === "creator");

    const wasRemoved = newStatus === "left" || newStatus === "kicked";

    if (wasAdded) {
      const title = chat.title || `Group ${chat.id}`;
      await addGroup(chat.id, title);

      const intro =
        `Hey there! I'm *Crymson Assistant* 🚀 — the friendly guide to all things Crymson.\n\n` +
        `Crymson builds tools that make dev life easier. Stay tuned — I'll be sharing updates on exciting new products and releases!\n\n` +
        `Type /products anytime to see what we're working on, or /submit to report a problem.\n\n` +
        `Welcome aboard! 🔥`;

      await ctx.api.sendMessage(chat.id, intro, { parse_mode: "Markdown" });
      console.log(`[group] Added to "${title}" (${chat.id})`);
    } else if (wasRemoved) {
      await removeGroup(chat.id);
      console.log(`[group] Removed from "${chat.title || chat.id}" (${chat.id})`);
    }
  } catch (err) {
    console.error("[group] Handler error:", err.message);
  }
});

bot.on("message", async (ctx) => {
  if (ctx.chat?.type !== "private") return;
  try {
    await ctx.reply("I don't understand that. Type /help to see what I can do.");
  } catch (err) {
    console.error("[fallback] Error:", err.message);
  }
});

bot.catch((err) => {
  console.error("[bot] Unhandled error:", err.message || err);
});

// ============ Scheduled broadcast (every day) ============
// Cron format: minute hour day-of-month month day-of-week
// "0 9 * * *" = 09:00 every day
cron.schedule("0 9 * * *", async () => {
  console.log("[cron] Running scheduled broadcast...");
  try {
    await sendBroadcast(bot.api);
    console.log("[cron] Scheduled broadcast finished.");
  } catch (err) {
    console.error("[cron] Scheduled broadcast error:", err.message);
  }
});
console.log("[cron] Broadcast scheduled: 09:00 every day (cron: '0 9 * * *')");
// ============================================================

// ============ HTTP server: /health + (optionally) webhooks ============
const PORT = Number(process.env.PORT || 3000);
const secretToken = process.env.WEBHOOK_SECRET_TOKEN || undefined;
const useWebhook = Boolean(process.env.WEBHOOK_URL);

// NOTE: webhookCallback() swaps out bot.start(); it must only be created
// after a successful setWebhook, and created ONCE.
let webhookHandler = null;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/health" || req.url === "/")) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }

  if (useWebhook && webhookHandler) {
    webhookHandler(req, res).catch((err) => {
      console.error("[webhook] Error:", err.message);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("error");
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`[http] Server listening on port ${PORT}`);
});
// ====================================================================

// ============ Health check + startup mode ============
try {
  const me = await bot.api.getMe();
  console.log(`Connected as @${me.username}. Bot is online!`);
} catch (err) {
  console.error(
    "Failed to connect to Telegram. Check BOT_TOKEN in your .env file.",
    err.message
  );
  process.exit(1);
}

if (useWebhook) {
  try {
    await bot.api.setWebhook(process.env.WEBHOOK_URL, { secret_token: secretToken });
    webhookHandler = webhookCallback(bot, "http", { secretToken });
    console.log(`[webhook] Registered webhook at ${process.env.WEBHOOK_URL}`);
    console.log("Crymson Assistant is running (webhook mode)...");
  } catch (err) {
    console.error(
      "[webhook] setWebhook failed. WEBHOOK_SECRET_TOKEN must use only A-Z, a-z, 0-9, _ and -:",
      err.message
    );
    await bot.start();
    console.log("Crymson Assistant is running (polling mode, fallback)...");
  }
} else {
  await bot.start();
  console.log("Crymson Assistant is running (polling mode)...");
}