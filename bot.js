const { Telegraf } = require('telegraf');
const express = require('express');
const multer = require('multer');

// --- НАСТРОЙКИ ---
const BOT_TOKEN = '8793492212:AAGOd2XwNBzqbdAEgWBhBEBEbOLaQAc80HA'; 
const WEB_APP_URL = 'https://твой-ник.github.io/my-fest-app/'; 
const ADMIN_CHAT_ID = '-1004395895220'; // Куда бот будет скидывать фотки гостей

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Настройка CORS, чтобы твой сайт на GitHub Pages мог делать запросы к Render
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Настройка приема файлов в оперативную память
const upload = multer({ storage: multer.memoryStorage() });

// Приветственное сообщение
bot.start((ctx) => {
  const userName = ctx.from.first_name || "друг";
  const welcomeText = `Привет, ${userName}! 👋\n\nДобро пожаловать на *Vulitsa Ezha* — твой официальный гид! 🎪\n\nЖми кнопку ниже, чтобы открыть расписание, карту и форму загрузки фото!`;

  ctx.replyWithMarkdown(welcomeText, {
    reply_markup: {
      inline_keyboard: [[{ text: "Открыть ГИД 🚀", web_app: { url: WEB_APP_URL } }]]
    }
  });
});

// ЭНДПОИНТ ДЛЯ ПРИЕМА ФОТО ИЗ МИНИ-АППКИ
app.post('/upload', upload.array('media'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'Файлы не найдены' });
    }

    // Перебираем все присланные файлы и пересылаем их тебе в Telegram
    for (const file of req.files) {
      const fileBuffer = file.buffer;

      if (file.mimetype.startsWith('image/')) {
        await bot.telegram.sendPhoto(ADMIN_CHAT_ID, { source: fileBuffer }, { caption: '📸 Новое фото от гостя фестиваля!' });
      } else if (file.mimetype.startsWith('video/')) {
        await bot.telegram.sendVideo(ADMIN_CHAT_ID, { source: fileBuffer }, { caption: '🎥 Новое видео от гостя фестиваля!' });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка отправки медиа:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Запуск бота
bot.launch().then(() => console.log('🚀 Бот запущен!'));

// Запуск сервера для связи с сайтом
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер принимает файлы на порту ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
