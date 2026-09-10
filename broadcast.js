import { getAllGroups, getAllUsers, getProducts, removeGroup } from "./db.js";
import { getDailyAd } from "./ads.js";

const SEND_DELAY_MS = 200;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDeadGroupError(err) {
  const code = err?.error_code;
  const desc = (err?.description || "").toLowerCase();
  if (code === 403) return true;
  if (code === 400 && desc.includes("chat not found")) return true;
  if (desc.includes("bot was kicked")) return true;
  return false;
}

export function buildProductsMessage(products) {
  return (
    `*Crymson News* 📣\n\n` +
    `Here's what Crymson is up to:\n\n` +
    products
      .map(
        (p, i) =>
          `${i + 1}. *${p.name}*\n_${p.pitch}_\n🔗 ${p.link}`
      )
      .join("\n\n") +
    `\n\nFollow along and be first in line for what's coming next! 🚀`
  );
}

export async function sendToGroups(api, message) {
  const groups = await getAllGroups();
  if (!groups || groups.length === 0) {
    console.log("[broadcast] No groups to broadcast to.");
    return { sent: 0, failed: 0, removed: 0 };
  }

  let sent = 0;
  let failed = 0;
  let removed = 0;

  for (const group of groups) {
    try {
      await api.sendMessage(group.telegram_group_id, message, {
        parse_mode: "Markdown",
      });
      sent++;
    } catch (err) {
      if (isDeadGroupError(err)) {
        await removeGroup(group.telegram_group_id).catch((e) =>
          console.error("[broadcast] Failed to remove dead group:", e.message)
        );
        removed++;
      } else {
        failed++;
      }
      console.error(
        `[broadcast] Failed for group ${group.telegram_group_id} (${group.group_title}): ${err.message}`
      );
    }
    await sleep(SEND_DELAY_MS);
  }

  console.log(
    `[broadcast] Done: ${sent} sent, ${failed} failed, ${removed} removed (dead groups).`
  );
  return { sent, failed, removed };
}

export async function sendToUsers(api, message) {
  const users = await getAllUsers();
  if (!users || users.length === 0) {
    console.log("[broadcast] No users to notify.");
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const user of users) {
    const id = user.telegram_id;
    const adminId = Number(process.env.ADMIN_TELEGRAM_ID);
    if (id === adminId) continue;

    try {
      await api.sendMessage(id, message, { parse_mode: "Markdown" });
      sent++;
    } catch (err) {
      failed++;
      console.error(`[broadcast] Failed for user ${id}: ${err.message}`);
    }
    await sleep(SEND_DELAY_MS);
  }

  console.log(`[broadcast] Users done: ${sent} sent, ${failed} failed.`);
  return { sent, failed };
}

export async function sendBroadcast(api, message = null) {
  const products = await getProducts();
  if (!products || products.length === 0) {
    console.log("[broadcast] No products in DB, aborting broadcast.");
    return;
  }

  const finalMessage = message || getDailyAd() || buildProductsMessage(products);
  const result = await sendToGroups(api, finalMessage);
  await sendToUsers(api, finalMessage);

  return result;
}