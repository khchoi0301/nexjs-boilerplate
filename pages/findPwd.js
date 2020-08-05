import React from "react";
import Layout from "../components/Layout/Layout";
import FindPwd from "../components/FindPwd";

const findPwdPage = () => {
	return (
		<Layout title="비밀번호 찾기" >
			<FindPwd />
		</Layout>
	);
};
export default findPwdPage;
