module.exports = app => {
  const outlets = require("../controllers/outlets.controller.js");
  app.post("/outlet", outlets.findOne);
};
