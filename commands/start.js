import { upsertUser } from "../db.js";

export async function startCommand(ctx) {
  try {
    const user = ctx.from;
    await upsertUser(user.id, user.first_name, user.username);
    await ctx.reply(
      `Welcome, ${user.first_name}! I'm Crymson Assistant.\n\nI share updates on Crymson's products and services.\n\nType /help to see what I can do.`
    );
  } catch (err) {
    console.error("[start] Error:", err.message);
    await ctx.reply("Something went wrong. Please try again later.");
  }
}