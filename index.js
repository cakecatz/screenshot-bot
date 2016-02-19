var ScreenshotBot = require('./lib/screenshot-bot').default;
var config = require('./config.json');
var bot = new ScreenshotBot(config.token);
bot.wakeup();
