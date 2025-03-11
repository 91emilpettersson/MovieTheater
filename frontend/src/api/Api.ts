import config from "../config/config.json";
import { Seat } from "../types/Seat";
import toast from "react-hot-toast";


class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = config.BASE_URL;
  }

  async request(method: string, path: string, body?: number[]) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try{
      const response = await fetch(this.baseUrl + path, options);

      if (!response.ok) {
        const jsonResponse = await response.json();
        if("message" in jsonResponse)
        {
          toast.error("Something went wrong: " + jsonResponse.message)
        }
        else
        {
          toast.error("Something went wrong. Please try again!");
        }
        return null;
      }
  
      return response.json();
    }catch(e)
    {
      toast.error("Something went wrong. Please try again!");
      console.warn(e);
      return null;
    }
  }

  async getSeats(): Promise<Seat[] | null> {
    return await this.request("GET", "/api/theater/seats");
  }

  async bookSeats(body: number[]): Promise<Seat[] | null> {
    return await this.request("PATCH", "/api/theater/book", body);
  }
}

export const api = new Api();
