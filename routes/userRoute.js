const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  forgotPassword,
  googleAuth,
  logoutUser,
} = require("../controllers/userController");

const { isAuthenticatedUser,isAdmin } = require("../middlewares/authorize");
router.route("/").get(isAuthenticatedUser,isAdmin,   getUsers);
router.route("/:id").get(isAuthenticatedUser,isAdmin ,getUser);
router.route("/createUser").post(createUser);
router.route("/update/:id").put(isAuthenticatedUser,updateUser);
router.route("/delete/:id").delete(isAuthenticatedUser,isAdmin,deleteUser);
router.route("/login").post(loginUser);
router.route("/forgotpassword").post(isAuthenticatedUser, forgotPassword);
router.route("/googleauth").post(googleAuth);
router.route("/appleauth").post(appleAuth);
router.route("/facebookauth").post(facebookAuth);
router.route("/logout").post(isAuthenticatedUser, logoutUser);
module.exports = router;
