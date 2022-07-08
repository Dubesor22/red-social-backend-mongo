const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  authentication,
  isTheUser,
  isAdmin,
} = require("../middleware/authentication");
const { uploadUserImages } = require("../middleware/multer");

router.post("/", uploadUserImages.single("imageUser"), UserController.create);
router.get("/", UserController.getAll);
router.get("/confirm/:email", UserController.confirm);
router.post("/login", UserController.login);
router.delete("/id/:_id", authentication, isAdmin, UserController.adminDelete);
router.delete("/", authentication, UserController.userDelete);
router.put(
  "/",
  authentication,
  uploadUserImages.single("imageUser"),
  UserController.update
);
router.put(
  "/id/:_id",
  authentication,
  isAdmin,
  uploadUserImages.single("imageUser"),
  UserController.updateAdmin
);
router.delete("/logout", authentication, UserController.logoutUser);
router.put("logout/:_id", authentication, isAdmin, UserController.logoutAdmin);
router.get("/user", authentication, UserController.getInfo);
router.get("/id/:_id", UserController.getById);
router.get("/search/:username", UserController.getUserByName);
router.put("/follow/:_id", authentication, UserController.followUser);
router.put("/unfollow/:_id", authentication, UserController.unFollowUser);

module.exports = router;
