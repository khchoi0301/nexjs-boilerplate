const passport = require("passport");
const router = require("express").Router();

const userCtrl = require("../controllers/userCtrl");

// 사용자 인증
// 가입, 로그인, 로그아웃
router.post("/signup", userCtrl.validateSignup, userCtrl.signup);
router.post("/signin", passport.authenticate("local-sign-in"), userCtrl.signin);
router.get("/logout", userCtrl.logout);

// 카카오 인증
router.get("/kakao", passport.authenticate("kakao", { failureRedirect: "/signin" }));
router.use("/oauth", userCtrl.kakaoLogin);

// 구글 인증
// TODO: 구글 인증

module.exports = router;
