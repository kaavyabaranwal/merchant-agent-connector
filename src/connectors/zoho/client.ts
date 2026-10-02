import axios, { AxiosError, AxiosInstance } from "axios";
import "dotenv/config";

class ZohoClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.ZOHO_API_URL,
        });
    }

    private async requestWithRetry<T>(
        request: () => Promise<T>,
        retries = 2
    ): Promise<T> {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await request();
            } catch (error) {
                const axiosError = error as AxiosError;

                if (
                    axiosError.response?.status !== 429 ||
                    attempt === retries
                ) {
                    throw error;
                }

                const delay = 500 * Math.pow(2, attempt);

                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        throw new Error("Request failed after retries");
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
        return this.requestWithRetry(async () => {
            const headers = await this.getAuthHeaders();

            const response = await this.client.get("/items", {
                headers,
                params: {
                    organization_id: process.env.ZOHO_ORGANIZATION_ID,
                    ...(searchText ? { search_text: searchText } : {}),
                },
            });

            return response.data;
        });
    }

    async getItem(itemId: string) {
        return this.requestWithRetry(async () => {
            const headers = await this.getAuthHeaders();

            const response = await this.client.get(`/items/${itemId}`, {
                headers,
                params: {
                    organization_id: process.env.ZOHO_ORGANIZATION_ID,
                },
            });

            return response.data;
        });
    }

    async getSalesOrders(searchText?: string) {
        return this.requestWithRetry(async () => {
            const headers = await this.getAuthHeaders();

            const response = await this.client.get("/salesorders", {
                headers,
                params: {
                    organization_id: process.env.ZOHO_ORGANIZATION_ID,
                    ...(searchText ? { search_text: searchText } : {}),
                },
            });

            return response.data;
        });
    }

    async getSalesOrderById(salesOrderId: string) {
        return this.requestWithRetry(async () => {
            const headers = await this.getAuthHeaders();

            const response = await this.client.get(
                `/salesorders/${salesOrderId}`,
                {
                    headers,
                    params: {
                        organization_id: process.env.ZOHO_ORGANIZATION_ID,
                    },
                }
            );

            return response.data;
        });
    }
}

export default ZohoClient;