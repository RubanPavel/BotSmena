const API = "";
//API бота
const App_link = "";
//после каждого деплоя обновляем значение переменной
const idSheet = ''
//id таблицы
const chatIds = []
//id чатов

/////////////////////////////////////////////////////////////////////////////////////
// Функция для отправки сообщения пользователю
/////////////////////////////////////////////////////////////////////////////////////

function send(msg, chat_ids) {
  chat_ids.map(chat_id => {
    let payload = {
      'method': 'sendMessage',
      'chat_id': String(chat_id),
      'text': msg,
      'parse_mode': 'HTML'
    }
    let data = {
      'method': 'post',
      'payload': payload
    }
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API + '/', data);
  });
}

function timer() {
  chatIds.map(chatId => {
    var sheet = SpreadsheetApp.openById(idSheet).getSheetByName("Смены");
    let data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 8).getValues();

    let currentDay = new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear();
    //let currentTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();


    var filteredData = data.filter(function (row) {
      if (row[1] !== "" && row[1] !== undefined) {
        smenaToday = row[1].getDate() + "." + (row[1].getMonth() + 1) + "." + row[1].getFullYear().toString();
        return smenaToday === currentDay; // Замените 1 на индекс столбца, по которому нужно фильтровать (нумерация с 0)
      }
    });

    let dayOfWeek = filteredData[0][0]; // Воскресенье

    let date = new Date(filteredData[0][1]);
    let thisDay = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();// Дата

    let eventDay = filteredData[0][2]; // День
    let workerDay = filteredData[0][3]; // Работник
    let eventNight = filteredData[0][4]; // Ночь
    let workerNight = filteredData[0][5]; // Работник
    let event24 = filteredData[0][6]; // Cутки
    let worker24 = filteredData[0][7]; // Работник


    sendText(chatId,
      'Сегодня '
      + '\n' + dayOfWeek + ' ' + thisDay
      + (workerDay ? '\n' + eventDay + ' --- ' + workerDay : '')
      + (workerNight ? '\n' + eventNight + ' --- ' + workerNight : '')
      + (worker24 ? '\n' + event24 + ' --- ' + worker24 : ''));
  });
}

function sendText(chatId, text, keyBoard) {

  let data = {
    method: 'post',
    payload: {
      method: 'sendMessage',
      chat_id: String(chatId),
      text: text,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify(keyBoard)
    }
  }

  UrlFetchApp.fetch("https://api.telegram.org/bot" + API + '/', data);

}


function doPost(e) {
  let update = JSON.parse(e.postData?.contents);
  var message = update.message;
  processMessage(message);

  if (update.hasOwnProperty('message')) {
    let msg = update.message;
    let text = msg.text;
    let user = msg.from.username;

    // Обработка команды /hello
    if (text.toLowerCase() === '/hello') {
      Logger.log(text.toLowerCase() === '/hello')
      sendText(`Привет, ${user}! Это ответ на команду /hello.`, chatId);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ 'ok': true }));
}

/*function api_connector() {
  UrlFetchApp.fetch("https://api.telegram.org/bot" + API + "/setWebHook?url=" + App_link);
}*/


