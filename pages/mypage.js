import React from "react";
import Layout from "../components/Layout/Layout";
import My from "../components/MyPage";
import { authInitialProps } from "../lib/auth";

export const Mypage = () => {
	return (
		<Layout title="my page" >
			<My />
		</Layout>
	);
};

Mypage.getInitialProps = authInitialProps(true);

export default Mypage;
