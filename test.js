require('date-utils');
let config = require('config');
let fs = require('fs');
let Trello = require('trello');

// Trello関連
const memberId = config.trello.memberId;
let trello = new Trello(config.trello.authKey, config.trello.authToken);

// ファイル出力関連
const outputPath = config.output.path;
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}
let flileName = outputPath + '/' + 'testOutput';
if (config.output.suffix === 'true') {
  let now = new Date();
  flileName += now.toFormat('_YYYYMMDDHH24MI');
}
flileName += '.txt'

let obj = [];

for (let i = 0; i < 5; i++) {
  obj.push(
    {
      name: 'name' + i,
      id: 'id' + i
    });

  // obj.name = 'name' + i;
  // obj.id = 'id' + i;

}

// 取得した情報をファイル出力
fs.writeFileSync(flileName, JSON.stringify(obj));
