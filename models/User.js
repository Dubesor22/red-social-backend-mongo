const mongoose = require("mongoose");
const { isEmail } = require("validator");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your name"],
      minLength: [3, "Minimum username length is 3 characters"],
    },
    email: {
      type: String,
      unique: [true, "That email already exists"],
      required: [true, "Please enter an email"],
      validate: [isEmail, "Please enter a valid email"],
      lowercase: [true, "Please use only lowercase"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    role: String,
    confirmed: Boolean,
    avatar: String,
    tokens: [],
    postIds: [{ type: ObjectId, ref: "Post" }],
    wishList: [{ type: ObjectId, ref: "Post" }],
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
//fire a function after doc saved to db
UserSchema.post("save", function (doc, next) {
  console.log("new user was created & saved", doc);
  next();
});

// fire a function before doc saved to db
UserSchema.pre("save", function (next) {
  console.log("user about to be created & saved", this);
  next();
});

UserSchema.pre("remove", function (next) {
  this.model("User").remove({ followers: this._id }, next);
});

// UserSchema.methods.toJSON = function() {
//   const user = this._doc
//   user.totalFollowers2 = user.followers?.length; //el interrogante ignora el error al yo haberle indicado que no buscara en followers (undefined)
//   return user
// }

const User = mongoose.model("User", UserSchema);

module.exports = User;
