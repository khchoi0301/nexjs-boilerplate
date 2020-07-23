import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Container, Row } from "react-bootstrap";
import NavbarContainer from "./NavbarContainer";
import { getSessionFromClient } from "../../lib/auth";

const Layout = ({ children, title, description }) => {
	const [user, setUser] = useState("");

	useEffect(() => {
		const { user } = getSessionFromClient();
		if (user && user.user) {
			setUser(user.user);
		} else {
			if (typeof window !== "undefined") {
				console.log("Layout, not logined");
				// const name = localStorage.getItem("name");
				// setUser(name);
			}
		}
	}, []);

	return (
		<Container fluid style={{ height: "100vh" }}>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
			</Head>
			<Row style={{ height: "10%" }}>
				<NavbarContainer user={user} />
			</Row>
			<Row
				style={{
					justifyContent: "center",
					alignItems: "center",
					height: "90%"
				}}
			>
				{children}
			</Row>
			<style global jsx>{`
				html,
				body {
					margin: 0;
					height: 100%;
				}

				body {
					background-size: cover;
					background-position: center center;
					font-family: "Spoqa Han Sans", "Inter", sans-serif, "BMHanna", Verdana;
				}
              `}</style>
		</Container>
	);
};

export default Layout;
