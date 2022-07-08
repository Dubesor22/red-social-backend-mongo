const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const PostController = require("../controllers/PostController");
const {
  authentication,
  isAuthorPost,
  isAdmin,
} = require("../middleware/authentication");
const { uploadPostImages } = require("../middleware/multer");

router.post(
  "/",
  authentication,
  uploadPostImages.single("imagePost"),
  PostController.create
);
router.get("/", PostController.getAll);
router.get("/id/:_id", PostController.getById);
router.get("/search/:title", PostController.getPostsByName);
router.delete("/id/:_id", authentication, isAuthorPost, PostController.delete);
router.put(
  "/id/:_id",
  authentication,
  isAuthorPost,
  uploadPostImages.single("imagePost"),
  PostController.update
);
router.delete(
  "/delete/:_id",
  authentication,
  isAdmin,
  PostController.deleteAdmin
);
router.get("/postsbypage/", authentication, PostController.getPostsByPage);
router.put("/likes/:_id", authentication, PostController.like);
router.put("/removelikes/:_id", authentication, PostController.removeLike);
router.get("/info/:_id", authentication, PostController.getInfo);

module.exports = router;
