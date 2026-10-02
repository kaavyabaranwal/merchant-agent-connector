// to be run with seed env file .env.seed

import axios from "axios";
import "dotenv/config";

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

const items = [
  {
    name: "Wireless Keyboard",
    sku: "KB-001",
    rate: 1999,
    purchase_rate: 1200,
    initial_stock: 4,
    reorder_level: 5,
  },
  {
    name: "USB-C Hub",
    sku: "HUB-002",
    rate: 1499,
    purchase_rate: 900,
    initial_stock: 32,
    reorder_level: 10,
  },
  {
    name: "Laptop Stand",
    sku: "LS-003",
    rate: 2499,
    purchase_rate: 1500,
    initial_stock: 8,
    reorder_level: 5,
  },
  {
    name: "Wireless Mouse",
    sku: "WM-004",
    rate: 999,
    purchase_rate: 550,
    initial_stock: 2,
    reorder_level: 5,
  },
  {
    name: "Webcam",
    sku: "CAM-005",
    rate: 3499,
    purchase_rate: 2200,
    initial_stock: 25,
    reorder_level: 8,
  },
  {
    name: "Mechanical Keyboard",
    sku: "MK-006",
    rate: 4999,
    purchase_rate: 3200,
    initial_stock: 7,
    reorder_level: 5,
  },
];

async function createItem(
  accessToken: string,
  item: (typeof items)[number]
) {
  const response = await api.post(
    "/items",
    {
      organization_id: process.env.ZOHO_ORGANIZATION_ID,
      name: item.name,
      sku: item.sku,
      rate: item.rate,
      purchase_rate: item.purchase_rate,
      item_type: "inventory",
      initial_stock: item.initial_stock,
      reorder_level: item.reorder_level,
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

  for (const item of items) {
    try {
      const result = await createItem(accessToken, item);

      console.log(`Created: ${item.name}`);
      console.log(`Item ID: ${result.item?.item_id ?? "unknown"}`);
    } catch (error: any) {
      console.error(
        `Failed: ${item.name}`,
        error.response?.data ?? error.message
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});