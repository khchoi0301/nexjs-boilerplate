import React from "react";
import Layout from "../components/Layout/Layout";

const SignUp = () => {
	return (
		<Layout title="sign up" >
			<div>email이 전송되었습니다. 링크를 확인해 주세요</div>
			<div>
				<button onClick={() => {
					window.location.href = "/signin";
				}}>login</button>
				<button onClick={() => {
					window.location.href = "/signin";
				}}>send email again</button>
			</div>
		</Layout>
	);
};
export default SignUp;
