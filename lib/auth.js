import Router from "next/router";

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const getUserScript = user => {
	if (typeof window !== "undefined") {
		window[WINDOW_USER_SCRIPT_VARIABLE] = user;
	}
	return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};
