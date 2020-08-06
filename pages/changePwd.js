import React from "react";
import Layout from "../components/Layout/Layout";
import ChangePwd from "../components/ChangePwd";

const findPwdPage = () => {
	return (
		<Layout title="비밀번호 찾기" >
			<ChangePwd />
		</Layout>
	);
};
export default findPwdPage;
