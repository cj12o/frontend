import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/join-request";

const getHeaders = () => {
  const token = localStorage.getItem("cookie");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Token ${token}` : "",
  };
};

export const requestJoin = async (room_id: number) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/create/`,
      {
        room_id: room_id,
      },
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listJoinRequests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list/`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const manageJoinRequest = async (
  request_id: number,
  action: "ACCEPT" | "REJECT"
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/manage/`,
      {
        request_id: request_id,
        action: action,
      },
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
