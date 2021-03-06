import Router from "next/router";

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const getUserScript = user => {
	console.log("===getUserScript");
	if (typeof window !== "undefined") {
		window[WINDOW_USER_SCRIPT_VARIABLE] = user;
	}
	return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

export const getSessionFromServer = req => {
	console.log("===getSessionFromServer");
	if (req.user) {
		return { user: req.user };
	}
	return {};
};

export const getSessionFromClient = () => {
	if (typeof window !== "undefined") {
		const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
		console.log("getSessionFromClient", user);
		return { user };
	}
	return { user: {} };
};

const redirectUser = (res, path) => {
	if (res) {
		res.redirect(302, path);
		res.finished = true;
		return {};
	}
	Router.replace(path);
	return {};
};

export const authInitialProps = isProtectedRoute => ({
	req,
	res
}) => {
	const auth = req ? getSessionFromServer(req) : getSessionFromClient();
	const currentPath = req ? req.url : window.location.pathname;
	const user = auth.user || {};
	const isAnonymous = (Object.keys(user).length === 0);
	console.log("authInitialProps", !!req, auth, currentPath, user, isProtectedRoute, isAnonymous);
	if (isProtectedRoute && isAnonymous) { // && currentPath !== "/signin"
		return redirectUser(res, "/signin");
	}
	return { auth };
};
