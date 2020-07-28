import React from "react";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		"& > *": {
			margin: theme.spacing(1)
		}
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7)
	}
}));

const BadgeAvatars = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Badge
				overlap="circle"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				badgeContent={
					<Button variant="contained">수정</Button>
				}>
				<Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" className={classes.large} />
			</Badge>
		</div>
	);
};

export default BadgeAvatars;
