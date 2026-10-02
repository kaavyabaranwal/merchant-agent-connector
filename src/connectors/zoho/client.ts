import axios, { AxiosInstance } from "axios";
import "dotenv/config";

class ZohoClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.ZOHO_API_URL,
    });
  }

  private async getAccessToken(): Promise<string> {
    const response = await axios.post(
      `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: "refresh_token",
        },
      }
    );

    return response.data.access_token;
  }

  private async getAuthHeaders() {
    const accessToken = await this.getAccessToken();

    return {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    };
  }

  async getOrganizations() {
    const headers = await this.getAuthHeaders();

    const response = await this.client.get("/organizations", {
      headers,
    });

    return response.data;
  }

  async getItems(searchText?: string) {
    const headers = await this.getAuthHeaders();

    const response = await this.client.get("/items", {
      headers,
      params: {
        organization_id: process.env.ZOHO_ORGANIZATION_ID,
        ...(searchText ? { search_text: searchText } : {}),
      },
    });

    return response.data;
  }
  async getItem(itemId: string) {
  const headers = await this.getAuthHeaders();

  const response = await this.client.get(`/items/${itemId}`, {
    headers,
    params: {
      organization_id: process.env.ZOHO_ORGANIZATION_ID,
    },
  });

  return response.data;
}
}


export default ZohoClient;