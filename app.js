var express = require("express");
const satori = require("satori").default;
var fs = require("fs");
require("dotenv").config();
// workarounds to use ESM only packages in commonjs file
const html = (...args) =>
  import("satori-html").then(({ html }) => html(...args));
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

var app = express();
app.use(express.static("public"));

const NotoSans = fs.readFileSync("./public/NotoSans-Black.ttf");

app.get("/", async (req, res) => {
  const { username } = req.query;
  const stats = await fetch(
    `https://leetcode-stats-api.herokuapp.com/${username}`
  );
  let data = await stats.json();

  const string = `<div style="display: flex; flex-direction: column; justify-content: space-between; row-gap: 15px; font-weight: 600; padding: 1rem; width:100%; height: 100%">
  <h2 style="color: #467DE5">${username}'s Leetcode Stats</h2>
  <div style="display: flex; flex-direction: column; justify-content: space-between; row-gap: 15px; width: 80%">
  
  <div style="display:flex; flex-direction: row; justify-content: space-between"><div style="display:flex; flex-direction: row; align-items: center;  column-gap: 10px"><div style="display:flex; width: 10px;height:10px; background-color: #50C878	; border-radius: 100%"></div><span>Easy</span></div><span>${data.easySolved}</span></div>
  <div style="display:flex; flex-direction: row; justify-content: space-between"><div style="display:flex; flex-direction: row; align-items: center;  column-gap: 10px"><div style="display:flex; width: 10px;height:10px; background-color: #FFC300	; border-radius: 100%"></div><span>Medium</span></div><span>${data.mediumSolved}</span></div>
  <div style="display:flex; flex-direction: row; justify-content: space-between"><div style="display:flex; flex-direction: row; align-items: center;  column-gap: 10px"><div style="display:flex; width: 10px;height:10px; background-color:#FF5733; border-radius: 100%"></div><span>Hard</span></div><span>${data.hardSolved}</span></div>
  </div>
</div>`;
  const markup = await html(string);

  const svg = await satori(markup, {
    width: 400,
    height: 200,
    fonts: [
      {
        name: "NotoSans",
        data: NotoSans,
        // weight: 400,
        // style: "normal",
      },
    ],
  });

  res.header("Content-Type", "image/svg+xml");

  res.send(svg);
});

app.get("/health-check", (req, res) => {
  res.send("I'm good");
});

module.exports = app;
