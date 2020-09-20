var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");
const { sendEmail, contactEmail } = require("../service/Mail");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home");
});

router.get("/careers", function (req, res, next) {
  res.render("careers", { info: "" });
});
router.get("/about", function (req, res, next) {
  res.render("aboutPage");
});
router.get("/contact", function (req, res, next) {
  res.render("contactUs");
});
router.get("/clients", function (req, res, next) {
  res.render("clientsPage");
});

router.post("/contactus", function (req, res, next) {
  console.log("route called");
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let phone = req.body.phone;
  let subject = req.body.subject;
  contactEmail({
    email: email,
    name: name,
    phone: phone,
    subject: subject,
    message: message,
  })
    .then((ret) => {
      if (ret.status === 200) {
        console.log("sending response");
        res.status(200).send("OK");
      }
    })
    .catch((e) => {
      res.status(500).send("Not OK");
    });
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
