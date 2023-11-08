const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');

// Token bot Telegram Anda
const token = '6891387998:AAHmOb6C3fKe9s9CsiI1KhX7rpUhecCtk5M';

// Inisialisasi bot
const bot = new TelegramBot(token, { polling: true });

// Daftar pengingat
const reminders = [];

// Mendengarkan pesan dari pengguna
bot.onText(/\/setreminder (.+) (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const date = match[1];
  const message = match[2];

  // Membuat jadwal pengingat
  const reminderDate = new Date(date);
  if (isNaN(reminderDate)) {
    bot.sendMessage(chatId, 'Format tanggal tidak valid. Gunakan format YYYY-MM-DD HH:MM.');
    return;
  }

  // Menambahkan pengingat ke daftar
  reminders.push({ chatId, date: reminderDate, message });

  bot.sendMessage(chatId, `Pengingat telah dijadwalkan untuk tanggal ${reminderDate}`);
});

// Mengecek pengingat yang harus dikirim
const checkReminders = () => {
  const now = new Date();
  for (const reminder of reminders) {
    if (reminder.date <= now) {
      bot.sendMessage(reminder.chatId, `Pengingat: ${reminder.message}`);
      reminders.splice(reminders.indexOf(reminder), 1);
    }
  }
};

// Jadwalkan pengecekan pengingat setiap menit
schedule.scheduleJob('* * * * *', checkReminders);

// Menyambut pesan awal dari pengguna
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Selamat datang! Anda dapat menggunakan /setreminder YYYY-MM-DD HH:MM pesan untuk membuat pengingat.');
});

// Jalankan bot
bot.on('polling_error', (error) => console.log(error));
