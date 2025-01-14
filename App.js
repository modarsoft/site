const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const { parse } = require('path');
const token = '8123044764:AAGz2T-sKnJu2qsdqCI0Mmkw2qcU2D_hYdo';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome! Send me an image.');
});

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileUrl = await bot.getFileLink(fileId);
    const filePath = `./images/${fileId}.jpg`;

    // Download the image
    const response = await axios({
        url: fileUrl,
        responseType: 'stream',
    });

    // Save the image to the local file system
    response.data.pipe(fs.createWriteStream(filePath))
        .on('finish', () => {
            bot.sendMessage(chatId, 'Image saved!');
        })
        .on('error', (err) => {
            bot.sendMessage(chatId, 'Failed to save the image.');
            console.error(err);
        });
});



bot.onText(/\/clear/, async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    // Delete all messages in the chat
    for (let i = messageId; i > 0; i--) {
        try {
            await bot.deleteMessage(chatId, i);
        } catch (error) {
            console.error(`Failed to delete message ${i}:`, error);
        }
    }

    bot.sendMessage(chatId, 'All messages have been deleted.');
});

bot.on('message',(msg)=>{
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    bot.sendMessage(chatId,msg.message_id)
    bot.deleteMessage(chatId,msg.message_id)

    
})

bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Option 1', callback_data: '1' }],
                [{ text: 'Option 2', callback_data: '2' }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Please choose:', options);
});

bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    bot.sendMessage(message.chat.id, `Selected option: ${callbackQuery.data}`);
});

bot.onText(/\/input/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Please enter some text:', {
        reply_markup: {
            force_reply: true
        }
    });
});

bot.on('message', (msg) => {
    if (msg.reply_to_message && msg.reply_to_message.text === 'Please enter some text:') {
        bot.sendMessage(msg.chat.id, `You entered: ${msg.text}`);
        bot.sendMessage(msg.chat.id,parseInt(msg.text,10)*10)
    }
});

