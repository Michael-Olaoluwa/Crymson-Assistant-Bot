export async function helpCommand(ctx) {
  try {
    await ctx.reply(
      "Here's what I can do:\n\n" +
        "/start — Say hello and introduce yourself\n" +
        "/help — Show this list of commands\n" +
        "/products — See all of Crymson's products\n" +
        "/submit — Report a problem or give feedback"
    );
  } catch (err) {
    console.error("[help] Error:", err.message);
  }
}