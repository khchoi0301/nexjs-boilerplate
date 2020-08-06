const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Address = require("../models/address");

require("dotenv").config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const SMTP_SERVICE = process.env.SMTP_SERVICE;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_ADDRESS = process.env.SMTP_FROM_ADDRESS;
const PRODUCTION_URL = process.env.PRODUCTION_URL;
const PORT = process.env.PORT;

exports.validateSignup = (req, res, next) => {
	// express-validator가 middleware로 적용됨
	req.sanitizeBody("name");
	req.sanitizeBody("email");
	req.sanitizeBody("password");
	// sanitizeBody example Hello world :>)  to  Hello world :&gt;)

	// Name is non-null and is 2 to 15 characters
	req.checkBody("name", "이름을 입력해 주세요").notEmpty();
	req
		.checkBody("name", "Name must be between 2 and 30 character")
		.isLength({ min: 2, max: 30 });

	// Email is non-null, valid, and normalized
	req.checkBody("email", "Enter a valid email").isEmail().normalizeEmail();

	// Password must be non-null between 4 and 15 characters
	req.checkBody("password", "Enter a password").notEmpty();
	req
		.checkBody("password", "4 ~ 20 자리의 비밀 번호를 사용해 주세요")
		.isLength({ min: 4, max: 20 });

	const errors = req.validationErrors();
	if (errors) {
		const firstError = errors.map((error) => error.msg)[0];
		return res.status(400).send(firstError);
	}
	next();
};

exports.validatePwd = (req, res, next) => {
	console.log("validatePwd");
	// express-validator가 middleware로 적용됨
	req.sanitizeBody("newPwd");
	// sanitizeBody example Hello world :>)  to  Hello world :&gt;)

	// Password must be non-null between 4 and 15 characters
	req.checkBody("newPwd", "Enter a password").notEmpty();
	req
		.checkBody("newPwd", "4 ~ 20 자리의 비밀 번호를 사용해 주세요")
		.isLength({ min: 4, max: 20 });

	const errors = req.validationErrors();
	if (errors) {
		const firstError = errors.map((error) => error.msg)[0];
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

const sendEmail = async (email, url, redirect) => {
	console.log("sendEmail url", url);

	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		service: SMTP_SERVICE,
		auth: {
			user: SMTP_USER, // generated ethereal user
			pass: SMTP_PASS // generated ethereal password
		}
	});

	const emailSubject = redirect ? "Change your password ✔" : "Verify your email ✔";

	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: SMTP_FROM_ADDRESS, // sender address
		to: email, // list of receivers
		subject: emailSubject, // Subject line
		text: "Verify Your Account", // plain text body
		html: `<h1>Verify Your Account</h1><a href\=\"${url}\">Click here to log in with this magic link<a>`, // html body
	});

	console.log("Message sent: %s", info);
};

const verifyEmail = async (user, redirect) => {
	let { _id, email } = user;

	if (!_id) {
		const usr = await User.findOne({ email: email });
		if (!usr) {
			console.log("user not registered");
			return { err: "user not registered" };
		}
		_id = usr._id;
	}

	console.log("user", _id, email);

	// verify key를 생성하고 user db에  저장
	const verify_key = crypto.randomBytes(256).toString("hex").substr(50, 25);
	const url = `${PRODUCTION_URL}:${PORT}/api/loginwithemail?verified=${verify_key}&redirect=${redirect}`;
	await User.findByIdAndUpdate(_id, { verify_key });

	// verify key를 일정 시간 후 무효화 시킴
	setTimeout(() => {
		console.log("===settimeout", _id, verify_key);
		User.findByIdAndUpdate(_id, { verify_key: "Invalid" }, (err, res) => {
			console.log("res", err, res);
		});
	}, 1000 * 60 * 5); // 5분간만 유효함

	// 메일로 해당 키를 포함한 링크를 보낸다.
	await sendEmail(email, url, redirect);
};

exports.sendVerifyEmail = async (req, res) => {
	const { body = {} } = req;
	const { email, redirect } = body;
	console.log("sendVerifyEmail", email, redirect);

	// redirect 있으면 비밀번호 찾기 모드로 변경
	if (redirect) {
		console.log("update isFindingPwd");
		const user = await User.findOne({ email });
		user.isFindingPwd = true;
		// 바로 확인 하지 않아 await 하지 않음
		user.save();
	}

	const error = await verifyEmail({ email }, redirect);

	if (error) {
		res.json(error);
	} else {
		res.json({ email });
	}
};

exports.loginwithemail = async (req, res, next) => {
	passport.authenticate("local-link", async (err, user, info) => {
		console.log("loginwithemail", err, user);

		if (err) {
    	console.warn("==err", err);
    	return res.status(409).json(err);
		}

		if (!user) {
    	// console.warn("user not found", info);
    	return res.status(409).json(info);
		}

		// db confirmed 으로 바꾸기
		const userdata = await User.findByIdAndUpdate(user._id, { confirmed: true });

		// 로그인 시키기
		req.logIn(user, async () => {
			if (err) {
				return res.status(409).json(err);
			}
			console.log("userdata.isFindingPwd", userdata.isFindingPwd);
			// 비밀번호 찾기 모드에서는 비밀번호 변경 페이지로 이동, 가입 인증 시에는 메인 이동
			const redirect = userdata.isFindingPwd ? "/changePwd" : "/";
			res.redirect(redirect);
		});
	})(req, res, next);
};

exports.signup = (req, res, next) => {
	console.log("signup");
	passport.authenticate("local-sign-up", async (err, user, info) => {
		if (err) {
			console.warn("==err", err);
			return res.status(409).json(err);
		}

		if (!user) {
			console.log("==info", info);
			return res.status(409).json(info.message);
		}

		console.log("verifyEmail", user);
		verifyEmail(user);

		res.json({ verify: user.email });
	})(req, res, next);
};

exports.kakaoLogin = (req, res, next) => {
	passport.authenticate("kakao", (err, user) => {
		console.log("kakaoLogin", err, user);
		req.logIn(user, async () => {
			res.redirect("/");
		});
	})(req, res, next);
};

exports.facebookLogin = (req, res, next) => {
	passport.authenticate("facebook", (err, user) => {
		console.log("facebookLogin", err, user);
		req.logIn(user, async () => {
			res.redirect("/");
		});
	})(req, res, next);
};

exports.googleLogin = (req, res, next) => {
	passport.authenticate("google", (err, user) => {
		console.log("googleLogin", err, user);
		req.logIn(user, async () => {
			res.redirect("/");
		});
	})(req, res, next);
};

exports.signin = async (req, res, next) => {
	passport.authenticate("local-sign-in", async (err, user, info) => {
		if (err) {
			console.warn("==err", err);
			return res.status(409).json(err);
		}

		if (!user) {
			console.log("==info", info);
			return res.status(409).json(info.message);
		}

		console.log("user", user);

		if (user.confirmed === true) {
			req.logIn(user, async () => {
				const token = await signJWT(user);
				res.json({ token });
			});
		} else {
			console.log("verifyEmail", user);
			await verifyEmail(user);
			res.json({ verify: user.email });
		}
	})(req, res, next);
};

exports.logout = (req, res, next) => {
	console.log("logout");
	req.logout();
	res.json();
};

exports.getUser = async (req, res) => {
	const { user = {} } = req;
	console.log("getUser", user);

	const result = await User.findById(user._id).populate({ path: "address" });
	res.json(result);
};

exports.updateUser = async (req, res, next) => {
	const { body = {}, user = {} } = req;
	const { currentPwd, newPwd } = body;
	console.log("updateUser", body, currentPwd, newPwd);

	// 비밀 번호 변경 시에는 체크 후 변경한다
	if (newPwd) {
		console.log("비밀번호 변경");
		next();
		return;
	}

	// 다른 유저 정보는 바로 업데이트 한다
	const result = await User.findByIdAndUpdate(user._id, body, { new: true });
	res.json(result);
};

exports.deleteUser = async (req, res) => {
	const { user = {} } = req;
	req.logout();
	await User.deleteOne({ _id: user._id });
	res.json("deleted");
};

exports.updatePwd = async (req, res) => {
	const { body = {}, user = {} } = req;
	const { currentPwd, newPwd } = body;

	const userData = await User.findOne({ email: user.email }).select("password");
	console.log("updatePwd", body, userData, user);

	if (!userData.password) {
		return res.json({ err: "소셜로그인 유저는 비밀 번호를 사용할 수 없습니다." });
	}

	// 비밀번호 찾기 모드가 아닐 때에만 현재 비밀 번호 체크를 체크한다
	if (user.isFindingPwd === false) {
		const isPwdCorrect = bcrypt.compareSync(currentPwd, userData.password);
		console.log({ isPwdCorrect });
		if (!isPwdCorrect) {
			return res.json({ err: "현재 비밀번호가 일치 하지 않습니다." });
		}
	}

	bcrypt.hash(newPwd, 10, async (err, password) => {
		if (err) {
			console.warn(err);
			  res.json({ err: "비밀번호 변경에 실패 하였습니다." });
		}

		const result = await User.findByIdAndUpdate(user._id, { password }, { new: true });

		// 비밀 찾기 모드에서는 비밀 번호 수정 후 로그아웃 시킨다
		if (user.isFindingPwd) {
			req.logout();
		}

		res.json(result);
	});
};

exports.postAddress = async (req, res) => {
	const { user = {}, body } = req;
	const { _id } = user;
	console.log("postAddress", user, "body", body);

	try {
		const userData = await User.findById(user._id).populate({ path: "address" });
		const adrsId = userData.address && userData.address._id;
		console.log("postadrs2", userData, adrsId);

		if (adrsId) {
			await Address.findByIdAndUpdate(adrsId, body);
		} else {
			const adrs = await new Address(body).save();
			userData.address = adrs;
			await userData.save();
		}
		res.json(userData);
	} catch (error) {
		console.error("postAddress error", error);
	}
};

const searchUser = async (req, _id) => {
	const { user = {} } = req;
	const { googleId, email } = user;
	console.log("searchUser", user);
	const condition = _id ? { _id: _id } : email ? { email } : { googleId };
	const userData = (await User.findOne(condition)) || {};
	return userData;
};

module.exports.searchUser = searchUser;
