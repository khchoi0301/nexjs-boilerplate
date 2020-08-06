import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { AiFillCloseSquare } from "react-icons/ai";

import { updateUser } from "../../lib/api";
import { openToast } from "../../lib/utils";

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 550,
		outline: "none",
		border: "none",
		backgroundColor: theme.palette.background.paper,
		// border: "2px solid #000",
		// boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
}));

const AdrsInput = ({ title, initVal, user }) => {
	const classes = useStyles();
	const [isModalOpen, setModalOpen] = useState(false);
	const [pwdInfo, setPwdInfo] = useState({ });
	const { currentPwd, newPwd } = pwdInfo;
	const { enablePwdChange } = user;

	const openModal = () => setModalOpen(true);

	const closeModal = () => setModalOpen(false);

	const handleClick = async () => {
		console.log("handleClick", currentPwd, newPwd, !currentPwd || !newPwd);

		if (!currentPwd || !newPwd) {
			openToast({ type: "error", msg: "비밀번호를 입력해 주세요" });
			return;
		}

		closeModal();
		setPwdInfo({ });

		const res = await updateUser(pwdInfo);
		console.log(res);
		if (res.err) {
			openToast({ type: "error", msg: res.err });
		} else {
			openToast({ type: "success" });
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		// console.log(name, value);
		setPwdInfo({
			...pwdInfo,
			[name]: value
    	});
	};

	return (
		<>
			<Grid item xs={8} style={{ display: "flex", justifyContent: "space-between" }}>
				<Grid container spacing={2} justify="center" >
					<Grid item xs={12}>
						<div>{!enablePwdChange ? "소셜로그인 유저는 사용할 수 없습니다." : "******"}</div>
					</Grid>
				</Grid>
				<Modal
					open={isModalOpen}
					onClose={closeModal}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
				>
					<div style={{
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)"
					}} className={classes.paper}>
						<h3 id="simple-modal-title" style={{ textAlign: "right" }}>
							<AiFillCloseSquare style={{ cursor: "pointer" }} onClick={closeModal} />
						</h3>
						<p id="simple-modal-description">
							<Grid container spacing={2} justify="center" >
								<Grid item xs={12}>
									현재 비밀번호
									<TextField type="password" style={{ width: "100%" }} id="standard-basic" variant="outlined" name="currentPwd" onChange={handleChange} value={currentPwd} />
								</Grid>
								<Grid item xs={12}>
									변경 비밀번호
									<TextField type="password" style={{ width: "100%" }} id="standard-basic" variant="outlined" name="newPwd" onChange={handleChange} value={newPwd} />
								</Grid>
								<Grid item xs={12} style={{ textAlign: "right" }}>
									<Button variant="contained" onClick={handleClick} style={{ marginRight: "1rem" }} >
										수정
									</Button>
									<Button variant="contained" onClick={closeModal} style={{ marginRight: "0rem" }} >
										취소
									</Button>
								</Grid>
							</Grid>
						</p>
					</div>
				</Modal>

				<Button variant="contained" onClick={openModal} disabled={!enablePwdChange}>
					수정
				</Button>
			</Grid>
		</>
	);
};

export default AdrsInput;
