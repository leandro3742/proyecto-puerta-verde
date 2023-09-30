import { BACKEND_URL } from "../assets/constant";

interface ILogin {
  username: string;
  password: string;
}

export const login = async (data: ILogin) => {
  try {
    const response = await fetch(`${BACKEND_URL}login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
}