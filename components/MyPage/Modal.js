
import React from "react";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";

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

const ModalContainer = ({ title, isModalOpen, closeModal, children }) => {
	const modalclasses = useStyles();

	return (
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
			}} className={modalclasses.paper}>
				<h3 id="simple-modal-title" style={{ textAlign: "right" }}>
					{title}
					{/* <AiFillCloseSquare style={{ cursor: "pointer" }} onClick={closeModal} /> */}
				</h3>
				<p id="simple-modal-description">
					{children}
				</p>
				<Grid item xs={12} style={{ textAlign: "right" }}>
					<Button variant="contained" onClick={closeModal} style={{ marginRight: "0rem" }} >
                      취소
					</Button>
				</Grid>
			</div>
		</Modal>
	);
};

export default ModalContainer;
