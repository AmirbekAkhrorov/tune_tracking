// Lightweight notification module — no circular deps
// bot.js calls setChatIds() on start; task routes call notify()
const path = require('path');
const fs = require('fs');

const chatIdsFile = path.join(__dirname, '../data/tg_chats.json');

function loadChatIds() {
  try { return JSON.parse(fs.readFileSync(chatIdsFile, 'utf8')); } catch { return []; }
}
function saveChatIds(ids) {
  fs.writeFileSync(chatIdsFile, JSON.stringify(ids));
}
function addChatId(id) {
  const ids = loadChatIds();
  if (!ids.includes(id)) { ids.push(id); saveChatIds(ids); }
}

let _bot = null;
function setBot(bot) { _bot = bot; }

async function notify(text) {
  if (!_bot) return;
  const ids = loadChatIds();
  for (const id of ids) {
    try { await _bot.telegram.sendMessage(id, text, { parse_mode: 'HTML' }); } catch (_) {}
  }
}

module.exports = { notify, setBot, addChatId, loadChatIds };
