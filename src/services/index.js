import axios from 'react-native-axios';

const URL = 'http://localhost:3000/';
let CURRENT_USER = '';

export function postLogin(username, password) {
  CURRENT_USER = username;
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

export function postSymptoms(symptoms) {
  return axios.post(URL + 'submitSymptoms', {
    symptoms: symptoms,
    user: CURRENT_USER,
  });
}