require('date-utils');
let config = require('config');
let fs = require('fs');
let Trello = require('trello');

// Trello関連
const memberId = config.trello.memberId;
let trello = new Trello(config.trello.authKey, config.trello.authToken);

// ファイル出力関連
const outputPath = config.output.path;
// let filePath = outputPath + '/';
let filePath = outputPath + '/' + memberId + '/';
if (config.output.suffix === 'true') {
  let now = new Date();
  filePath += now.toFormat('YYYYMMDDHH24MI/');
}
if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath);
}

// 全ボード取得
let boardsPromise = trello.getBoards(memberId);
boardsPromise.then((json) => {

  // ボード毎にカード取得するPromise作成
  let promises = [];
  for (let i = 0, max = json.length; i < max; i++) {
    promises.push(addCardsToBoard(json[i]));
  }
 
  // ボード・カードの情報を整形して出力
  Promise.all(promises)
    .then((boards) => {
      console.log('boards.length' + boards.length);
      fs.writeFileSync(filePath + 'boards.json', JSON.stringify(boards, null, 2));
      // Todoist書式で出力
      let textTodoist = '';
      let textSpreadsheet = '';
      boards.forEach((board) => {
        if (!board.cards) {
          return;
        }
        console.log('board.cards.length' + board.cards.length);
        textTodoist += '[' + board.name + '](' + board.shortUrl + ')\n';
        textSpreadsheet += '=HYPERLINK("' + board.shortUrl + '","<' + board.name + '>")\n';
        board.cards.forEach((card) => {
          textTodoist += '...[' + card.name +'](' + card.shortUrl + ')\n';
          textSpreadsheet += '=HYPERLINK("' + card.shortUrl + '","' + card.name + '")\n';
        });
        textTodoist += '\n';
        textSpreadsheet += '\n';
      });

      fs.writeFileSync(filePath + '_todoist.txt', textTodoist);
      fs.writeFileSync(filePath + '_spreadheet.txt', textSpreadsheet);
    },
    (error) => {
      console.log('error');
    });
});

////////////////////////////////////////////////////////////////////////////////
// メソッド
////////////////////////////////////////////////////////////////////////////////

// ボードにカード情報を付加
function addCardsToBoard(board) {

  return new Promise((resolve, reject) => {

    trello.getCardsOnBoard(board.id, (error, json) => {
      if (error) {
        reject('Could not add card:' + error);
        return;
      }

      console.log('card.length: ' + json.length);
      if (json.length !== 0) {
        board.cards = json;
  
        // 取得した情報をファイル一旦出力
        fs.writeFileSync(filePath + board.name + '.json', JSON.stringify(board, null, 2));
      }
      resolve(board);
    });
  });
}