require('date-utils');
let config = require('config');
let fs = require('fs');
let Trello = require('trello');

// Trello関連
const memberId = config.trello.memberId;
let trello = new Trello(config.trello.authKey, config.trello.authToken);

// ファイル出力関連
const outputPath = config.output.path;
let filePath = outputPath + '/';
// let filePath = outputPath + '/' + memberId + '/';
if (config.output.suffix === 'true') {
  let now = new Date();
  filePath += now.toFormat('YYYYMMDDHH24MI/');
}
if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath);
}

// let text = '';    // ファイル出力用バッファー
let boards = [] ;

let boardsPromise = trello.getBoards(memberId);
boardsPromise.then((json) => {
  // 全ボード取得
  boards = json;

  // ボード毎にカード取得
  let promises = [];
  console.log('max:' + json.length);
  for (let i = 0, max = json.length; i < max; i++) {
    promises.push(exportCardsPromise(json[i]));
  }
  Promise.all(promises)
    // .then((json) => {
    //   console.dir(json);
    //   cards = json;
    //   console.dir(cards);

    // }).then(() => {
      // // 取得した情報をファイル出力
      // fs.writeFileSync(flileName, JSON.stringify(boards, null, 2));
      // fs.writeFileSync(flileName + '.2', JSON.stringify(cards, null, 2));
    // });

});

function exportCardsPromise(board) {
  let cardsPromise = trello.getCardsOnBoard(board.id);
  cardsPromise.then((json) => {
    if (json.length !== 0) {
      let cards = [] ;
      let boadWk = {};
      cards = json;
      boadWk = board;
      boadWk.cards = cards;
      boards.push(boadWk);

      // 取得した情報をファイル一旦出力
      let flileName = filePath + board.name + '.json';
      fs.writeFileSync(flileName, JSON.stringify(boadWk, null, 2));
    }
  });
}
