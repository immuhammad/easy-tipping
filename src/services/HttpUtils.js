import ENDPOINTS from "../contants/apis";
const BASE_URL = ENDPOINTS.SERVERURL + "/api/v1/"; // live url

import axios from "axios";
export const doHttpGetWithAuth = (token, endPoint) => {
  console.log("endpoint for get ", endPoint);
  let config = {
    method: "GET",
    url: BASE_URL + endPoint,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  return axios(config);
};
export const doHttpGetWithoutAuth = (endPoint) => {
  let config = {
    method: "GET",
    url: BASE_URL + endPoint,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config);
};
export const doHttpPost = (params, endPoint, callback) => {
  var raw = JSON.stringify(params);
  let config = {
    method: "post",
    url: BASE_URL + endPoint,
    headers: {
      "Content-Type": "application/json",
    },
    data: raw,
  };

  return axios(config);
};
export const doHttpPostWithAuth = (token, params, endPoint, callback) => {
  var raw = JSON.stringify(params);
  let config = {
    method: "POST",
    url: BASE_URL + endPoint,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: raw,
  };

  return axios(config);
};

export const doHttpPutWithAuth = (token, params, endPoint, callback) => {
  var raw = JSON.stringify(params);
  let config = {
    method: "PUT",
    url: BASE_URL + endPoint,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: raw,
  };

  return axios(config);
};

export const doHttpDelete = (token, endPoint) => {
  let config = {
    method: "DELETE",
    url: BASE_URL + endPoint,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(config);
};
export const doHttpPut = (token, params, endPoint) => {
  var raw = params != "" ? JSON.stringify(params) : "";
  let config = {
    method: "PUT",
    url: BASE_URL + endPoint,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: raw,
  };

  return axios(config);
};
export const doHttpPostAuthMultipart = (token, params, endPoint) => {
  let config = {
    method: "POST",
    url: BASE_URL + endPoint,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: params,
  };

  return axios(config);
};

export const doHttpPostNoAuthMultipart = (params, endPoint) => {
  let config = {
    method: "POST",
    url: BASE_URL + endPoint,
    headers: { "Content-Type": "multipart/form-data" },
    data: params,
  };

  return axios(config);
};
