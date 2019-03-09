module.exports = app => {
  const outlets = require("../controllers/outlet.controller.js");
  app.post("/outlet", outlets.findOne);
};
