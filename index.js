require('dotenv').config()

const { Telegraf, Markup } = require('telegraf')
const express = require('express')
//const sqlite3 = require('sqlite3').verbose()

const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express()

const ADMIN_ID = Number(process.env.ADMIN_ID)

//const db = new sqlite3.Database('./database.db')

// ================= DATABASE =================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            telegram_id TEXT,
            username TEXT
        )
    `)

})

// ================= START =================

bot.start(async (ctx) => {

    db.run(
        'INSERT INTO users(telegram_id, username) VALUES(?, ?)',
        [ctx.from.id, ctx.from.username || 'none']
    )

    ctx.reply(
        '🎮 به دستیار گیمینگ خوش آمدی',
        Markup.inlineKeyboard([
            [Markup.button.callback('🔥 آموزش GTA V', 'gta')],
            [Markup.button.callback('⚔ آموزش PUBG', 'pubg')],
            [Markup.button.callback('🎥 آخرین ویدیو یوتیوب', 'youtube')],
            [Markup.button.callback('📂 دانلود فایل‌ها', 'files')],
            [Markup.button.callback('📞 پشتیبانی', 'support')]
        ])
    )
})

// ================= GTA =================

bot.action('gta', async (ctx) => {

    ctx.editMessageText(
        '🎮 بخش GTA V',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'مود گرافیکی', callback_data: 'mod_gta' }],
                    [{ text: 'سیو بازی', callback_data: 'save_gta' }],
                    [{ text: 'برگشت', callback_data: 'back' }]
                ]
            }
        }
    )

})

// ================= PUBG =================

bot.action('pubg', async (ctx) => {

    ctx.editMessageText(
        '⚔ بخش PUBG',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'تنظیمات حرفه‌ای', callback_data: 'pubg_setting' }],
                    [{ text: 'حساسیت بازی', callback_data: 'pubg_sens' }],
                    [{ text: 'برگشت', callback_data: 'back' }]
                ]
            }
        }
    )

})

// ================= YOUTUBE =================

bot.action('youtube', async (ctx) => {

    ctx.reply('🎥 آخرین ویدیو:\\nhttps://youtube.com/')

})

// ================= FILES =================

bot.action('files', async (ctx) => {

    ctx.reply('📂 فایل‌های دانلودی بزودی اضافه میشن')

})

// ================= SUPPORT =================

bot.action('support', async (ctx) => {

    ctx.reply('📞 آیدی پشتیبانی:\\n@support')

})

// ================= BACK =================

bot.action('back', async (ctx) => {

    ctx.deleteMessage()

    ctx.reply(
        '🎮 منوی اصلی',
        Markup.inlineKeyboard([
            [Markup.button.callback('🔥 آموزش GTA V', 'gta')],
            [Markup.button.callback('⚔ آموزش PUBG', 'pubg')],
            [Markup.button.callback('🎥 آخرین ویدیو یوتیوب', 'youtube')],
            [Markup.button.callback('📂 دانلود فایل‌ها', 'files')],
            [Markup.button.callback('📞 پشتیبانی', 'support')]
        ])
    )

})

// ================= GROUP PROTECTION =================

const badWords = ['badword1', 'badword2']

bot.on('text', async (ctx) => {

    if (!ctx.chat.title) return

    const text = ctx.message.text.toLowerCase()

    // ضد لینک
    if (text.includes('http')) {

        try {

            await ctx.deleteMessage()

            ctx.reply('🚫 ارسال لینک ممنوع است')

        } catch {}

    }

    // ضد فحش
    for (const word of badWords) {

        if (text.includes(word)) {

            try {

                await ctx.deleteMessage()

                ctx.reply('🚫 پیام نامناسب حذف شد')

            } catch {}

        }

    }

})

// ================= WELCOME =================

bot.on('new_chat_members', async (ctx) => {

    const user = ctx.message.new_chat_members[0]

    ctx.reply(
        `🎮 خوش آمدی ${user.first_name}
قوانین گروه را رعایت کن.`
    )

})

// ================= PANEL =================

bot.command('panel', async (ctx) => {

    if (ctx.from.id !== ADMIN_ID) return

    db.all('SELECT * FROM users', (err, rows) => {

        ctx.reply(
            `📊 پنل مدیریت

👥 تعداد کاربران: ${rows.length}`
        )

    })

})

// ================= WEB =================

app.get('/', (req, res) => {

    res.send('Gaming Assistant Bot Running')

})

app.listen(3000, () => {

    console.log('WEB SERVER RUNNING')

})

// ================= START BOT =================

bot.launch()

console.log('BOT STARTED')
