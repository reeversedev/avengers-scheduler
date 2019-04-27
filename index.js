var request = require("request");
var cheerio = require("cheerio");
var nodemailer = require("nodemailer");
var fs = require("fs");
var telegram = require("telegram-bot-api");
var util = require("util");
var http = require("http");

require("dotenv").config();

// Setting Timer for 5 minutes

let timer = 1000;

// Setting Initial Values of theatres that I already Know for locations (Since this is only for small purpose. Don't expect too much for me. Okay?)

let bangalore = 3;
let hyderabad = 3;
let mumbai = 2;
let count = 1;

// Handle Bangalore Requests

function sendBangaloreMail() {
  if (process.env.BANGALORE_RECIPIENTS) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.BANGALORE_RECIPIENTS,
      subject: "Avengers is here.",
      html:
        "<p>Hey! This is a reminder that new theatre has started screening Avengers: End Game</p>"
    };

    return transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  } else {
    return;
  }
}

async function doBangaloreStuff() {
  console.log("Doing Bangalore...");
  clearInterval(timer);

  setInterval(async () => {
    console.log("Making the request");
    try {
      await request(
        "https://in.bookmyshow.com/buytickets/avengers-endgame-bengaluru/movie-bang-ET00100674-MT/20190426",
        (error, response, html) => {
          if (response) {
            if (!error & (response.statusCode == 200)) {
              var $ = cheerio.load(html);
              if ($("#venuelist").children(".list").length > bangalore) {
                bangalore++;
                return sendBangaloreMail();
              }
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }, timer);

  return true;
}

// Handle Hyderabad Requests

function sendHyderabadMail() {
  if (process.env.HYDERABAD_RECIPIENTS) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: "reeversedev@gmail.com",
      to: process.env.HYDERABAD_RECIPIENTS,
      subject: "Avengers is here.",
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
  } else {
    return;
  }
}

// Send a telegram message
function sendMumbaiTelegramMessage() {
  var api = new telegram({
    token: process.env.TOKEN
  });

  api
    .sendMessage({
      chat_id: process.env.CHATID,
      text: "Avengers Theatres list updated !"
    })
    .then(function(data) {
      console.log(util.inspect(data, false, null));
    })
    .catch(function(err) {
      console.log(err);
    });

  api
    .sendMessage({
      chat_id: process.env.CHATID1,
      text: "Avengers Theatres list updated !"
    })
    .then(function(data) {
      console.log(util.inspect(data, false, null));
    })
    .catch(function(err) {
      console.log(err);
    });
}

async function doHyderabadStuff() {
  console.log("Doing Hyderabad...");
  clearInterval(timer);
  setInterval(async () => {
    console.log("Making the request");
    await request(
      "https://in.bookmyshow.com/buytickets/pvr-forum-sujana-mall-kukatpally-hyderabad/cinema-hyd-PVSF-MT/20190426",
      (error, response, html) => {
        if (response) {
          if (!error & (response.statusCode == 200)) {
            var $ = cheerio.load(html);
            if ($("#venuelist").children(".list").length > hyderabad) {
              hyderabad++;
              return sendHyderabadMail();
            }
          }
        }
      }
    );
  }, timer);

  return true;
}

async function doMumbaiStuff() {
  console.log("Doing Mumbai...");
  clearInterval(timer);
  setInterval(async () => {
    // console.log("Making the request Mumbai " + count++);
    try {
      await request(
        "https://in.bookmyshow.com/buytickets/avengers-endgame-mumbai/movie-mumbai-ET00100668-MT/20190502",
        (error, response, html) => {
          if (response) {
            if (!error & (response.statusCode == 200)) {
              console.log("--- URL HIT --- " + count++);
              var $ = cheerio.load(html);
              if ($("#venuelist").children(".list").length > mumbai) {
                mumbai++;
                return sendMumbaiTelegramMessage();
              }
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }, timer);

  return true;
}

http.createServer().listen(process.env.PORT || 3000, () => {
  console.log("Server at PORT 3000 started.");
  // doBangaloreStuff();
  // doHyderabadStuff();
  doMumbaiStuff();
});
