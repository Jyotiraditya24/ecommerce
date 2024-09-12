import { stripe } from "../lib/stripe.js";
import Coupon from "../models/Coupon.model.js";
import Order from "../models/Order.model.js";


export const createCheckoutSession = async (req, resp) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return resp
        .status(400)
        .json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // to convert to cents
      totalAmount += product.quantity * amount;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discount) / 100);
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discount),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: p._id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    });

    if (totalAmount >= 20000) {
      // 200 dollars
      createNewCoupon(req.user._id);
    }

    resp.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.log("Error in createCheckoutSession controller", error.message);
    resp.status(500).json({ error: error.message });
  }
};

async function createStripeCoupon(discount) {
  const coupon = await stripe.coupon.create({
    percent_off: discount,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discount: 10,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await newCoupon.save();
  return newCoupon;
}

export const checkoutSuccess = async (req, resp) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Deactivate the coupon if it was used
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            userId: session.metadata.userId,
            code: session.metadata.couponCode,
          },
          { isActive: false }
        );
      }

      // Parse products from session metadata and create a new order
      const products = JSON.parse(session.metadata.products); // string to object
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product._id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, // Stripe amount in cents, converting to dollars
        stripeSessionId: sessionId, // Fixed the typo here
      });

      await newOrder.save();

      resp.status(200).json({
        success: true,
        message: "Payment successful, order created, and coupon deactivated",
        orderId: newOrder._id,
      });
    } else {
      resp.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }
  } catch (error) {
    console.log(`Error in checkout-success controller`, error.message);
    resp.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};