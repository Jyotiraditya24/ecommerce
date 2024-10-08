import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"], // corrected the "true"
    },
    email: {
      type: String,
      required: [true, "Email is required"], // corrected the "true"
      unique: true, // removed quotes from "true"
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"], // corrected the "true"
      minlength: [6, "Password must be at least 6 characters long"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error); // Keep this for error handling
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error comparing passwords", error.message);
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
