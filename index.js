const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options.js')

const token = '5314774738:AAGcz0doL97EsH5axS7KR94LGLKmrGXvqQI'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 0 до 9, а ты должен будешь её отгадать!`
  )
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Отгадай!', gameOptions)
}
const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' }
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/2.webp'
      )
      return bot.sendMessage(chatId, `Добро пожаловать на тестовый канал`)
    }
    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      )
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз')
  })
  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }

    if (data == chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю ты отгадал, бот загадал цифру ${chats[chatId]}, ты нажал ${data}`,
        againOptions
      )
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}, ты нажал ${data}`,
        againOptions
      )
    }

    bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
    console.log(msg)
  })
}
start()
