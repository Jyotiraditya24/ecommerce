import Coupon from "../models/Coupon.model.js";
export const getCoupon = async (req, resp) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    resp.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    resp.status(500).json({ error: error.message });
  }
};

export const validateCoupon = async (req, resp) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return resp.status(404).json({ message: "Coupon not found" });
    }
    if (coupon.expiration < Date.now()) {
      coupon.isActive = false;
      await coupon.save();
      return resp.status(404).json({ message: "Coupon expired" });
    }
    return resp.json({
      message: "Coupon valid",
      code: coupon.code,
      discount: coupon.discount,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    resp.status(500).json({ error: error.message });
  }
};
