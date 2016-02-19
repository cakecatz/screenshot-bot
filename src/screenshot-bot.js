const Botkit = require('botkit');
const screenshot = require('./screenshot').default;
const isUrl = require('is-url');
const fs = require('fs');
const SlackUpload = require('node-slack-upload');
const os = require('os');

const messageTypes = {
  'DIRECT_MESSAGE': 'direct_message',
  'DIRECT_MENTION': 'direct_mention',
  'MENTION': 'mention',
};

class ScreenshotBot {
  constructor(token_) {
    this.token = token_;
    this.debug = true;
    this.imagePath = os.tmpdir();
    this.fileUpload = new SlackUpload(token_);

    this.controller = Botkit.slackbot({
      debug: this.debug,
    });
  }

  startHearing() {
    this.controller.hears('<(.*)>', [
      messageTypes.DIRECT_MENTION,
      messageTypes.DIRECT_MENTION,
      messageTypes.MENTION,
    ], (bot, message) => {
      const siteUrl = message.match[1];
      if (isUrl(siteUrl)) {
        screenshot(siteUrl, this.imagePath).then((file) => {
          bot.reply(message, 'Take capture!');
          this.fileUpload.uploadFile({
            file: fs.createReadStream(file),
            title: 'capture',
            channels: message.channel,
          }, (err) => {
            console.log(err);
          });
        });
      } else {
        bot.reply(message, 'It is not valid URL.');
      }
    });
  }

  wakeup() {
    this.controller.spawn({
      token: this.token,
    }).startRTM();

    this.startHearing();
  }
}

export default ScreenshotBot;
