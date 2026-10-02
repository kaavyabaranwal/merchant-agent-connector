# Zoho Inventory MCP Connector

A read-only MCP connector that exposes Zoho Inventory data to an AI agent through structured tools.

## Architecture

```text
AI Agent
   |
   v
MCP Tools
   |
   v
Zoho Inventory Connector
   |
   +--> OAuth 2.0
   |
   v
Zoho Inventory API
```
## Input interface
<img width="1917" height="867" alt="image" src="https://github.com/user-attachments/assets/a38547f7-dfc6-49fa-ac23-69bb1c43f476" />

## Available MCP Tools

### `search_items`

Search inventory items by name or SKU.

Example:

```json
{
  "query": "keyboard"
}
```

Returns normalized inventory information, including:

- Item ID
- Name
- SKU
- Selling price
- Stock on hand
- Available-for-sale status
- Reorder level
- Item status

Example Ouput (Input - query : keyboard)
<img width="1917" height="866" alt="image" src="https://github.com/user-attachments/assets/9093dcb7-b119-4dde-a1fd-a10bf3284695" />


### `get_item`

Get a specific inventory item by ID. Returns additional information such as purchase price.

Example Ouput with item id (Input - query : 4220718000000034204)
<img width="1917" height="865" alt="image" src="https://github.com/user-attachments/assets/80630fc0-afef-4da6-9d05-85a55015623e" />


### `search_sales_orders`

Search sales orders by order number or search text.

Returns:

- Order ID
- Order number
- Customer
- Date
- Status
- Total
- Currency
- Quantity

Example output - After searching for sales order "SO-00002"
<img width="1916" height="866" alt="image" src="https://github.com/user-attachments/assets/fa8ab757-04da-46bd-84ad-f622c7ab9431" />


### `get_sales_order`

Get a sales order by ID, including its line items:

- Item
- SKU
- Quantity
- Rate
- Line-item total

Example output - After searching for salesOrderId - 4220718000000034239
<img width="1912" height="863" alt="image" src="https://github.com/user-attachments/assets/108430f6-c4da-47ea-bbb1-f17e7d1421ff" />


## Authentication

The connector uses Zoho OAuth 2.0. A refresh token is stored in environment variables and exchanged for a short-lived access token when making API requests.

Required environment variables:

```env
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_ORGANIZATION_ID=
ZOHO_ACCOUNTS_URL=
ZOHO_API_URL=
```

Secrets are never committed to the repository.

## Rate Limiting and Error Handling

The Zoho client handles API failures centrally in client.ts:

- `401` → authentication error
- `404` → resource not found
- `429` → rate-limit error 
- `5xx` → temporary Zoho API failure
- Other errors → generic API failure

Rate-limited requests are retried up to two times with exponential backoff.

## Running Locally

Install dependencies:

```bash
npm install
```

Run the MCP server:

```bash
npx tsx src/mcp/server.ts
```

The server communicates over stdio and is intended to be launched by an MCP-compatible client.

## Example Agent Queries

An agent can use the connector to answer questions such as:

> Do we have any keyboards running low on stock?

> Show me order SO-00002 and its line items.

> Find inventory items matching "keyboard".

> What is the current stock for item `4220718000000034204`?

## Scope and Limitations

This connector is intentionally read-only. However it can easily be expanded to write scope as Zoho supports write operations.

### Supported

- Search inventory items
- Retrieve individual inventory items
- Search sales orders
- Retrieve sales orders with line items
- OAuth authentication
- Rate-limit handling

### Not supported (currently)

- Creating or updating inventory items
- Creating or modifying sales orders
- Creating invoices
- Updating stock
- Customer creation or modification
- Webhooks
- Pagination beyond the underlying API response
- Natural-language business logic outside the exposed MCP tools

The connector exposes a small set of focused primitives rather than the entire Zoho Inventory API.

## Security

OAuth credentials are supplied through environment variables.

NOT committed - `.env` files, refresh tokens, client secrets, or seeded credentials.

The connector only exposes read operations to the agent.
