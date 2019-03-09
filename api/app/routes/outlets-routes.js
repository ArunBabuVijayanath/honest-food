module.exports = app => {
  const outlets = require("../controllers/outlet.controller.js");
  app.get("/outlet", outlets.findOne);
};
