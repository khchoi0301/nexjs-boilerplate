import axios from "axios";
import jwtDecode from "jwt-decode";
import { getUserScript } from "./auth";
import Router from "next/router";

const server = "";

export const signUpUser = async (name, email, password, cmd) => {
	const path = cmd === "sign up" ? "signup" : "signin";
	const { data = {} } = await axios.post(`${server}/api/${path}`, { name, email, password });
	const { token, verify } = data;
	console.log("signUpUser", data);
	if (token) {
		const decoded = jwtDecode(token);
		localStorage.setItem("token", token);
		// localStorage.setItem("name", decoded.name);
		getUserScript({ name: decoded.name });
		Router.push("/");
	} else if (verify) {
		Router.push({
			pathname: "/verify",
			query: { email: verify }
		});
	}

	return cmd;
};

export const postSendVerifyEmail = async (userInfo) => { // userInfo = { email : email, redirect : undefine or changePwd }
	console.log("postSendVerifyEmail", userInfo);
	const path = "sendverifyemail";
	const { data } = await axios.post(`${server}/api/${path}`, userInfo);
	console.log(data);
	return data;
};

export const getUser = async () => {
	const path = "user";
	const { data } = await axios.get(`${server}/api/${path}`);
	console.log("getUser", data);
	return data;
};

export const updateUser = async (userInfo) => {
	console.log("updateUser", userInfo);
	const path = "user";
	try {
		const { data } = await axios.post(`${server}/api/${path}`, userInfo);
		console.log(data);
		return data;
	} catch (error) {
		return { err: error && error.response.data };
	}
};

export const deleteUser = async () => {
	console.log("deleteUser");
	const path = "user";
	await axios.delete(`${server}/api/${path}`);
	window.location.href = "/";
};

export const postAddress = async (adrsInfo) => {
	console.log("postAddress", adrsInfo);
	const path = "address";
	const { data } = await axios.post(`${server}/api/${path}`, adrsInfo);
	console.log(data);
	return data;
};

export const getLogout = async () => {
	const path = "logout";
	await axios.get(`${server}/api/${path}`);
	// localStorage.removeItem("name");
	window.location.href = "/"; // 새로고침 필요(Router는 안됨)
};
