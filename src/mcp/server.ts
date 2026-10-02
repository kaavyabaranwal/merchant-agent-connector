import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { searchItems, getItemById } from "../connectors/zoho/items.js";
import {
    searchSalesOrders,
    getSalesOrderById,
} from "../connectors/zoho/sales-orders.js";

const server = new McpServer({
    name: "zoho-inventory-connector",
    version: "1.0.0",
});

server.tool(
    "search_items",
    "Search Zoho Inventory items by name or SKU",
    {
        query: z.string().min(1),
    },
    async ({ query }) => {
        const items = await searchItems(query);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(items, null, 2),
                },
            ],
        };
    }
);

server.tool(
    "get_item",
    "Get a Zoho Inventory item by its ID",
    {
        itemId: z.string().min(1),
    },
    async ({ itemId }) => {
        const item = await getItemById(itemId);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(item, null, 2),
                },
            ],
        };
    }
);

server.tool(
    "search_sales_orders",
    "Search Zoho Inventory sales orders by order number or search text",
    {
        query: z.string().min(1),
    },
    async ({ query }) => {
        const orders = await searchSalesOrders(query);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(orders, null, 2),
                },
            ],
        };
    }
);

server.tool(
    "get_sales_order",
    "Get a Zoho Inventory sales order by ID, including line items",
    {
        salesOrderId: z.string().min(1),
    },
    async ({ salesOrderId }) => {
        const order = await getSalesOrderById(salesOrderId);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(order, null, 2),
                },
            ],
        };
    }
);

const transport = new StdioServerTransport();

await server.connect(transport);