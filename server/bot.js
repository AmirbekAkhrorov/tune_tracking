const { Telegraf } = require('telegraf');
const { setBot, addChatId } = require('./notifier');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TG_KEY = process.env.TG_KEY || 'tune2026tg';

let miniAppUrl = 'https://unhateful-marti-climbable.ngrok-free.dev/tg?key=' + TG_KEY + '&ngrok-skip-browser-warning=true'; // update when ngrok URL changes

function setMiniAppUrl(url) { miniAppUrl = url + '/tg?key=' + TG_KEY; }

function startBot() {
  const bot = new Telegraf(BOT_TOKEN);
  setBot(bot);

  async function sendDashboardButton(ctx) {
    addChatId(ctx.chat.id);
    const isHttps = miniAppUrl.startsWith('https://');
    if (isHttps) {
      try {
        await ctx.reply(
          `👨‍🚀 *TUNE, TRACK ME!*\n\nДобро пожаловать, босс! Отслеживайте команду в реальном времени.`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: '📊 Открыть дашборд', web_app: { url: miniAppUrl } }
              ]]
            }
          }
        );
        return;
      } catch(_) {}
    }
    // Fallback: send plain text when no HTTPS yet
    ctx.reply(
      `Для открытия дашборда нужен HTTPS (ngrok).\n\nЗапустите ngrok и отправьте:\n/seturl https://ваш-ngrok-адрес.ngrok-free.app`
    );
  }

  bot.start(ctx => sendDashboardButton(ctx));

  bot.command('status', ctx => {
    addChatId(ctx.chat.id);
    sendDashboardButton(ctx);
  });

  bot.command('url', ctx => {
    ctx.reply(`Текущий URL Mini App:\n<code>${miniAppUrl}</code>`, { parse_mode: 'HTML' });
  });

  // /seturl https://abc123.ngrok-free.app  — update ngrok URL on the fly
  bot.command('seturl', ctx => {
    const parts = ctx.message.text.split(' ');
    if (parts.length < 2 || !parts[1].startsWith('http')) {
      return ctx.reply('Использование: /seturl https://your-ngrok-url.ngrok-free.app');
    }
    setMiniAppUrl(parts[1]);
    ctx.reply(`✅ URL обновлён!\n\nНовая ссылка на дашборд:\n<code>${miniAppUrl}</code>\n\nОтправьте /start чтобы открыть.`, { parse_mode: 'HTML' });
  });

  bot.launch({ dropPendingUpdates: true }).catch(e => {
    console.warn('  Bot launch error:', e.message);
  });
  console.log('  Bot:     @tunetrackme_bot (polling)');

  // Graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
}

module.exports = { startBot, setMiniAppUrl, TG_KEY };
