import { stripe } from "../lib/stripe.js";
import Coupon from "../models/Coupon.model.js";
import Order from "../models/Order.model.js";

export const createCheckoutSession = async (req, resp) => {
  try {
    const { products, couponCode } = req.body;
    console.log(products, couponCode);

    // Validate the products array
    if (!Array.isArray(products) || products.length === 0) {
      return resp
        .status(400)
        .json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    const lineItems = products.map((p) => {
      // Ensure price and quantity are valid numbers
      const price = p.product.price;
      const quantity = p.quantity || 1

      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for product ${p.product.name}`);
      }

      const amount = Math.round(price * 100); // Convert to cents

      // Calculate total amount
      totalAmount += quantity * amount;

      return {
        price_data: {
          currency: "usd", // Ensure currency is correct, or make it dynamic
          product_data: {
            name: p.product.name,
            images: [p.product.image],
          },
          unit_amount: amount,
        },
        quantity: p.quantity,
      };
    });

    let coupon = null;

    // Check for coupon code and validate it
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        const discount = coupon.discount;

        if (isNaN(discount) || discount < 0 || discount > 100) {
          throw new Error(`Invalid discount value for coupon ${couponCode}`);
        }
        // Apply discount
        totalAmount -= Math.round((totalAmount * discount) / 100);
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discount), // Ensure createStripeCoupon is defined correctly
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p.product._id,
            quantity: p.quantity,
            price: p.product.price,
          }))
        ),
      },
    });

    // Generate a new coupon for users spending $200 or more
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id); // Ensure createNewCoupon is defined properly
    }

    // Respond with session ID and total amount
    resp.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error in createCheckoutSession controller:", error.message);
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
  // Check if there's already an active coupon for the user
  const existingCoupon = await Coupon.findOne({ userId, isActive: true });

  if (existingCoupon) {
    console.log("User already has an active coupon. Not creating a new one.");
    return existingCoupon; // Return the existing active coupon
  }

  // Create a new coupon if no active coupon exists
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discount: 10,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
    isActive: true, // Ensure the coupon is marked as active
  });

  await newCoupon.save();
  return newCoupon;
}


export const checkoutSuccess = async (req, resp) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Check if an order with this stripeSessionId already exists
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

      if (existingOrder) {
        // If the order already exists, return success to avoid duplication
        return resp.status(200).json({
          success: true,
          message: "Order already processed",
          orderId: existingOrder._id,
        });
      }

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
          product: product.id, // Ensure id is present in product object
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, // Stripe amount in cents, converting to dollars
        stripeSessionId: sessionId,
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

