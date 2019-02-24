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
let flileName = outputPath + '/' + memberId;
if (config.output.suffix === 'true') {
  let now = new Date();
  flileName += now.toFormat('_YYYYMMDDHH24MI');
}
flileName += '.txt';

// 全ボード取得
let boardsPromise = trello.getBoards(memberId);
boardsPromise.then((boards) => {

  let text = '';    // ファイル出力用バッファー
  // console.dir(boards);
  // text += boards['name'];
  text += JSON.stringify(boards);
  text += '\n';
  return(text);

}).then((text) => {

  // 取得した情報をファイル出力
  fs.writeFileSync(flileName, text);

});



// trello.getMemberCards(memberId, (error, value)=>{
//   if (error) {
//     console.log('error');
//   }
//   else {
//     let text = '';
//     for (let item in value) {

//       text += 'name:' + value[item]['name'] + '\n';
//       text += 'shortUrl:' + value[item]['shortUrl'] + '\n';
//       text += '\n\n';
//     }

//     // 取得した情報をファイル出力
//     let now = new Date();
//     let flileName = outputPath + '/' + memberId + now.toFormat('_YYYYMMDDHH24MI.txt');
//     fs.writeFileSync(flileName, text);
//   }

// });



// trello.addCard('Clean car', 'Wax on, wax off', myListId,
//     function (error, trelloCard) {
//         if (error) {
//             console.log('Could not add card:', error);
//         }
//         else {
//             console.log('Added card:', trelloCard);
//         }
//     });