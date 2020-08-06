import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { AiFillCloseSquare } from "react-icons/ai";

import { postAddress } from "../../lib/api";
import { openToast } from "../../lib/utils";
import Address from "./Address";

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

const AdrsInput = ({ title, initVal }) => {
	const classes = useStyles();
	const [isModalOpen, setModalOpen] = useState(false);
	const [isModifying, setIsModofying] = useState(false);
	const [adrsInfo, setAdrsInfo] = useState({ });
	const { adrs1, adrs2, postcode } = adrsInfo;

	useEffect(() => {
		setAdrsInfo(initVal);
	}, [initVal]);

	const openModal = () => setModalOpen(true);

	const closeModal = () => setModalOpen(false);

	const getAdrs = (adrs1, postcode) => {
		setAdrsInfo({
			...adrsInfo,
			adrs1,
			postcode
    	});
		setModalOpen(false);
	};

	const handleClick = async () => {
		console.log(adrsInfo);
		setIsModofying(!isModifying);
		if (isModifying) {
			await postAddress(adrsInfo);
			openToast({ type: "success" });
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		console.log(name, value);
		setAdrsInfo({
			...adrsInfo,
			[name]: value
    	});
	};

	return (
		<>
			<Grid item xs={8} style={{ display: "flex", justifyContent: "space-between" }}>
				{isModifying
					? <Grid container spacing={2} justify="center" >
						<Grid item xs={12}>
							<TextField style={{ width: "90%" }} id="standard-basic" variant="outlined" name="adrs1" onChange={handleChange} value={adrs1} onClick={openModal} />
						</Grid>
						<Grid item xs={12}>
							<TextField style={{ width: "90%" }} id="standard-basic" variant="outlined" name="adrs2" onChange={handleChange} value={adrs2} />
						</Grid>
					</Grid>
					: <Grid container spacing={2} justify="center" >
						<Grid item xs={12}>
							<div>{adrs1}</div>
						</Grid>
						<Grid item xs={12}>
							<div>{adrs2}</div>

						</Grid>
					</Grid>
				}

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
							<Address onComplete={getAdrs} />
						</p>
					</div>
				</Modal>

				<Button variant="contained" onClick={handleClick } >
					{isModifying ? "완료" : "수정" }
				</Button>
			</Grid>
		</>
	);
};

export default AdrsInput;
