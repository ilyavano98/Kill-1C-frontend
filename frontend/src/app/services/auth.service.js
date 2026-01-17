import axios from "axios";
import {Navigate} from "react-router-dom";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email, password) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    // return axios
    //     .post(API_URL + "login", {
    //         username,
    //         password,
    //     })
    //     .then((response) => {
    //         if (response.data.username) {
    //             localStorage.setItem("user", JSON.stringify(response.data));
    //         }

    //временные данные
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem("authToken","12345678");
        return localStorage.setItem("user", JSON.stringify({name: 'Admin', roles: 'ROLE_ADMIN'}));
    }
            return {message: "неудачная попытка авторизации"};
        // });
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