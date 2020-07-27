import axios from "axios";
import jwtDecode from "jwt-decode";
import { getUserScript } from "./auth";

const server = "";

export const signUpUser = async (name, email, password, cmd) => {
	const path = cmd === "sign up" ? "signup" : "signin";
	const { data = {} } = await axios.post(`${server}/api/${path}`, { name, email, password });
	if (data && data.token) {
		const decoded = jwtDecode(data.token);
		localStorage.setItem("token", data.token);
		// localStorage.setItem("name", decoded.name);
		getUserScript({ username: decoded.name });
	} else {
		window.location.href = "/verify";
	}

	return cmd;
};

export const getLogout = async () => {
	const path = "logout";
	await axios.get(`${server}/api/${path}`);
	// localStorage.removeItem("name");
	window.location.href = "/";
};
