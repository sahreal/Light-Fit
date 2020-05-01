import axios from "axios";

const session = {
  userLogin: (userInfo) => {
    return axios
      .post("/login", userInfo)
      .then(({ data }) => {
        return data.loggedIn;
      })
      .catch((err) => {
        console.log(err.response.data);
        return { error: err.response.data };
      });
  },
  userLogout: () => {
    return axios
      .delete("/login")
      .then(({ data }) => {
        return data.loggedOut;
      })
      .catch((err) => {
        console.log(err.response.data);
        return { error: err.response.data };
      });
  },
};

export default session;
