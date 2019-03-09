const AddressModel = require("../models/address.model.js");
const fs = require("fs");
const path = require("path");
const xmlReader = require("read-xml");
const convert = require("xml-js");
const FILE = path.join(
  __dirname,
  "../../config/FullStackTest_DeliveryAreas.kml"
);
const inside = require("point-in-polygon");

function getCordinatesList(dataString) {
  let polygonData = [];
  dataString = dataString.forEach(element => {
    let elementWithOutSpace = element.trim(" ");
    if (elementWithOutSpace.length) {
      let coordinatesArray = elementWithOutSpace
        .split(",")
        .map(data => parseFloat(data));
      coordinatesArray.pop();
      polygonData.push(coordinatesArray);
    }
  });

  return polygonData;
}

exports.findAll = (req, res) => {
  AddressModel.find()
    .then(AddressModelData => {
      res.send(AddressModelData);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes."
      });
    });
};

exports.findOne = (req, res) => {
  const dummyInput = [1.5, 1.5];
  xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
    if (err) {
      console.error(err);
    }

    var xml = data.content;
    var result = JSON.parse(
      convert.xml2json(xml, { compact: true, spaces: 4 })
    );

    const listOfPlaceMark = result.kml.Document.Placemark || [];
    let polygonData = [];
    let responseData = "No data found for given location";

    for (let i = 0; i < listOfPlaceMark.length; i++) {
      let currentPolyData = listOfPlaceMark[i];

      if ("Point" in currentPolyData) {
        polygonData = getCordinatesList(
          currentPolyData.Point.coordinates._text.split("\n")
        );
      } else if ("Polygon" in currentPolyData) {
        polygonData = getCordinatesList(
          currentPolyData.Polygon.outerBoundaryIs.LinearRing.coordinates._text.split(
            "\n "
          )
        );
      }

      if (inside(dummyInput, polygonData)) {
        responseData = currentPolyData.name._text;
        res.send({
          responseData
        });
      }
      console.log(polygonData);
    }

    res.send({
      responseData
    });
  });
};
