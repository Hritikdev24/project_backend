const { orderModel } = require("../model/orderModel.js");
const { userModel } = require("../model/userModel.js");
const Razorpay = require("razorpay");
const crypto = require("crypto-js");

//order from frontEnd

async function placeOrder(req, res) {
  try {
    const orderInfo = await orderModel.create({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    //payment link using the stripe

    const razorpay = new Razorpay({
      key_id: process.env.RAZOR_ID,
      key_secret: process.env.RAZOR_SECRETE_KEY,
    });

    try {
      const { amount } = req.body;

      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Math.random() * 1000}`,
      };

      const order = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        order,
        orderInfo,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Unable to create order",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "something went wrong" });
  }
}

async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, _id } =
      req.body;

    // Step 1: Create the expected signature using crypto-js
    const generatedSignature = crypto
      .HmacSHA256(
        `${razorpay_order_id}|${razorpay_payment_id}`,
        process.env.RAZOR_SECRETE_KEY
      )
      .toString(crypto.enc.Hex);

    // Step 2: Compare signatures
    if (generatedSignature === razorpay_signature) {
      // Step 3: Update order status in the database
      await orderModel.findOneAndUpdate(
        { "paymentOrder.id": razorpay_order_id },
        { paymentStatus: "Paid", paymentId: razorpay_payment_id }
      );

      await userModel.findOneAndUpdate(
        { _id: req.body.userId },
        { cartData: {} }
      );

      await orderModel.findOneAndUpdate({ _id: _id }, { payment: true });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      await orderModel.deleteOne({ _id: _id });
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Error in /verify-payment:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
}

async function orderList(req, res) {
  try {
    const data = await orderModel.find({ userId: req.body.userId });
    res.status(200).json({ success: true, message: data });
  } catch (err) {
    console.log("err");
    res.status(400).json({ success: false, message: "something went wrong" });
  }
}

//order list for the admine

async function menuList(req, res) {
  try {
    const response = await orderModel.find({});
    res.status(200).json({ success: true, message: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}

// update the order status

async function orderStatus(req, res) {
  try {
    await orderModel.updateOne(
      { _id: req.body.id },
      {
        status: req.body.status,
      }
    );
    res.status(200).json({ success: true, message: "status updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}

module.exports = {
  placeOrder,
  verifyPayment,
  orderList,
  menuList,
  orderStatus,
};
