import { baseUrl } from "./configuration";
import axios from "axios";

export async function listBooking(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/booking/ListBookings`,
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

export async function checkIfEquipmentAvailable(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/booking/checkIfEquipmentAvailable`,
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

export async function createBooking(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/booking`,
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

export async function listBookingsEquipment(model, salesId) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/booking/ListBookingsEquipment?salesId=${salesId}`,
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

export async function ListActiveBooking() {
  const config = {
    method: "get",
    url: `${baseUrl}/UserBooking/ListActiveBooking`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function ListBookingHistory() {
  const config = {
    method: "get",
    url: `${baseUrl}/UserBooking/ListBookingHistory`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function ListBookingsSchedules(customerId) {
  const config = {
    method: "get",
    url: `${baseUrl}/Booking/ListBookingsSchedules${
      customerId ? `?customerId=${customerId}` : ""
    }`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function ListBookingSchedulesByProjectId(customerid, saleId) {
  const config = {
    method: "get",
    url: `${baseUrl}/Booking/ListBookingSchedulesByProjectId?customerId=${customerid}${
      saleId ? `&saleId=${saleId}` : ""
    }`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function ListEquipmentBooking(equipmentId) {
  const config = {
    method: "get",
    url: `${baseUrl}/Booking/ListEquipmentBooking?equipmentId=${equipmentId}`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function GetBooking(equipmentId, salesId) {
  const config = {
    method: "get",
    url: `${baseUrl}/Booking/GetBooking?equipmentId=${equipmentId}&salesId=${salesId}`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function GetUserBooking(equipmentId, salesId) {
  const config = {
    method: "get",
    url: `${baseUrl}/UserBooking/GetBooking?equipmentId=${equipmentId}&salesId=${salesId}`,
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    let result = await axios(config);
    return result.data;
  } catch (e) {
    return {};
  }
}

export async function GetBookingBySalesId(salesId) {
  const config = {
    method: "get",
    url: `${baseUrl}/Booking/GetBookingBySalesId?salesId=${salesId}`,
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

export async function ListBookingByCustomerId(customerId) {
  const config = {
    method: "get",
    url: `${baseUrl}/Booking/ListBookingByCustomerId?customerId=${customerId}`,
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

export async function DeleteBooking(bookingId){
  const config = {
    method: "delete",
    url: `${baseUrl}/Booking?bookingId=${bookingId}`,
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

export async function DeleteBookingEquipment(bookingEquipmentId){
  const config = {
    method: "delete",
    url: `${baseUrl}/Booking/DeleteBookingEquipment?bookingEquipmentId=${bookingEquipmentId}`,
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

export async function ListBookingEquipmentNote(equipmentId,bookingEquipmentId){
  const config = {
    method: "get",
    url: `${baseUrl}/Booking/ListBookingEquipmentNote?equipmentId=${equipmentId}&bookingEquipmentId=${bookingEquipmentId}`,
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

export async function AddEquipmentNote(model) {
  const config = {
    method: "post",
    data: model,
    url: `${baseUrl}/booking/AddEquipmentNote`,
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
