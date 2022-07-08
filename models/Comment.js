const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    postId: {
      type: ObjectId,
      ref: "Post",
    },
    body: {
      type: String,
      required: [true, "You can't post an empty comment!"],
    },
    avatar: String,
    likes: [{ type: ObjectId }],
  },
  { timestamps: true }
);

CommentSchema.pre("remove", function (next) {
  this.model("Assignment").remove({ comments: this._id }, next);
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
