import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { updateUser } from "../../lib/api";

const Checkbox = ({ user, toast }) => {
	const { agreement = {} } = user;
	const [value, setValue] = useState({});
	const { sms, email } = value;

	useEffect(() => {
		setValue(agreement);
	}, [agreement]);

	const handleClick = async (event) => {
		const { name, checked } = event.target;
		console.log("event", name, checked);
		agreement[name] = checked;
		await updateUser({ agreement });
		setValue({
			...value,
			[name]: checked
		});
		toast();
	};

	return (
		<Grid item xs={12}>
			<label ><input name={"sms"} type="checkbox" onClick={handleClick} checked={sms}></input> 문자 </label>
			<label ><input name={"email"} type="checkbox" onClick={handleClick} checked={email}></input> 이메일 </label>
		</Grid>
	);
};

export default Checkbox;
