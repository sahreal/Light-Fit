import axios from "axios";

const userLogin = (userInfo) => {
  return axios.post("/login", userInfo).then((data) => {
    console.log(data);
  });
};

export default userLogin;
