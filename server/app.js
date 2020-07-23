const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const next = require("next");
const helmet = require("helmet");
const compression = require("compression");
const expressValidator = require("express-validator");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

const route = require("./routes/routes");
const passportOptions = require("./passport/passport");

require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 8080;
const ROOT_URL = dev ? `http://localhost:${PORT}` : process.env.PRODUCTION_URL;
const MongoUrl = process.env.MONGOURL;

const corsOrigin = ["http://3.34.5.197:5000", "http://3.34.5.197", "http://ramyunflext.s3-website.ap-northeast-2.amazonaws.com"];

var corsOptions = {
	origin: corsOrigin
};

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
	const server = express();

	if (!dev) {
		/* Helmet helps secure our app by setting various HTTP headers */
		server.use(helmet());
		/* Compression gives us gzip compression */
		server.use(compression());
	}

	server.use(cors(corsOptions));

	/* Body Parser built-in to Express as of version 4.16 */
	server.use(express.json());

	/* Express Validator will validate form data sent to the backend */
	server.use(expressValidator());

	/* give all Next.js's requests to Next.js server */
	server.get("/_next/*", (req, res) => {
		handle(req, res);
	});

	server.get("/static/*", (req, res) => {
		handle(req, res);
	});

	// const MongoStore = mongoSessionStore(session);
	const sessionConfig = {
		name: "next-connect.sid",
		// secret used for using signed cookies w/ the session
		secret: process.env.SESSION_SECRET,
		//   store: new MongoStore({
		//     mongooseConnection: mongoose.connection,
		//     ttl: 14 * 24 * 60 * 60 // save session for 14 days
		//   }),
		// forces the session to be saved back to the store
		resave: false,
		// don't save unmodified sessions
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 1 // expires in 1 days
		}
	};

	if (!dev) {
		// sessionConfig.cookie.secure = true; // serve secure cookies in production environment
		// TODO : 쿠키 시큐어 확인하기
		server.set("trust proxy", 1); // trust first proxy
	}

	// /* Apply our session configuration to express-session */
	server.use(session(sessionConfig));

	// /* Add passport middleware to set passport up */
	server.use(passport.initialize());
	server.use(passport.session());

	passportOptions();

	server.use((req, res, next) => {
		/* custom middleware to put our user data (from passport) on the req.user so we can access it as such anywhere in our app */
		res.locals.user = req.user || null;
		next();
	});

	/* morgan for request logging from client
	- we use skip to ignore static files from _next folder */
	server.use(
		logger("dev", {
			skip: (req) => req.url.includes("_next")
		})
	);

	/* Error handling from async / await functions */
	server.use((err, req, res, next) => {
		const { status = 500, message } = err;
		res.status(status).json(message);
	});

	// /* create custom routes with route params */
	// server.get("/profile/:userId", (req, res) => {
	//   const routeParams = Object.assign({}, req.params, req.query);
	//   return app.render(req, res, "/profile", routeParams);
	// });

	await mongoose.connect(MongoUrl);
	await mongoose.connection.db.dropDatabase();
	await mongoose.set("debug", true);

	/* apply routes from the "routes" folder */
	server.use("/api", route);

	/* default route
       - allows Next to handle all other routes
       - includes the numerous `/_next/...` routes which must    be exposedfor the next app to work correctly
       - includes 404'ing on unknown routes */
	server.get("*", (req, res) => {
		handle(req, res);
	});

	// set port, listen for requests
	server.listen(PORT, () => {
		console.log(`===Server is running on port ${ROOT_URL}.`);
	});
});
