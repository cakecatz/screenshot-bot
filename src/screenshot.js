const Nightmare = require('nightmare');
let nightmare = null;

export default function screenshot(url, filepath) {
  const imageName = `${filepath}/${(new Date).getTime()}.png`;
  nightmare = new Nightmare();
  return new Promise((resolve) => {
    nightmare
      .viewport(1920, 1080)
      .goto(url)
      .wait('body')
      .screenshot(imageName)
      .end()
      .then((result) => {
        nightmare = null;
        resolve(imageName);
      });
  });
}
