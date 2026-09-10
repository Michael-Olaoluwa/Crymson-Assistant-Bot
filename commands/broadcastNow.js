import { sendToGroups, sendToUsers } from "../broadcast.js";

const ADMIN_ID = () => Number(process.env.ADMIN_TELEGRAM_ID);

export async function broadcastNowCommand(ctx) {
  try {
    if (ctx.from.id !== ADMIN_ID()) {
      await ctx.reply("Unknown command.");
      return;
    }

    const message = ctx.match?.trim();
    if (!message) {
      await ctx.reply("Usage: /broadcast_now <message>");
      return;
    }

    await ctx.reply("Broadcasting now...");

    const groupResult = await sendToGroups(ctx.api, message);
    const userResult = await sendToUsers(ctx.api, message);
    await ctx.reply(
      `Broadcast complete.\nGroups: ${groupResult.sent} sent, ${groupResult.failed} failed, ${groupResult.removed} removed.\nUsers: ${userResult.sent} sent, ${userResult.failed} failed.`
    );
  } catch (err) {
    console.error("[broadcast_now] Error:", err.message);
    await ctx.reply("Broadcast failed: " + err.message);
  }
}