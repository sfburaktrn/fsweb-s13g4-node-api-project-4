const express = require("express");
const cors = require("cors");
const mw = require("./middleware");
const userModel = require("./user-model");

const server = express();
server.use(express.json());
server.use(mw.logger);
server.use(cors());

server.get("/api/kullanicilar", (req, res, next) => {
  res.json(userModel.getAllUsers());
});

server.post(
  "/api/kayitol",
  mw.checkSameUserName,
  mw.validateNewUser,
  (req, res, next) => {
    let user = req.user;
    let createdUser = userModel.createNewUser(user);
    res.status(201).json(createdUser);
  }
);

server.post("/api/giris", mw.isValidUser, (req, res, next) => {
  res.status(201).json({ message: "Hoş Geldiniz " + req.body.kullaniciAdi });
});

server.use((err, req, res, next) => {
  let status = err.status || 500;
  res.status(status).json({
    customMessage: "Bir hata oluştu, server noktasından bu mesaj yazıldı",
    message: err.message,
  });
});

module.exports = server;
