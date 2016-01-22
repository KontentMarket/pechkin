console.log('This process is pid ' + process.pid);

var nodemailer = require('nodemailer');
var smtpPool   = require('nodemailer-smtp-pool');
var config     = require('./config.json');

var transporter = nodemailer.createTransport(smtpPool({
    host: config.host,
    port: config.port,
    auth: config.auth,
    // использовать 2 параллельных коннекта
    maxConnections: 2,
    // не отправлять больше 4 сообщений за одно соединение
    maxMessages: 4,
    // не отправлять больше 2 сообщений в секунду
    rateLimit: 2
}));



var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'pechkin',
  password : 'pechkin',
  database : 'pechkin'
});

connection.connect();
connection.query('SELECT * from maillist where errors <= ?', [3], function(err, rows, fields) {
  if (!err) {
    if (!rows.length) {
      console.log('No emails. Closing connection.');
      connection.end() }
    else {
      connection.query('update maillist set status=? where status=0', [process.pid]);

      rows.forEach(function(row) {
          console.log('sending mail to ' + row.email_to + '..');
          transporter.sendMail({
              to:      row.email_to,
              subject: row.subject,
              html:    row.body,
              from:    config.auth.user // row.email_from
          }, function(err, info){
                 if (!err) {
                     console.log('deleting ' + row.id + '..');
                     connection.query('delete from maillist where id=?', [row.id], function(err, rows, fields) { if (err) console.log(err) });
                     if (rows[rows.length-1].id === row.id) { console.log('Last email is sent. Closing connection.'); connection.end(); }
                 }
                 else {
                     console.log('Sending error: ' + err);
                     console.log(row.id);
                     connection.query('update maillist set status=0, errors=errors+1, error_message=? where id=?', [err.toString(), row.id], function(err, rows, fields) {
                         if (err) console.log(err);
                     });
                    if (rows[rows.length-1].id === row.id) { console.log('Can\'t send last email. Closing connection.'); connection.end(); }
                 }
             });
      });
    }
    // console.log('Get mails: ', rows);
  }
  else
    console.log('Error while performing select from maillist.');
});
