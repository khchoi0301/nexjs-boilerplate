import React from "react";
import Head from "next/head";
import { Container, Row } from "react-bootstrap";
import NavbarContainer from "./NavbarContainer";

const Layout = ({ children, title, description }) => {
	return (
		<Container fluid style={{ height: "100vh" }}>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
			</Head>
			<Row style={{ height: "10%" }}>
				<NavbarContainer />
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
