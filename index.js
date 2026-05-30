require('dotenv').config()

const { Telegraf, Markup } = require('telegraf')
const express = require('express')

const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express()

const ADMIN_ID = Number(process.env.ADMIN_ID)

// ================= START =================

bot.start(async (ctx) => {

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

    await ctx.editMessageText(
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

    await ctx.editMessageText(
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

    await ctx.reply('🎥 آخرین ویدیو یوتیوب:\nhttps://youtube.com/')

})

// ================= FILES =================

bot.action('files', async (ctx) => {

    await ctx.reply('📂 فایل‌های دانلودی به زودی اضافه می‌شوند.')

})

// ================= SUPPORT =================

bot.action('support', async (ctx) => {

    await ctx.reply('📞 آیدی پشتیبانی:\n@support')

})

// ================= BACK =================

bot.action('back', async (ctx) => {

    try {
        await ctx.deleteMessage()
    } catch {}

    await ctx.reply(
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

    if (text.includes('http')) {

        try {
            await ctx.deleteMessage()
            await ctx.reply('🚫 ارسال لینک ممنوع است')
        } catch {}

    }

    for (const word of badWords) {

        if (text.includes(word)) {

            try {
                await ctx.deleteMessage()
                await ctx.reply('🚫 پیام نامناسب حذف شد')
            } catch {}

        }

    }

})

// ================= WELCOME =================

bot.on('new_chat_members', async (ctx) => {

    const user = ctx.message.new_chat_members[0]

    await ctx.reply(
        `🎮 خوش آمدی ${user.first_name}
قوانین گروه را رعایت کن.`
    )

})

// ================= PANEL =================

bot.command('panel', async (ctx) => {

    if (ctx.from.id !== ADMIN_ID) return

    await ctx.reply('📊 پنل مدیریت فعال است')

})

// ================= WEB =================

app.get('/', (req, res) => {

    res.send('Gaming Assistant Bot Running')

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {

    console.log('WEB SERVER RUNNING')

})

// ================= START BOT =================

bot.launch()

console.log('BOT STARTED')
