import { baseUrl } from "./configuration";
import axios from "axios";

export async function createEquipment(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/equipment`,
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

export async function listEquipment(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/listequipment`,
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {
      data: [],
    };
  }
}

export async function ListGateways(from, to) {
  const config = {
    method: "get",
    url: `${baseUrl}/ListGateways?from=${from}&to=${to}`,
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {
      data: [],
    };
  }
}

export async function SaveGatewayUsage(gatewayId, from, to) {
  const config = {
    method: "get",
    url: `${baseUrl}/SaveGatewayUsage?gatewayId=${gatewayId}&from=${from}&to=${to}`,
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {
      data: [],
    };
  }
}

export async function GetLastUsageDataOfGateway(gatewayId) {
  const config = {
    method: "get",
    url: `${baseUrl}/GetLastUsageDataOfGateway?gatewayId=${gatewayId}`,
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {
      data: [],
    };
  }
}

export async function ListAvailableEngo() {
  const config = {
    method: "get",
    url: `${baseUrl}/ListAvailableEngo`,
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {
      data: [],
    };
  }
}
