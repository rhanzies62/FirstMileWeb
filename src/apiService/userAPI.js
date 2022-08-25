import { baseUrl } from "./configuration";
import axios from "axios";

export async function login(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/login`,
    headers: {
      "content-type": "application/json",
    },
  };
  try {
    let result = await axios(config);
    localStorage.setItem("token", result.data.Data.Token);
    localStorage.setItem("userinfo", JSON.stringify(result.data.Data));
    return result.data;
  } catch (e) {
    return e.response.data;
  }
}

export async function listUsers(filter) {
  const config = {
    method: "post",
    data: filter,
    url: `${baseUrl}/Users`,
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

export async function createUser(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/Register`,
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

export async function updatePassword(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/UpdatePassword`,
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

export async function updateUserFrameIOToken(token) {
  const config = {
    method: "get",
    url: `${baseUrl}/UpdateToken?token=${token}`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return null;
  }
}

export async function getUserFrameIOToken() {
  const config = {
    method: "get",
    url: `${baseUrl}/GetUserFrameIOToken`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return null;
  }
}

export async function AddEditMeili(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/AddEditMeili`,
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

export async function ListUserMeilie(filter) {
  const config = {
    method: "post",
    data: filter,
    url: `${baseUrl}/ListUserMeilie`,
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

export async function ListAllMeilie(filter) {
  const config = {
    method: "post",
    data: filter,
    url: `${baseUrl}/ListAllMeilie`,
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

export async function GetMeili(id) {
  const config = {
    method: "get",
    url: `${baseUrl}/GetMeili?id=${id}`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return null;
  }
}
