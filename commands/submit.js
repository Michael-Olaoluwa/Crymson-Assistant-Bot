import { insertProblem } from "../db.js";

const waitingForProblem = new Set();

export async function submitCommand(ctx) {
  try {
    waitingForProblem.add(ctx.from.id);
    await ctx.reply("What's the problem you're facing?");
  } catch (err) {
    console.error("[submit] Error:", err.message);
  }
}

export async function handleMessage(ctx) {
  const userId = ctx.from?.id;
  if (!userId || !waitingForProblem.has(userId)) return false;

  try {
    if (!ctx.message?.text) {
      await ctx.reply("Please send a text message.");
      return true;
    }

    waitingForProblem.delete(userId);
    const text = ctx.message.text;

    await insertProblem(userId, text);
    await ctx.reply("Thanks! Your problem has been recorded. We'll look into it.");

    try {
      const adminId = process.env.ADMIN_TELEGRAM_ID;
      await ctx.api.sendMessage(
        adminId,
        `New problem submitted by ${ctx.from.first_name} (@${ctx.from.username || "no_username"}, ID: ${ctx.from.id}):\n\n${text}`
      );
      console.log(`[submit] Problem saved + admin notified (admin id: ${adminId})`);
    } catch (err) {
      console.error("Failed to notify admin:", err.message);
    }
  } catch (err) {
    console.error("[submit] handleMessage error:", err.message);
    await ctx.reply("Something went wrong saving your problem. Please try again.");
  }

  return true;
}