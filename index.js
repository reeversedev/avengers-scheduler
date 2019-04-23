var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');

let app = express();

let timer = 3000;

function sendBangaloreMail() {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: 'reeversedev@gmail.com',
    to: 'gogia.prateek@hotmail.com, sanishkr@gmail.com',
    subject: 'Avengers is here.',
    html:
      '<p>Hey! This is a reminder that new theatre has started screening Avengers: End Game</p>'
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

async function doBangaloreStuff() {
  console.log('Doing Bangalore...');
  clearInterval(timer);

  setInterval(async () => {
    console.log('Making the request');
    await request(
      'https://in.bookmyshow.com/buytickets/avengers-endgame-bengaluru/movie-bang-ET00100674-MT/20190426',
      (error, response, html) => {
        if (!error & (response.statusCode == 200)) {
          var $ = cheerio.load(html);
          if ($('#venuelist').length > 1) {
            return sendBangaloreMail();
          }
        }
      }
    );
  }, 300000);

  return true;
}

function sendHyderabadMail() {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: 'reeversedev@gmail.com',
    to: 'sunandansharma2012@gmail.com',
    subject: 'Avengers is here.',
    html:
      '<p>Hey! This is a reminder that new theatre has started screening <a href="https://in.bookmyshow.com/buytickets/pvr-forum-sujana-mall-kukatpally-hyderabad/cinema-hyd-PVSF-MT/20190426">Avengers: End Game</a></p>'
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

async function doHyderabadStuff() {
  console.log('Doing Hyderabad...');
  clearInterval(timer);

  setInterval(async () => {
    console.log('Making the request');
    await request(
      'https://in.bookmyshow.com/buytickets/pvr-forum-sujana-mall-kukatpally-hyderabad/cinema-hyd-PVSF-MT/20190426',
      (error, response, html) => {
        if (!error & (response.statusCode == 200)) {
          var $ = cheerio.load(html);
          if ($('#venuelist').length > 1) {
            return sendHyderabadMail();
          }
        }
      }
    );
  }, 300000);

  return true;
}

app.listen('3000', () => {
  console.log('Server is running');
  doBangaloreStuff();
  doHyderabadStuff();
});
