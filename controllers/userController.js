const { userModel } = require("../model/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const nodemailer = require("nodemailer");
const key =process.env.JWT_SECRETE;
//Login User

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "all fields are required" });
  }
  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          const token = jwt.sign(
            {
              data: user._id,
            },
            key
          );
          res
            .status(200)
            .json({ success: true, message: "user login", token: token });
        } else {
          res.status(400).json({ success: false, message: "User Not Found" });
        }
      });
    } else {
      res.status(400).json({ success: false, message: "User Not Found" });
    }
  } catch (err) {}
}

// Register user

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!validator.isEmail(email)) {
    res.status(400).json({ success: false, message: "Enter Valide Email" });
  }
  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: "something went wrong" });
  } else {
    try {
      const user = await userModel.findOne({ email: email });
      if (user) {
        res
          .status(400)
          .json({ success: false, message: "email is already present" });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, async function (err, hash) {
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user:process.env.USER,
                pass:process.env.PASS,
              },
            });

            let message = {
              from: "hritikgangadhar90@gmail.com",
              to: email, // s
              subject: "About Registration",
              text: `You just logged in on Foodie at ${new Date().toLocaleDateString()}`,
            };

            transporter.sendMail(message, (error, info) => {
              if (error) {
                console.error("Error sending email:", error);
              } else {
                console.log("Email sent successfully:", info.messageId);
              }
            });

            const newUser = await userModel.create({
              name: name,
              email: email,
              password: hash,
            });

            const token = jwt.sign(
              {
                data: newUser._id,
              },
              key,
              { expiresIn: "1h" }
            );

            res
              .status(200)
              .json({ success: true, message: "user register", token: token });
          });
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, message: "something went wrong" });
    }
  }
}

module.exports = { loginUser, registerUser };
