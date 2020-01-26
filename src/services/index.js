import axios from 'react-native-axios';

const URL = 'http://localhost:3000/';

export function postLogin(username, password) {
    return axios.post(URL + 'login', {
        username: username,
        password: password,
    });
}