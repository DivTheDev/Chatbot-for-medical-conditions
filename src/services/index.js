import axios from 'react-native-axios';

const URL = 'http://localhost:3000/';

export function postLogin(username, password) {
  return axios.post(URL + 'login', {
    username: username,
    password: password,
  });
}

export function getConditionsPerUser() {
  return axios.get(URL + 'conditions-per-user', {});
}

export function getSymptom(text) {
  return axios.post(URL + 'chat', {
    text: text,
  });
}

