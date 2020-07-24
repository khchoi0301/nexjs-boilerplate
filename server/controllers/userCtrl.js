const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../models/user");

require("dotenv").config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

exports.validateSignup = (req, res, next) => {
	// express-validator가 middleware로 적용됨
	req.sanitizeBody("name");
	req.sanitizeBody("email");
	req.sanitizeBody("password");
	// sanitizeBody example Hello world :>)  to  Hello world :&gt;)

	// Name is non-null and is 2 to 15 characters
	req.checkBody("name", "Enter a name").notEmpty();
	req.checkBody("name", "Name must be between 2 and 15 character")
		.isLength({ min: 2, max: 15 });

	// Email is non-null, valid, and normalized
	req.checkBody("email", "Enter a valid email")
		.isEmail()
		.normalizeEmail();

	// Password must be non-null between 4 and 15 characters
	req.checkBody("password", "Enter a password").notEmpty();
	req.checkBody("password", "password must be between 4 and 15 character")
		.isLength({ min: 4, max: 15 });

	const errors = req.validationErrors();
	if (errors) {
		const firstError = errors.map(error => error.msg)[0];
		return res.status(400).send(firstError);
	}
	next();
};

const signJWT = async (user) => {
	const { name, email } = user;
	return await jwt.sign(
		{ name: name, email: email }, // 토큰의 내용(payload)
		TOKEN_SECRET, // 비밀 키
		{ expiresIn: "10m" } // 유효 시간은 10분
	);
};

exports.signup = (req, res, next) => {
	console.log("signup", passport);
	passport.authenticate("local-sign-up", (err, user, info) => {
		if (err) {
			console.warn("==err", err);
			return res.status(409).json(err);
		}

		if (!user) {
			console.log("==info", info);
			return res.status(409).json(info.message);
		}

		req.logIn(user, async () => {
			if (err) {
				return res.status(409).json(err);
			}
			const token = await signJWT(user);
			res.json({ token });
		});
	})(req, res, next);
};

exports.kakaoLogin = (req, res, next) => {
	passport.authenticate("kakao", (err, user, registered) => {
		console.log("oauth", err, user, registered); // registered 최초 가입 인지, 기존유저 로그인 인지
		req.logIn(user, async () => {
			res.redirect("/");
		});
	})(req, res, next);
};

exports.signin = async (req, res, next) => {
	// passport auth 성공 시에만 함수가 호출됨
	const user = await searchUser(req);
	const token = await signJWT(user);

	// 마지막 로그인 시간 수정 후 저장
	user.D_LASTLOGIN = new Date();
	await user.save();

	res.json({ token });
};

exports.logout = (req, res, next) => {
	console.log("logout");
	req.logout();
	res.json();
};

const searchUser = async (req, _id) => {
	const { user = {} } = req;
	const { provider, id, email } = user;
	console.log("searchUser", user);
	const condition = _id ? { _id: _id } : email ? { email } : { provider, id };
	const userData = await User.findOne(condition) || {};
	return userData;
};

module.exports.searchUser = searchUser;
