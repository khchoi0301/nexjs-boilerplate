import React, { Component } from "react";
import { signUpUser } from "../lib/api";
import Router from "next/router";
import Link from "next/link";

const mainGray = "#3a3a3a";
const mainYellow = "#ffc30f";

class SignUpForm extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    error: "",
    isLoading: false,
  };

  handleChange = event => {
  	this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = event => {
  	const { name, email, password } = this.state;
  	event.preventDefault();
  	if (email && password) {
  		this.setState({ error: "", isLoading: true });

  		signUpUser(name, email, password, this.props.title)
  			.then((cmd) => {
  				if (cmd === "sign up") {
  					Router.push("/");
  				} else {
  					Router.push("/");
  				}
  				console.log("signUpUser router pushed");
  			})
  			.catch(this.showError);
  	} else {
  		this.showError({ message: "값을 입력해 주세요" });
  	}
  }

  showError = err => {
  	let error = err.response && err.response.data || err.message;
  	const errStatus = err && err.response && err.response.status;
  	console.log(1, err.response, 2, err.message);
  	if (errStatus === 401) {
  		error = "email 및 password를 확인 하세요";
  	}

  	this.setState({ error, isLoading: false });
  }

  render() {
    const { name, email, password, isLoading, error } = this.state;

    return (
      <div>
        <div className="title">
          <b>회원 정보</b>를<br /> 입력해 주세요
        </div>
        <form
          className="form-container"
          onSubmit={this.handleSubmit}
          action=""
          style={{ margin: "auto" }}
        >
          {this.props.title === "sign up" ? (
            <label className="form-label">
              이름
              <input
                className="signup form-input"
                name="name"
                placeholder="이름을 입력해 주세요"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={this.handleChange}
                value={name}
              />
            </label>
          ) : null}
          <label className="form-label">
            이메일
            <input
              className="signup form-input"
              type="email"
              name="email"
              placeholder="email을 입력해 주세요"
              onChange={this.handleChange}
              value={email}
            />
          </label>
          <label className="form-label">
            비밀번호
            <input
              className="signup form-input"
              type="password"
              name="password"
              placeholder="비밀 번호를 입력해 주세요"
              onChange={this.handleChange}
              value={password}
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
          {this.props.title === "sign in" && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link href="/signup">
                <a style={{ margin: "1.5em" }}>비밀번호찾기</a>
              </Link>
              <Link href="/signup">
                <a style={{ margin: "1.5em" }}>회원가입</a>
              </Link>
            </div>
          )}
          <div className="or">또는</div>
          <div className="row">
            <div className="col-md-offset-1 col-md-5">
              <a href="/api/auth/kakao">
                <img width="400px" src="/img/kakao_login_large_wide.png" />
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-1 col-md-5">
              <a href="/api/auth/facebook">
                <img width="400px" src="/img/facebook_login.png" />
              </a>
            </div>
          </div>
          <div className="col-md-6">
            <div ui-view></div>
          </div>
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
          .or {
            text-align: center;
            margin-top: 2rem;
            margin-bottom: 2rem;
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
          .row {
            margin-top: 1.3rem;
          }
        `}</style>
      </div>
    );
  }
}

export default SignUpForm;
