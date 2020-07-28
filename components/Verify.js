import React from "react";
import Router, { useRouter } from "next/router";
import { postSendVerifyEmail } from "../lib/api";

const Verify = () => {
	const router = useRouter();
	const userInfo = router.query;
	console.log("Verify", userInfo);

	return (
		<>
			<div>email이 전송되었습니다. 링크를 확인해 주세요</div>
			<div>
				<button onClick={() => {
					Router.push("/signin");
				}}>login</button>
				<button onClick={async () => {
					await postSendVerifyEmail(userInfo);
					alert("mail이 전송 되었습니다.");
				}}>send email again</button>
			</div>
		</>

	);
};
export default Verify;
