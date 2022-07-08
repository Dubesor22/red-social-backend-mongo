const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    status: String,
    title: {
      type: String,
      required: [true, "You need to provide a title to your post"],
    },
    body: {
      type: String,
      required: [true, "The post's body it's empty"],
    },
    userId: {
      type: ObjectId,
      ref: "User",
    },
    avatar: String,
    likes: [{ type: ObjectId }],
    postdate: Date,
    comments: [{ type: ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

PostSchema.pre("remove", function (next) {
  this.model("Post").remove({ Comment_Id: this._id }, next);
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
