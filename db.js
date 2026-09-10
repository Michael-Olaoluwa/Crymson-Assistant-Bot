import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function upsertUser(telegramId, firstName, username) {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      { telegram_id: telegramId, first_name: firstName, username },
      { onConflict: "telegram_id" }
    )
    .select();
  if (error) throw error;
  return data;
}

export async function addGroup(telegramGroupId, groupTitle) {
  const { data, error } = await supabase
    .from("groups")
    .upsert(
      { telegram_group_id: telegramGroupId, group_title: groupTitle },
      { onConflict: "telegram_group_id" }
    )
    .select();
  if (error) throw error;
  return data;
}

export async function removeGroup(telegramGroupId) {
  const { data, error } = await supabase
    .from("groups")
    .delete()
    .eq("telegram_group_id", telegramGroupId);
  if (error) throw error;
  return data;
}

export async function insertProblem(telegramId, messageText) {
  const { data, error } = await supabase
    .from("problems")
    .insert({ telegram_id: telegramId, message_text: messageText })
    .select();
  if (error) throw error;
  return data;
}

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
}

export async function getAllGroups() {
  const { data, error } = await supabase.from("groups").select("*");
  if (error) throw error;
  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
}

export async function removeGroupByTelegramId(telegramGroupId) {
  const { data, error } = await supabase
    .from("groups")
    .delete()
    .eq("telegram_group_id", telegramGroupId);
  if (error) throw error;
  return data;
}
