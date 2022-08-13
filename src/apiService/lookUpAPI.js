import { baseUrl } from "./configuration";
import axios from "axios";

export async function listEquipmentTypes() {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListEquipmentTypes`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function listCustomers() {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListCustomers`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function ListAvailableEquipment() {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListAvailableEquipment`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function ListCountry() {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListCountry`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function ListProvince(countryId) {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListProvince?countryId=${countryId}`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function GetGatewayBySerial(serial) {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/GetGatewayBySerial?serial=${serial}`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function GetSourceBySerial(serial,type) {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/GetSourceBySerial?serial=${serial}&type=${type}`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function GetGatewayUsage(gatewayid, from, to) {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/GetGatewayUsage?gatewayId=${gatewayid}&from=${from}&to=${to}`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function GetSourceUsage(sourceId, from, to) {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/GetSourceUsage?sourceId=${sourceId}&from=${from}&to=${to}`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function ListProjectsByCustomerId(customerId) {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListProjectsByCustomerId?customerId=${customerId}`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function ListStatusTypes() {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListStatusTypes`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function ListActivityType() {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListActivityType`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function ListEquipmentLocations() {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/ListEquipmentLocations`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function GetGatewayLocation(dejeroId) {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/GetGatewayLocation?dejeroId=${dejeroId}`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function GetSourceLocation(dejeroId) {
  const config = {
    method: "get",
    url: `${baseUrl}/LookUp/GetSourceLocation?dejeroId=${dejeroId}`,
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return [];
  }
}

export async function getFrameIOAccessToken(){}