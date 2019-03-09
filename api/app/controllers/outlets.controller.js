const fs = require("fs");
const path = require("path");
const xmlReader = require("read-xml");
const convert = require("xml-js");
const FILE = path.join(
  __dirname,
  "../../config/FullStackTest_DeliveryAreas.kml"
);
const inside = require("point-in-polygon");
var NodeGeocoder = require("node-geocoder");

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

function getLatAndLong(address) {
  var options = {
    provider: "google",
    apiKey: "AIzaSyAYuSWsNt4lN-0bb27zwcbaNybjzGjP_rc"
  };
  let geocoder = NodeGeocoder(options);
  return geocoder.geocode(address);
}

exports.findOne = (req, res) => {
  const addressDetails = req.body.addressDetails || "";

  if (addressDetails.length) {
    getLatAndLong(addressDetails)
      .then(function(resData) {
        const locationDetails = resData[0];

        const coordinates = [
          locationDetails.longitude,
          locationDetails.latitude
        ];

        xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
          if (err) {
            res.status(500).send("Error reading KML file!");
          }

          var xml = data.content;
          var result = JSON.parse(
            convert.xml2json(xml, { compact: true, spaces: 4 })
          );

          const listOfPlaceMark = result.kml.Document.Placemark || [];
          let polygonData = [];
          let responseData = "No data found for the given location";

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

            if (inside(coordinates, polygonData)) {
              responseData = currentPolyData.name._text;
            }
          }

          res.status(200).send({
            responseData
          });
        });
      })
      .catch(function(err) {
        res.status(500).send("Something went wrong!");
      });
  } else {
    res.status(400).send("Addresse is required");
  }
};
