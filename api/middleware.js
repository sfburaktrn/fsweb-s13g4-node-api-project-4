const model = require("./user-model");

function logger(req, res, next) {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toLocaleString();
  console.log(`${timestamp}--${method}--${url}`);
  next();
}

function checkSameUserName(req, res, next) {
  try {
    const { kullaniciAdi } = req.body;
    const isSame = !!kullaniciAdi && model.checkIsSameUserName(kullaniciAdi);
    if (isSame) res.status(400).json({ message: "Aynı username mevcuttur" });
    else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

function validateNewUser(req, res, next) {
  try {
    const { kullaniciAdi, sifre } = req.body;
    if (!kullaniciAdi || !sifre) {
      res.status(400).json({ message: "Eksik Alan var" });
    } else {
      req.user = { kullaniciAdi: kullaniciAdi, sifre: sifre };
      next();
    }
  } catch (error) {
    next(error);
  }
}

function isValidUser(req, res, next) {
  try {
    let user = { kullaniciAdi: req.body.kullaniciAdi, sifre: req.body.sifre };
    const isExist = model.findUser(user);
    if (!isExist) {
      res.status(404).json({ message: "Böyle bir kullanıcı yok" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  logger,
  validateNewUser,
  checkSameUserName,
  isValidUser,
};
