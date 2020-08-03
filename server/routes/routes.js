const passport = require("passport");
const router = require("express").Router();

const userCtrl = require("../controllers/userCtrl");

// 사용자 인증
// 가입, 로그인, 로그아웃
router.post("/signup", userCtrl.validateSignup, userCtrl.signup);
router.post("/signin", userCtrl.signin);// passport.authenticate("local-sign-in"),
router.get("/logout", userCtrl.logout);

// kakao auth
router.get("/auth/kakao", passport.authenticate("kakao", { failureRedirect: "/signin" }));
router.use("/auth/kakao/callback", userCtrl.kakaoLogin);

// facebook auth
router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"], failureRedirect: "/signin" }));
router.use("/auth/facebook/callback", userCtrl.facebookLogin);

// google auth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], failureRedirect: "/signin" }));
router.use("/auth/google/callback", userCtrl.googleLogin);

// login with email magic link
router.get("/loginwithemail", userCtrl.loginwithemail);

// send email with magic link
router.post("/sendverifyemail", userCtrl.sendVerifyEmail);

// User
router.get("/user", userCtrl.getUser);
router.post("/user", userCtrl.updateUser);

router.post("/address", userCtrl.postAddress);

module.exports = router;
