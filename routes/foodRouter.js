const express = require("express");
const foodRouter = express.Router();
const path = require("path");
const multer = require("multer");
const { addFood, listFood,removeFood } = require("../controllers/foodController.js");
// controllers



//image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
foodRouter.post("/add", upload.single("image"), addFood);


// foodlist
foodRouter.get("/list", listFood);
//remove food item

foodRouter.post("/remove",removeFood)
module.exports = { foodRouter };
