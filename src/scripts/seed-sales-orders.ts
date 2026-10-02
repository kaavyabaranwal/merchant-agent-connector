import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.seed" });

const api = axios.create({
  baseURL: process.env.ZOHO_API_URL,
});

async function getAccessToken(): Promise<string> {
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

const orders = [
  {
    salesorder_number: "SO-1001",
    items: [
      { item_id: "4220718000000038002", quantity: 2 },
    ],
  },
  {
    salesorder_number: "SO-1002",
    items: [
      { item_id: "4220718000000038002", quantity: 3 },
      { item_id: "4220718000000034204", quantity: 1 },
    ],
  },
  {
    salesorder_number: "SO-1003",
    items: [
      { item_id: "4220718000000034204", quantity: 1 },
      { item_id: "4220718000000038002", quantity: 2 },
    ],
  },
];

async function createSalesOrder(
  accessToken: string,
  order: (typeof orders)[number]
) {
  const lineItems = order.items.map((item) => ({
    item_id: item.item_id,
    quantity: item.quantity,
  }));

  const response = await api.post(
    "/salesorders",
    {
      organization_id: process.env.ZOHO_ORGANIZATION_ID,
      customer_id: process.env.ZOHO_DEMO_CUSTOMER_ID,
      line_items: lineItems,
    },
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    }
  );

  return response.data;
}

async function main() {
  const accessToken = await getAccessToken();

  for (const order of orders) {
    try {
      const result = await createSalesOrder(accessToken, order);

      console.log(
         `Created order: ${result.salesorder?.salesorder_number ?? "unknown"}`,
         `Order ID: ${result.salesorder?.salesorder_id ?? "unknown"}`
      );
    } catch (error: any) {
      console.error(
        `Failed seed order ${order.salesorder_number}:`,
        error.response?.data ?? error.message
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});