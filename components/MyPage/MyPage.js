import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from "react-toastify";

import { getLogout, getUser } from "../../lib/api";
import { getSessionFromClient } from "../../lib/auth";
import Avatar from "./Avatar";
import CustomInput from "./CustomInput";
import AddressInput from "./AddressInput";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary
	}
}));

const Mypage = () => {
	const [user, setUser] = useState("");
	const classes = useStyles();

	const openToast = () => {
		toast.success("🦄 변경 사항이 적용되었습니다!", {
			position: "top-center",
			autoClose: 1500,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined
		});
	};

	useEffect(() => {
		(async () => {
			const user = await getUser(); // getSessionFromClient();
			if (user) {
				setUser(user);
			}
		})();
	}, []);

	return (
		<div>
			<Container maxWidth="sm" >
				<Grid container spacing={2} justify="center" style={{ paddingBottom: "2rem", paddingTop: "2rem", borderBottom: "1px solid gray" }}>
					<Grid item xs={12}>
						<b>프로필 수정</b>
					</Grid>
					<Grid item xs={4}>
						<Avatar />
					</Grid>
					<CustomInput title={"name"} initVal={user.name} toast={openToast}/>
					<Grid item xs={4}>
					</Grid>
				</Grid>
				<Grid container spacing={2} justify="center" style={{ paddingBottom: "2rem", paddingTop: "2rem", borderBottom: "1px solid gray" }}>
					<Grid item xs={12}>
						<b>회원정보 수정</b>
					</Grid>
					<Grid item xs={4}>
						이메일
					</Grid>
					<Grid item xs={8}>
						<div> {user.email}</div>
					</Grid>
					<Grid item xs={4}>
						<div>sns연동</div>
					</Grid>
					<Grid item xs={8}>
						<Grid item xs={4}>
							카카오  {user.kakaoId ? "T" : "F"}
						</Grid>
						<Grid item xs={4}>
							페이스북  {user.facebookId ? "T" : "F"}
						</Grid>
						<Grid item xs={4}>
							구글  {user.googleId ? "T" : "F"}
						</Grid>
					</Grid>
					<Grid item xs={4}>
						비밀번호
					</Grid>
					<Grid item xs={8} style={{ display: "flex", justifyContent: "space-between" }}>
						<div>*******</div>
						<Button variant="contained">수정</Button>
					</Grid>
					<Grid item xs={4}>
						휴대폰번호
					</Grid>
					<CustomInput title={"mobile"} initVal={user.mobile} toast={openToast}/>
					<Grid item xs={4}>
						주소
					</Grid>
					<AddressInput title={"adrs"} initVal={user.address || {}} toast={openToast}/>
				</Grid>
				<Grid container spacing={2} justify="center" style={{ paddingBottom: "2rem", paddingTop: "2rem", borderBottom: "1px solid gray" }}>
					<Grid item xs={12}>
						<b>광고성 정보 수신</b>
					</Grid>
					<Grid item xs={12}>
						<label><input type="checkbox"></input> 문자 </label>
						<label><input type="checkbox"></input> 이메일 </label>
					</Grid>
					<Grid item xs={12}>
						<div>서비스의 중요 안내사항 및 주문/배송에 대한 정보는 위 수신 여부와 관계없이 발송 됩니다.</div>
					</Grid>
				</Grid>
				<Grid container spacing={2} justify="center" style={{ paddingBottom: "2rem", paddingTop: "2rem" }}>
					<Grid item xs={12}>
						<div>회원 탈퇴</div>
					</Grid>
					<Grid item xs={12}>
						<h1 className="sign-out" onClick={getLogout}>로그아웃</h1>
					</Grid>
				</Grid>
				<ToastContainer />
			</Container>
			<style gsx>{`
                .sign-out {
                    cursor: pointer;
                }
            `}</style>
		</div>
	);
};

export default Mypage;
