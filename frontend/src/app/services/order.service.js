import axios from "axios";
import {logout} from "../slices/auth";

const API_URL = "http://localhost:8080/api/";

const getWashPageContent = async () => {
    const response = await axios.get(API_URL + "washPage");
    if (response.status === 200) {
        return response.data;
    } else if (response.status === 401) {
        logout()
            .unwrap()
            .then(() => {
                window.location.reload();
            })
            .catch(() => {
            });
    } else if (response.status === 404) {
        return {};
    } else {
        return {};
    }
};

const OrderService = {
    getWashPageContent,
}

export default OrderService;