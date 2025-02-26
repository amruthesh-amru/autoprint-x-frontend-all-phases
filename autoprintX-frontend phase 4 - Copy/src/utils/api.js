const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API = {
    LOGOUT: `${API_BASE_URL}/user/logout`,
    LOGIN: `${API_BASE_URL}/user/login`,
    REGISTER: `${API_BASE_URL}/user/register`,
    CHECK_AUTH: `${API_BASE_URL}/user/register`,
    REMOVE_FROM_CART: `${API_BASE_URL}/cart/removeFromCart`,
    ADD_TO_CART: `${API_BASE_URL}/cart/addToCart`,
    GET_CART_ITEMS: `${API_BASE_URL}/cart/getCart`,
    GET_TOTAL_CART: `${API_BASE_URL}/cart/getCartTotal`,
    CREATE_CHECKOUT_SESSION: `${API_BASE_URL}/payment/create-checkout-session`,
    VERIFY_SESSION: `${API_BASE_URL}/payment/verify-session`,
    PROCESS_ORDER: `${API_BASE_URL}/order/process-order`,
    PRE_UPLOAD: `${API_BASE_URL}/upload/pre-upload`,
    DELETE_FILE: `${API_BASE_URL}/upload/delete-file`,
};
