import { getProducts } from "../db.js";

export async function productsCommand(ctx) {
  try {
    const products = await getProducts();

    if (!products || products.length === 0) {
      return ctx.reply("No products available right now. Check back soon!");
    }

    const message = products
      .map((p, i) => `${i + 1}. *${p.name}*\n_${p.pitch}_\n🔗 ${p.link}`)
      .join("\n\n");

    await ctx.reply(message, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("[products] Error:", err.message);
    await ctx.reply("Something went wrong fetching our products. Please try again later.");
  }
}