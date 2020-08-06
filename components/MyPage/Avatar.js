import React, { useState, useEffect } from "react";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { updateUser } from "../../lib/api";
import { openToast } from "../../lib/utils";
import Modal from "./Modal";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		"& > *": {
			margin: theme.spacing(1)
		}
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),
		cursor: "pointer",
		"&:hover": {
			border: "5px solid blue"
		}
	}
}));

const modalContents = (setAvatar, closeModal) => {
	const classes = useStyles();

	const handleClick = (item) => {
		setAvatar(item);
		updateUser({ avatar: item });
		closeModal();
		openToast({ type: "success" });
	};

	return 	(
		<Grid container spacing={2} justify="center" >
			{
				[1, 2, 3].map((item, idx) => {
					const url = `/img/avatar_sample_${item}.jpg`;
					return (
						<Grid item xs={3} key={item}>
							<Avatar alt="Travis Howard" src={url} className={classes.large} onClick={handleClick.bind(this, item)} />
						</Grid>
					);
				})
			}
		</Grid>
	);
};

const BadgeAvatars = ({ user }) => {
	const classes = useStyles();
	const [isModalOpen, setModalOpen] = useState(false);
	const [avatar, setAvatar] = useState();
	const url = `/img/avatar_sample_${avatar}.jpg`;

	useEffect(() => {
		setAvatar(user.avatar);
	}, [user]);

	const openModal = () => setModalOpen(true);

	const closeModal = () => setModalOpen(false);

	return (
		<div className={classes.root}>
			<Badge
				overlap="circle"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				badgeContent={
					<Button variant="contained" size="small" onClick={openModal} >수정</Button>
				}>
				<Avatar alt="Travis Howard" src={url} className={classes.large} />
			</Badge>
			<Modal isModalOpen={isModalOpen} closeModal={closeModal} title={"아이콘 선택"}>
				{modalContents(setAvatar, closeModal)}
			</Modal>
		</div>
	);
};

export default BadgeAvatars;
