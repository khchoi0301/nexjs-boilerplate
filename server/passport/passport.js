const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const KAKAO_JS_KEY = process.env.KAKAO_JS_KEY;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
	}, async (req, email, unhashedPw, done) => {
		const user = await User.findOne({ email: email }).select("password email name confirmed");
		console.log("local-sign-in", user);

		if (!user) {
			return done(null, false, { message: "email 및 password를 다시 확인해 주세요" });
		}

		const result = bcrypt.compareSync(unhashedPw, user.password);

		// wrong password
		if (!result) {
			return done(null, false, { message: "email 및 password를 다시 확인해 주세요" });
		}

		// update lastLogin
		user.lastLogin = new Date();
		await user.save();

		// sign in
		return done(null, user);
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
				password: password,
				enablePwdChange: true
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
		callbackURL: "/api/auth/kakao/callback"
	}, async (accessToken, refreshToken, profile, done) => {
		console.log("kakao profile", profile);

		const { id, username, _json } = profile;
		const kakaoId = id;
		const kakaoName = username;
		const email = _json && _json.kakao_account && _json.kakao_account.email;

		try {
			// email 없으면 생성
			// option, new : 생성 후 doc를 반환, upsert : 없으면 생성(insert), 있으면 update
			const user = await User.findOneAndUpdate({ email: email }, {
				email: email, lastLogin: new Date()
		   }, { new: true, upsert: true });

			// kakao id 없으면 업데이트(최초 소셜 로그인 경우 or email에 소셜 추가한 경우)
			if (!user.kakaoId) {
				user.kakaoId = kakaoId;
				user.kakaoName = kakaoName;
				if (!user.name) {
					user.name = kakaoName;
				}
				user.confirmed = true;
				await user.save();
			}

			// 로그인
			return done(null, user);
		} catch (error) {
			console.warn("KakaoStrategy err", error);
			return done(null, false, { message: error });
		}
	}));

	passport.use(new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: "/api/auth/facebook/callback",
		// passReqToCallback: true
		profileFields: ["id", "emails", "name"]
	  }, async (accessToken, refreshToken, profile, done) => {
		console.log("facebook profile", profile);

		const { id, name, emails } = profile;
		const facebookId = id;
		const facebookName = `${name.familyName} ${name.givenName}`;
		const email = emails[0] && emails[0].value;

		try {
			// email 없으면 생성
			// option, new : 생성 후 doc를 반환, upsert : 없으면 생성(insert), 있으면 update
			const user = await User.findOneAndUpdate({ email: email }, {
				email: email, lastLogin: new Date()
		   }, { new: true, upsert: true });

			// facebook id 없으면 업데이트(최초 소셜 로그인 경우 or email에 소셜 추가한 경우)
			if (!user.facebookId) {
				user.facebookId = facebookId;
				user.facebookName = facebookName;
				if (!user.name) {
					user.name = facebookName;
				}
				user.confirmed = true;
				await user.save();
			}

			// 로그인
			return done(null, user);
		} catch (error) {
			console.warn("FacebookStrategy err", error);
			return done(null, false, { message: error });
		}
	  }
	));

	passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: "/api/auth/google/callback"
	}, async (accessToken, refreshToken, profile, done) => {
		console.log("google profile", profile);

		const { id, displayName, emails, photos, _json } = profile;

		const googleId = id;
		const googleName = displayName;
		const email = emails[0] && emails[0].value;
		const google_email_verified = emails[0] && emails[0].verified;
		const googlePhoto = photos[0] && photos[0].value;
		const googleLocale = _json && _json.locale;

		try {
			// email 없으면 생성
			// option, new : 생성 후 doc를 반환, upsert : 없으면 생성(insert), 있으면 update
			const user = await User.findOneAndUpdate({ email: email }, {
				 email: email, lastLogin: new Date()
			}, { new: true, upsert: true });

			// google id 없으면 업데이트(최초 소셜 로그인 경우 or email에 소셜 추가한 경우)
			if (!user.googleId) {
				user.googleId = googleId;
				user.googleName = googleName;
				user.google_email_verified = google_email_verified;
				user.googlePhoto = googlePhoto;
				user.googleLocale = googleLocale;
				if (!user.name) {
					user.name = googleName;
				}
				user.confirmed = true;
				await user.save();
			}

			// 로그인
			return done(null, user);
		} catch (error) {
			console.warn("GoogleStrategy err", error);
			return done(null, false, { message: error });
		}
	}
	));
};
