const { userModel } = require("../model/userModel.js");

// add to cart

async function addCart(req, res) {
  try {
    if (!req.body.userId || !req.body.itemId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and Item ID are required" });
    }

    const user = await userModel.findById(req.body.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData || {};
    cartData[req.body.itemId] = (cartData[req.body.itemId] || 1) + 1;

    await userModel.updateOne(
      { _id: req.body.userId },
      {
        $set: {
          cartData: cartData,
        },
      }
    );

    console.log("Updated user cart:", user);
    res
      .status(200)
      .json({
        success: true,
        message: "Added to cart",
        cartData: user.cartData,
      });
  } catch (err) {
    console.error("Error in addCart:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// remove from cart

async function removeCart(req, res) {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const cartData = user.cartData;
    if (cartData[req.body.itemId] > 1) {
      cartData[req.body.itemId] -= 1;
    }else if(cartData[req.body.itemId]==1){
          delete cartData[req.body.itemId]
    }
    else {
      return res
        .status(400)
        .json({ success: false, message: "no item present" });
    }
    await userModel.updateOne({ _id: req.body.userId }, { cartData: cartData });
    res.status(200).json({ success: true, message: "removed from cart" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "something went wrong" });
  }
}

async function clear(req, res) {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (user) {
      await  userModel.updateOne(
        { _id: req.body.userId },
        {
          $set: {
            cartData: {
              [req.body.itemId]: 0,
            },
          },
        }
      );
     if(user.cartData[req.body.itemId]==0){
      delete user.cartData[req.body.itemId];
     }
      res.status(200).json({ success: true, message: "remove from the cart" });
    } else {
      res.status(400).json({ success: false, message: "something went wrong" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
}

//get  cartData

  async function cartDa(req,res){
   
     try{
        
    const user=await userModel.findOne({_id:req.body.userId});
    const cartData=user.cartData;
    res.status(200).json({success:true,message:cartData})

     }catch(err){
        console.log(err);
        res.status(400).json({success:false,message:"token is not present"})
     }
  }




module.exports = { addCart, removeCart,cartDa,clear };
