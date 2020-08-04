import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { ToastContainer, toast } from "react-toastify";

import { getLogout, getUser, deleteUser } from "../../lib/api";
import Avatar from "./Avatar";
import CustomInput from "./CustomInput";
import AddressInput from "./AddressInput";
import PwdInput from "./PwdInput";
import Checkbox from "./Checkbox";

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

	const openToast = (msg) => {
		const err = msg ? msg.err : null;
		if (err) {
			toast.error(`🦄 ${err}`, {
				position: "top-center",
				autoClose: 1500,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined
			});
			return;
		}

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
						<Avatar user={user} toast={openToast}/>
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
					<PwdInput toast={openToast} user={user} />
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
					<Checkbox user={user} toast={openToast}/>
					<Grid item xs={12}>
						<div>서비스의 중요 안내사항 및 주문/배송에 대한 정보는 위 수신 여부와 관계없이 발송 됩니다.</div>
					</Grid>
				</Grid>
				<Grid container spacing={2} justify="center" style={{ paddingBottom: "2rem", paddingTop: "2rem" }}>
					<Grid item xs={12}>
						<div className="clickable" onClick={deleteUser}>회원 탈퇴</div>
					</Grid>
					<Grid item xs={12}>
						<h1 className="clickable" onClick={getLogout}>로그아웃</h1>
					</Grid>
				</Grid>
				<ToastContainer />
			</Container>
			<style gsx>{`
                .clickable {
                    cursor: pointer;
                }
            `}</style>
		</div>
	);
};

export default Mypage;