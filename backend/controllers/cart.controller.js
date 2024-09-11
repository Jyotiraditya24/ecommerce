import Product from "../models/Product.model.js";

export const addToCart = async (req, resp) => {
  const { productId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return resp.status(404).json({ message: "Product not found" });
    }
    const user = req.user;

    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }

    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
    }
    await user.save();
    resp
      .status(200)
      .json({ message: "Product added to cart", cart: user.cartItems });
  } catch (error) {
    console.log("Error in add to cart controller", error.message);
    resp.status(500).json({ message: error.message });
  }
};

export const removeAllFromCart = async (req, resp) => {
  const { productId } = req.body;
  try {
    const user = req.user;
    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
    }
    await user.save();
    resp.status(200).json({ message: "Item zeroed", cart: user.cartItems });
  } catch (error) {
    console.log("Error in remove all from cart controller", error.message);
    resp.status(500).json({ message: error.message });
  }
};

export const updateQuantity = async (req, resp) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const exisitingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );
    if (exisitingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item.product.toString() !== productId
        );
        await user.save();
        return resp
          .status(200)
          .json({ message: "Item quantity updated", cart: user.cartItems });
      }
      exisitingItem.quantity = quantity;
      await user.save();
      return resp
        .status(200)
        .json({ message: "Item quantity updated", cart: user.cartItems });
    } else {
      resp.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in update quantity controller", error.message);
    resp.status(500).json({ error: error.message });
  }
};

export const getCartProducts = async (req, resp) => {
  try {
    const user = req.user;
    const cartItems = user.cartItems;

    if (!user.cartItems || user.cartItems.length === 0) {
      return resp.status(404).json({ message: "Cart is empty" });
    }

    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.product) },
    });

    const finalCartItems = products.map((product) => {
      const a = cartItems.find(
        (item) => item.product.toString() === product._id.toString()
      );
      return {
        product,
        quantity: a.quantity,
      };
    });

    return resp.status(200).json({ cart: finalCartItems });

    // now adding quantity for each product
  } catch (error) {
    console.log("Error in get cart products controller", error.message);
    resp.status(500).json({ error: error.message });
  }
};
