import axios from "axios";
import {Navigate, useNavigate} from "react-router-dom";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email, password) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    return axios
        .post(API_URL + "login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
            if (response.data.token) {
                localStorage.setItem("authToken", JSON.stringify(response.data.token));
            }
            else {
                return {message: "неудачная попытка авторизации"};
            }
        });
};

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRefreshToken");
    return <Navigate to={'/login'}/>
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
}

export default AuthService;