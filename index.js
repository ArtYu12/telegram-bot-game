const TelegramAPI = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
require('dotenv').config()

const bot = new TelegramAPI(process.env.TOKEN,{polling:true})

bot.setMyCommands([
    {command:"/start",description:"Приветствие"},
    {command:"/info",description:"Информация о тебе"},
    {command:"/game",description:"Игра отгадай число"},
])
const chats = new Map()

const startGame = async (chatId) => {
    await bot.sendMessage(chatId,`Сейчас я загадаю цифру от 0 до 9`)
    const number = Math.floor(Math.random() * 10)
    chats.set(chatId,number)
    console.log(chats)
    return bot.sendMessage(chatId,'Я загадал число. Отгадывай!',gameOptions)
}
const start = () => {
    bot.on('message',async (ctx) => {
        const text = ctx.text
        const chatId = ctx.chat.id
        if(text === "/start") {
            await bot.sendSticker(chatId,"https://media.stickers.wiki/hackers1998/683960.160.webp")
            return bot.sendMessage(chatId,`Ты написал мне ${text}`)
        }
        if(text === "/info") {
            return bot.sendMessage(chatId,`Тебя зовут ${ctx.from.first_name}`)
        }
        if(text === "/game") {
            startGame(chatId)
        }
        return bot.sendMessage(chatId,`Я тебя не понимаю`)
    })    
    bot.on("callback_query",async (ctx) => {
        const chatId = ctx.message.chat.id
        const text = ctx.data
        if(text === "/again") {
            return await startGame(chatId)
        }
        await bot.sendMessage(chatId,`Ты выбрал ${text}`)
        if(chats.get(chatId) === parseInt(text)) {
            return await bot.sendMessage(chatId,`Ты угадал!`,againOptions)
        } else {
            return bot.sendMessage(chatId,`К сожалению загаданное число было ${chats.get(chatId)}`,againOptions)
        }
    })
}
start()
