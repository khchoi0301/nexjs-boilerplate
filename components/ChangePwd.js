import React, { Component } from "react";
import { updateUser } from "../lib/api";
import { openToast } from "../lib/utils";

const mainGray = "#3a3a3a";
const mainYellow = "#ffc30f";

class ChangePwd extends Component {
  state = {
  	pwd: "",
  	error: "",
  	isLoading: false
  };

  handleChange = event => {
  	this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async event => {
  	const { pwd } = this.state;
  	event.preventDefault();

  	if (pwd) {
  		this.setState({ error: "", isLoading: true });

  		await updateUser({ newPwd: pwd });
		openToast({ type: "success", msg: "수정되었습니다" });
  		window.location.href = "/"; // 새로고침 필요(Router는 안됨)
  	} else {
  		this.showError({ message: "값을 입력해 주세요" });
  	}
  }

  showError = err => {
  	let error = err.response && err.response.data || err.message;
  	const errStatus = err && err.response && err.response.status;
  	console.log(1, err.response, 2, err.message);
  	if (errStatus === 401) {
  		error = "pwd 및 password를 확인 하세요";
  	}

  	this.setState({ error, isLoading: false });
  }

  render () {
  	const { pwd, isLoading, error } = this.state;

  	return (
  		<div>
  			<div className="title">
  				새로운 <b>비밀 번호</b>를<br /> 입력해 주세요
  			</div>
  			<form
  				className="form-container"
  				onSubmit={this.handleSubmit}
  				action=""
  				style={{ margin: "auto" }}
  			>
  				<label className="form-label">
            		비밀번호
  					<input
  						className="signup form-input"
  						type="password"
  						name="pwd"
  						placeholder="비밀번호를 입력해 주세요"
  						onChange={this.handleChange}
  						value={pwd}
  					/>
  				</label>
  				<div className="signup-error">{error || ""}</div>
  				<button
  					className="delivery form-submit"
  					type="submit"
  					disabled={isLoading}
  				>
  					{isLoading ? "로딩중" : "다음"}
  				</button>
  			</form>
  			<style jsx>{`
			.title {
				font-size: 35px;
			}
			.signup-error {
				margin-top: 1px;
				height: 10px;
				color: red;
				font-weight: bold;
			}
			a {
				color: gray;
			}
			a:hover {
				text-decoration: none;
			}
			.form-container {
				color: ${mainGray};
				width: 400px;
			}
			.form-label-wrapper {
				display: flex;
				justify-content: space-between;
			}
			.form-label {
				display: block;
				justify-content: space-between;
				margin-top: 30px;
				font-size: 14px;
			}
			.form-label.half {
				width: 45%;
				display: inline-block;
			}
			.form-input {
				display: block;
				width: 100%;
				height: 44px;
				border: 0;
				border-bottom: 1px solid ${mainGray};
				font-size: 16px;
				padding-left: 10px;
				margin-top: 10px;
          	}
			.form-input:focus {
				outline: none;
			}
			.form-confirm-msg {
				text-align: center;
				color: ${mainYellow};
				margin-top: 30px;
				margin-bottom: 10px;
				font-size: 16px;
			}
			.form-submit {
				width: 100%;
				height: 60px;
				font-size: 20px;
				font-weight: 400;
				background-color: ${mainYellow};
				color: white;
				border-radius: 4px;
				margin-top: 30px;
				border: 1px;
			}
			.check-box {
				margin-top: 1rem;
				margin-right: 8px;
			}
			.row {
				margin-top: 1.3rem;
			}
			`}</style>
  		</div>
  	);
  }
}

export default ChangePwd;
