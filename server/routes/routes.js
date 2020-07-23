const passport = require("passport");
const router = require("express").Router();

const userCtrl = require("../controllers/userCtrl");

router.post("/signup", userCtrl.validateSignup, userCtrl.signup);
router.post("/signin", passport.authenticate("local-sign-in"), userCtrl.signin);
router.get("/logout", userCtrl.logout);

module.exports = router;
