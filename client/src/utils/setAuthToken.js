// client/src/utils/setAuthToken.js

import axios from 'axios';

/**
 * Sets the authentication token globally for all Axios requests.
 * It clears the header if no token is found.
 * @param {string | null} token The JWT token from localStorage or null to clear it.
 */
const setAuthToken = (token) => {
    if (token) {
        // Apply token to every request using the 'x-auth-token' header
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        // Delete the auth header if token is null (e.g., on logout)
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export default setAuthToken;