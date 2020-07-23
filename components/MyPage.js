import React, { useEffect, useState } from "react";
import { getLogout } from "../lib/api";
import { getSessionFromClient } from "../lib/auth";

const Mypage = () => {
	const [user, setUser] = useState("");

	useEffect(() => {
		const { user } = getSessionFromClient();
		if (user && user.user) {
			setUser(user.user);
		} else {
			if (typeof window !== "undefined") {
				console.log("Mypage, not logined");
				// const name = localStorage.getItem("name");
				// setUser(name);
			}
		}
	});

	return (
		<h1>
            My page
			<div>{user}</div>
			<div className="sign-out" onClick={getLogout}>로그아웃</div>
			<style gsx>{`
                .sign-out {
                    cursor: pointer;
                }
            `}</style>
		</h1>
	);
};

export default Mypage;
