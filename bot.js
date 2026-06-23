const { Telegraf } = require('telegraf');
const http = require('http');

// 1. ВСТАВЬ СВОЙ ТОКЕН ОТ BOTFATHER МЕЖДУ КАВЫЧКАМИ
const BOT_TOKEN = '8793492212:AAGOd2XwNBzqbdAEgWBhBEBEbOLaQAc80HA'; 

// 2. ВСТАВЬ ССЫЛКУ НА ТВОЙ ГИД НА GITHUB PAGES МЕЖДУ КАВЫЧКАМИ
const WEB_APP_URL = 'https://mikitkaaaa-glitch.github.io/my-fest-app/'; 

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const userName = ctx.from.first_name || "друг";
  
  const welcomeText = `Привет, ${userName}! 👋\n\n` +
    `Добро пожаловать на *Vulitsa Ezha* — твой главный гастрономический и музыкальный уикенд! 🎪🍔\n\n` +
    `Я — твой официальный карманный помощник. Внутри этого бота ты найдешь всё для идеальных выходных:\n\n` +
    `📅 *Актуальное расписание:* Тайминги Главной сцены и все электронные вибрации на сцене MODUL.\n` +
    `🗺 *Карта локации:* Удобный план, чтобы легко найти фуд-корт, бары и чилл-зоны.\n` +
    `🎨 *Воркшопы:* Быстрая запись на мастер-классы в один тап.\n` +
    `📸 *Интерактив:* Делись своими сочными кадрами и видео прямо в приложении!\n\n` +
    `Чтобы запустить интерактивный гид, просто жми кнопку «Открыть ГИД 🚀» ниже!`;

  ctx.replyWithMarkdown(welcomeText, {
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: "Открыть ГИД 🚀", 
            web_app: { url: WEB_APP_URL } 
          }
        ]
      ]
    }
  });
});

// Запуск бота
bot.launch()
  .then(() => console.log('🚀 Бот успешно запущен в облаке!'))
  .catch((err) => console.error('Ошибка запуска:', err));

// Лайфхак для Render: создаем веб-заглушку, чтобы сервер не выдавал ошибку портов
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running alive!\n');
});

// Render автоматически передает нужный порт в переменную process.env.PORT
server.listen(process.env.PORT || 3000, () => {
  console.log('Dummy-сервер активен');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
