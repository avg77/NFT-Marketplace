import React from "react";
import Style from "../styles/login.module.css";
import LoginAndSignUp from "../LoginAndSignUp/LoginAndSignUp";

const signUp = () => {
  return (
    <div className={Style.login}>
      <div className={Style.login_box}>
        <h1>Sign Up</h1>
        <LoginAndSignUp />
        <p className={Style.login_box_para}>
        </p>
      </div>
    </div>
  );
};

export default signUp;
