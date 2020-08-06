import React from "react";
import Router, { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { postSendVerifyEmail } from "../lib/api";
import { openToast } from "../lib/utils";

const Verify = () => {
	const router = useRouter();
	const { email, findPwd } = router.query; // { email: "khchoi0301@gmail.com", findPwd: "true" }
	console.log("Verify", email, findPwd);

	const toHome = () => Router.push("/");

	const toLogin = () => Router.push("/signin");

	const sendEmailAgain = async () => {
		await postSendVerifyEmail({ email });
		openToast({ type: "success", msg: "mail이 전송 되었습니다." });
	};

	return (
		<>
		     <Grid container spacing={3}>
				<Grid item xs={12}>
					<h3 className="title">email이 전송되었습니다.<br /> 링크를 확인해 주세요</h3>
				</Grid>
				<Grid item xs={12}>
					<div className="btns">

						{
							Boolean(findPwd) !== true ? (
								<>
									<Button variant="contained" onClick={toLogin} style={{ marginLeft: "1rem" }}>
										Login
									</Button>
									<Button variant="contained" onClick={sendEmailAgain } >
										Send email again
									</Button>
								</>
							) : (
								<Button variant="contained" onClick={toHome } >
								Home
								</Button>
							)
						}
					</div>
				</Grid>
			</Grid>
			<style jsx>{`
				.title {
					text-align: center;
				}
				.btns {
					width: 100%;
					text-align: center;
				}
				
			`}</style>
		</>

	);
};
export default Verify;
