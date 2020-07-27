const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const KAKAO_JS_KEY = process.env.KAKAO_JS_KEY;

module.exports = () => {
	passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
		console.log("passport serial");
		done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
	});

	passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
		console.log("passport deserial");
		done(null, user); // 여기의 user가 req.user가 됨
	});

	passport.use("local-sign-in", new LocalStrategy({ // local 전략
		usernameField: "email",
		passwordField: "password",
		session: true, // 세션에 저장 여부
		passReqToCallback: true
	}, (req, email, unhashedPw, done) => {
		User.findOne({ email: email }).select("password")
			.then(async (user) => {
				// user doesn't exist, 미가입 이메일
				if (!user) {
					return done(null, false, { message: "email 및 password를 다시 확인해 주세요" });
				}

				const result = bcrypt.compareSync(unhashedPw, user.password);

				// wrong password
				if (!result) {
					return done(null, false, { message: "email 및 password를 다시 확인해 주세요" });
				}

				// sign in
				return done(null, user);
			});
	}));

	passport.use("local-sign-up", new LocalStrategy({ // local 전략
		usernameField: "email",
		passwordField: "password",
		session: true, // 세션에 저장 여부
		passReqToCallback: true
	}, (req, email, unhashedPw, done) => {
		console.log("local-sign-up");
		const { name } = req.body;

		bcrypt.hash(unhashedPw, 10, (err, password) => {
			if (err) {
				console.warn("hash", err);
			}

			User.create({
				email: email,
				name: name,
				password: password
			})
				.then(user => {
					return done(null, user);
				})
				.catch(err => {
					console.warn("signup err", err);
					if (err.code === 11000) {
						return done(null, false, { message: "이미 사용중인 이메일입니다" });
					}

					if (err.name === "SequelizeUniqueConstraintError") {
						return done(null, false, { message: "이미 사용중인 이메일입니다" });
					}

					if (err.message === "String or binary data would be truncated.") {
						return done(null, false, { message: "입력 데이터의 값이 너무 깁니다." });
					}

					return done(null, false, { message: err });
				});
		});
	}));

	passport.use("local-link", new LocalStrategy({ // local 전략
		usernameField: "verified",
		passwordField: "link",
		session: true, // 세션에 저장 여부
		passReqToCallback: true
	}, (req, verified, unhashedPw, done) => {
		console.log("local-link", verified);
		User.findOne({ verify_key: verified })
			.then(async (user) => {
				if (!user) {
					return done(null, false, { message: "존재하지 않는 link입니다" });
				}

				return done(null, user);
			});
	}));

	passport.use("kakao", new KakaoStrategy({
		clientID: KAKAO_JS_KEY,
		// clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
		callbackURL: "api/oauth"
	}, async (accessToken, refreshToken, profile, done) => {
		const { provider, id, username, _json } = profile;
		const email = _json && _json.kakao_account && _json.kakao_account.email;
		console.log("kakao login", provider, id, username, email, _json.kakao_account);

		try {
			const user = await User.findOne({ provider, id }).select("password");
			// 없으면 db 추가
			if (!user) {
				await User.create({
					name: username,
					provider,
					id,
					email
				});
			}
			return done(null, profile, !!user);
		} catch (error) {
			console.warn("signup err", error);
			return done(null, false, { message: error });
		}
	}));
};
