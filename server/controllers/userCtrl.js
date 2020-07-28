const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");

const User = require("../models/user");

require("dotenv").config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const SMTP_SERVICE = process.env.SMTP_SERVICE;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_ADDRESS = process.env.SMTP_FROM_ADDRESS;

exports.validateSignup = (req, res, next) => {
  // express-validator가 middleware로 적용됨
  req.sanitizeBody("name");
  req.sanitizeBody("email");
  req.sanitizeBody("password");
  // sanitizeBody example Hello world :>)  to  Hello world :&gt;)

  // Name is non-null and is 2 to 15 characters
  req.checkBody("name", "Enter a name").notEmpty();
  req
    .checkBody("name", "Name must be between 2 and 15 character")
    .isLength({ min: 2, max: 15 });

  // Email is non-null, valid, and normalized
  req.checkBody("email", "Enter a valid email").isEmail().normalizeEmail();

  // Password must be non-null between 4 and 15 characters
  req.checkBody("password", "Enter a password").notEmpty();
  req
    .checkBody("password", "password must be between 4 and 15 character")
    .isLength({ min: 4, max: 15 });

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

const sendEmail = async (email, url) => {
  console.log("sendEmail url", url);

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_USER, // generated ethereal user
      pass: SMTP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: SMTP_FROM_ADDRESS, // sender address
    to: email, // list of receivers
    subject: "Verify your email ✔", // Subject line
    text: "Verify Your Account", // plain text body
    html: `<h1>Verify Your Account</h1><a href\=\"${url}\">Click here to log in with this magic link<a>`, // html body
  });

  console.log("Message sent: %s", info);
};

const verifyEmail = async (user) => {
  const { _id, email } = user;
  console.log("user", _id, email);

  // verify key를 생성하고 user db에  저장
  const verify_key = crypto.randomBytes(256).toString("hex").substr(50, 25);
  const url = `http://localhost:3000/api/loginwithemail?verified=${verify_key}&link=${verify_key}`;
  const userdata = await User.findByIdAndUpdate(_id, { verify_key });
  setTimeout(() => {
    console.log("===settimeout", _id, verify_key, User.findByIdAndUpdate);
    User.findByIdAndUpdate( _id, { verify_key : "Invalid" }, (err, res)=>{
      console.log("res", err, res)
    });
  }, 1000 * 60 * 5 ); // 5분간만 유효함 
  console.log("userdata", userdata);

  // 메일로 해당 키를 포함한 링크를 보낸다.
  await sendEmail(email, url);
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
    const userdata = await User.findByIdAndUpdate(user._id, { confirmed : true });

    // 로그인 시키기
    req.logIn(user, async () => {
      if (err) {
        return res.status(409).json(err);
      }

      res.redirect("/");
    });
  })(req, res, next);
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

    console.log("verifyEmail", user);
    verifyEmail(user);

    res.json({redirect:"verify"});

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
  passport.authenticate("local-sign-in",async  (err, user, info) => {
    if (err) {
      console.warn("==err", err);
      return res.status(409).json(err);
    }

    if (!user) {
      console.log("==info", info);
      return res.status(409).json(info.message);
    }

    console.log("user", user)

    if(user.confirmed === true){
      const token = await signJWT(user);
      res.json({ token });
    } else {
      console.log("verifyEmail", user);
      verifyEmail(user);
      res.json({redirect:"verify"});
    }

  })(req, res, next);

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
  const userData = (await User.findOne(condition)) || {};
  return userData;
};

module.exports.searchUser = searchUser;
