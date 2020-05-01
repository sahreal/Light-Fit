import React, { useState } from "react";
import loginUser from "../helpers/userLogin.js";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async () => {
    const isLoggedIn = await loginUser({ email, password });
    !isLoggedIn.error ? history.pushState("/home") : setError(isLoggedIn.error);
  };

  return (
    <div>
      <div className="loginerror">
        <p className="loginerror errormessage">{error}</p>
      </div>
      <form
        className="login-form user-form"
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler();
        }}
      >
        <h4 className="user-form-heading">Login</h4>
        <div className="email-container">
          <label>Email: </label>
          <div className="email">
            <input
              type="email"
              name="user_email"
              placeholder="Enter valid email address.."
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
            />
          </div>
        </div>
        <div className="password-container">
          <label>Password: </label>
          <div className="password">
            <input
              type="password"
              name="pwd"
              placeholder="Enter valid password.."
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              required
            />
          </div>
        </div>
        <div className="user-buttons-container">
          <button type="submit" className="submit">
            Login
          </button>
          <button type="reset" className="reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
