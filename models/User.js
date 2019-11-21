const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      default: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    firstName: String,
    lastName: String,
    phoneNumber: String,
    postalCode: String,
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
        default: []
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
