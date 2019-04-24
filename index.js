var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');

require('dotenv').config();

let app = express();

let timer = 3000;

let bangalore = 3;
let hyderabad = 3;

function sendBangaloreMail() {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'prateek@whitepanda.in, sanishkr@gmail.com',
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
          if ($('#venuelist').children('.list').length > bangalore) {
            bangalore++;
            return sendBangaloreMail();
          }
        }
      }
    );
  }, 15000);

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
          if ($('#venuelist').children('.list').length > hyderabad) {
            hyderabad++;
            return sendHyderabadMail();
          }
        }
      }
    );
  }, 15000);

  return true;
}

app.listen('3000', () => {
  console.log('Server is running');
  doBangaloreStuff();
  doHyderabadStuff();
});
