import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { updateUser } from "../../lib/api";

const mobileNumHandler = (value) => {
	const lastVal = value[value.length - 1];
	if (lastVal) { // 백스페이스 대응 위해 마지막값 있을때 처리
		// 숫자나 -만 입력 가능, 13자리까지만 입력
		if (isNaN(lastVal) && lastVal !== "-" || value.length > 13) {
			return value.slice(0, 13);
		}

		value = value.split("-").join(""); // -를 찾아서 제거
		value = value.match(new RegExp("^.{1,3}|.{1,4}", "g")).join("-"); // 4자리 마다 -추가
		value += lastVal === "-" ? "-" : "";
	}
	return value;
};

const CustomInput = ({ title, initVal, toast }) => {
	const [isModifying, setIsModofying] = useState(false);
	const [value, setValue] = useState(initVal);

	useEffect(() => {
		setValue(initVal);
	}, [initVal]);

	const handleClick = async () => {
		console.log({ [title]: value });
		setIsModofying(!isModifying);
		if (isModifying) {
			await updateUser({ [title]: value });
			toast();
		}
	};

	const handleChange = (event) => {
		let { name, value } = event.target;

		if (name === "mobile") {
			value = mobileNumHandler(value);
		}

		setValue(value);
	};

	return (
		<>
			<Grid item xs={8} style={{ display: "flex", justifyContent: "space-between" }}>
				{isModifying
					? <TextField id="standard-basic" variant="outlined" name={title} onChange={handleChange} value={value} /> // label={title}
				// <input name={title} onChange={handleChange} value={value}></input>
					: <div>{value}</div> }
				<Button variant="contained" onClick={handleClick } >
					{isModifying ? "완료" : "수정" }
				</Button>
			</Grid>
		</>
	);
};

export default CustomInput;
