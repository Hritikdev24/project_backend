const { foodModel } = require("../model/foodModel.js");
const fs = require("fs");

//adding food

async function addFood(req, res) {
  const image_name = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_name,
  });

  try {
    await food.save();
    res.status(201).json({ success: true, message: "Food Added" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Food Not Added" });
  }
}

//all food list

async function listFood(req, res) {
  try {
    const foods = await foodModel.find();
    res.status(200).json({ success: true, message: foods });
  } catch (err) {
    console.log(err);
    res.status(200).json({ success: false, message: "something went wrong" });
  }
}


// Food Remove Route

async function removeFood(req, res) {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Food Removed" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Food Not Removed" });
  }
}

module.exports = { addFood,listFood,removeFood };
