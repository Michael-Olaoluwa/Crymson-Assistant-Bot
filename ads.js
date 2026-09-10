// Pool of beautifully written adverts. One is chosen per day (rotating daily).
// NOTE: links/pitches here are curated copy. If you change a product in the
// Supabase `products` table, update the matching ad here too.

export const ads = [
  // ===== EazeShare (free P2P file/text sharing, no accounts) =====
  {
    title: "EazeShare",
    text:
      `*EazeShare* 📦✨\n\n` +
      `Share files and text in seconds — *no account, no sign-up, no drama.*\n\n` +
      `• Send anything, instantly\n` +
      `• Works straight from your browser\n` +
      `• Only the link matters — that's it\n\n` +
      `Code snippets, big files, notes between devices — EazeShare just works.\n\n` +
      `👉 [Start sharing — it's free](https://eazeshare.vercel.app)`,
  },
  {
    title: "EazeShare",
    text:
      `*Ditch the file-transfer hassle* 📤\n\n` +
      `Email attachments are too small. USB sticks are too slow. Cloud logins are too much.\n\n` +
      `With *EazeShare*, files and text move *peer-to-peer* — with zero accounts standing in your way.\n\n` +
      `Fast. Frictionless. Free.\n\n` +
      `🚀 [Give it a try](https://eazeshare.vercel.app)`,
  },
  {
    title: "EazeShare",
    text:
      `*One link. Done.* ⚡\n\n` +
      `That's all EazeShare needs for you to share anything — no account creation, no "which service was this on?"\n\n` +
      `Files. Text. Anything.\n\n` +
      `https://eazeshare.vercel.app — sharing has never been this easy. ✨`,
  },

  // ===== Watchtower (free GitHub-connected deploy + log monitor) =====
  {
    title: "Watchtower",
    text:
      `*Watchtower* 🛰️\n\n` +
      `Your code, deployed and *monitored* — from GitHub to live, in one glance.\n\n` +
      `• GitHub-connected deploys\n` +
      `• Live logs when something breaks\n` +
      `• Free for developers\n\n` +
      `Stop chasing errors. Start shipping with confidence.\n\n` +
      `🔭 [Deploy with Watchtower](https://watch-tower-jet.vercel.app/)`,
  },
  {
    title: "Watchtower",
    text:
      `*Sleep while your app works* 😴\n\n` +
      `Watchtower keeps an eye on your deployments and logs so *you* don't have to.\n\n` +
      `Something goes down? Watchtower is already watching. Nothing goes down? Enjoy the peace of mind.\n\n` +
      `Built for devs. *Free* for devs.\n\n` +
      `🛰️ [Try Watchtower free](https://watch-tower-jet.vercel.app/)`,
  },
  {
    title: "Watchtower",
    text:
      `*Your early warning system* ⚠️\n\n` +
      `Catch deployment failures and weird logs *before* your users do.\n\n` +
      `Watchtower plugs into your GitHub workflow and monitors right alongside it — your very own look-out tower for every release.\n\n` +
      `Skip the sleepless deploys.\n\n` +
      `👉 [Raise the Watchtower](https://watch-tower-jet.vercel.app/)`,
  },

  // ===== JOBALAT (Telegram job alert bot) =====
  {
    title: "JOBALAT",
    text:
      `*JOBALAT* 💼\n\n` +
      `Your dream job is out there — and JOBALAT makes sure you're *first to know.*\n\n` +
      `• Job alerts sent straight to Telegram\n` +
      `• Never miss an application window again\n` +
      `• Opportunities, delivered daily\n\n` +
      `Your only job is to apply. JOBALAT handles the hunting. 🎯\n\n` +
      `👉 [Get JOBALAT](https://jobalat-sage-vercel.app)`,
  },
  {
    title: "JOBALAT",
    text:
      `*Missed another great job?* ⏰\n\n` +
      `Not anymore.\n\n` +
      `JOBALAT hunts for opportunities and drops them straight into your Telegram — so you apply fast, before the crowd does.\n\n` +
      `Opportunity doesn't wait. Neither should you.\n\n` +
      `🔥 [Never miss an update](https://jobalat-sage-vercel.app)`,
  },
  {
    title: "JOBALAT",
    text:
      `*For everyone chasing growth* 🚀\n\n` +
      `JOBALAT delivers opportunities right where you already live: Telegram.\n\n` +
      `No more refreshing job boards. No more FOMO. Just alerts that show up when it matters.\n\n` +
      `👉 [Let JOBALAT hunt for you](https://jobalat-sage-vercel.app)`,
  },

  // ===== The Crymson family (all products) =====
  {
    title: "Crymson family",
    text:
      `*Meet the Crymson family* 💜\n\n` +
      `Three tools that make dev life easier — built by people who actually code:\n\n` +
      `1. 💼 *JOBALAT* — job alerts that never miss → [Get it](https://jobalat-sage-vercel.app)\n` +
      `2. 🛰️ *Watchtower* — deploys + logs, monitored → [Get it](https://watch-tower-jet.vercel.app/)\n` +
      `3. 📦 *EazeShare* — files & text, no accounts → [Get it](https://eazeshare.vercel.app)\n\n` +
      `Try one, try all — it's free. 🚀`,
  },
  {
    title: "Crymson family",
    text:
      `*Your dev toolkit just got better* 🧰\n\n` +
      `A job alert bot that never sleeps, a monitor that watches your deploys, and file sharing with zero friction.\n\n` +
      `• 💼 JOBALAT → [jobalat-sage-vercel.app](https://jobalat-sage-vercel.app)\n` +
      `• 🛰️ Watchtower → [watch-tower-jet.vercel.app](https://watch-tower-jet.vercel.app/)\n` +
      `• 📦 EazeShare → [eazeshare.vercel.app](https://eazeshare.vercel.app)\n\n` +
      `That's the Crymson lineup — and it's all free. ⚡`,
  },
];

// Pick a different ad each day by rotating through the pool.
export function getDailyAd(date = new Date()) {
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  return ads[dayIndex % ads.length].text;
}