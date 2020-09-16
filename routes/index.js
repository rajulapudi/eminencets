var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");
const { sendEmail } = require("../service/Mail");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home");
});

router.get("/careers", function (req, res, next) {
  res.render("careers", { info: "" });
});

router.post("/resume", function (req, res, next) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const { name, email, skills, contact } = fields;
    if (files.resume.name) {
      var oldPath = files.resume.path;
      var newPath =
        path.join(__dirname, "../", "uploads") + "/" + files.resume.name;
      var rawData = fs.readFileSync(oldPath);
      fs.writeFile(newPath, rawData, function (err) {
        if (err) {
          console.log(err);
        } else {
          sendEmail({
            email: email,
            name: name,
            skills: skills,
            contact: contact,
            file: {
              name: files.resume.name,
              path: newPath,
            },
          }).then((ret) => {
            if (ret.status === 200) {
              res.render("careers", { info: "Success" });
            }
          });
        }
      });
    } else {
      res.render("careers", { info: "Success" });
    }
  });
});

module.exports = router;
