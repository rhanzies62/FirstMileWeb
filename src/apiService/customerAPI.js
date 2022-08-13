import { baseUrl } from "./configuration";
import axios from "axios";

export async function listCustomers(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/customer/ListCustomers`,
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return e.response;
  }
}

export async function createCustomer(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/customer`,
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return e.response.data;
  }
}


export async function addCustomerUser(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/customer/AddCustomerUser`,
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return e.response.data;
  }
}


export async function ListAllAvailableUser() {
  const config = {
    method: "get",
    url: `${baseUrl}/Customer/ListAllAvailableUser`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function ListAssignedUserByCustomerId(customerId) {
  const config = {
    method: "get",
    url: `${baseUrl}/Customer/ListAssignedUserByCustomerId?customerId=${customerId}`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

