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

### `get_item`

Get a specific inventory item by ID. Returns additional information such as purchase price.

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

### `get_sales_order`

Get a sales order by ID, including its line items:

- Item
- SKU
- Quantity
- Rate
- Line-item total

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

The Zoho client handles API failures centrally:

- `401` → authentication error
- `404` → resource not found
- `429` → rate-limit error with exponential backoff
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

> Find inventory items matching "webcam".

> What is the current stock for item `4220718000000034204`?

## Scope and Limitations

This connector is intentionally read-only.

### Supported

- Search inventory items
- Retrieve individual inventory items
- Search sales orders
- Retrieve sales orders with line items
- OAuth authentication
- Rate-limit handling

### Not supported

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

Do not commit `.env` files, refresh tokens, client secrets, or seeded credentials.

The connector only exposes read operations to the agent.
