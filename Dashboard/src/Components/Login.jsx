import React, { useState } from "react";
import sessions from "../helpers/userLogin.js";
import { useHistory } from "react-router-dom";

const Login = () => {
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const submitHandler = async () => {
    const isLoggedIn = await sessions.userLogin({ /*email,*/ password });
    isLoggedIn.error ? alert(isLoggedIn.error) : history.push("/home");
  };

  return (
    <div className="loginContainer">
      <form
        className="login-form user-form"
        onSubmit={e => {
          e.preventDefault();
          submitHandler();
        }}
      >
        <h4 className="user-form-heading">Login</h4>
        {/* <div className="email-container">
          <div className="user-form-label">
            <label>Email: </label>
          </div>
          <div className="email">
            <input
              type="email"
              name="user_email"
              placeholder="Enter valid email address.."
              onChange={event => {
                setEmail(event.target.value);
              }}
              required
            />
          </div>
        </div> */}
        <div className="password-container">
          <div className="user-form-label">
            <label>Password: </label>
          </div>
          <div className="password">
            <input
              type="password"
              name="pwd"
              placeholder="Enter valid password.."
              onChange={event => {
                setPassword(event.target.value);
              }}
              required
            />
          </div>
        </div>
        <div className="user-buttons-container">
          <button className="button-login" type="submit" className="submit">
            Login
          </button>
          <button className="button-login" type="reset" className="reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
