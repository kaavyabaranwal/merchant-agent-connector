import ZohoClient from "./client";

const zoho = new ZohoClient();

export async function searchSalesOrders(query?: string) {
  const result = await zoho.getSalesOrders(query);

  return result.salesorders.map((order: any) => ({
    id: order.salesorder_id,
    orderNumber: order.salesorder_number,
    customer: order.customer_name,
    date: order.date,
    status: order.status,
    total: order.total,
    currency: order.currency_code,
    quantity: order.quantity,
  }));
}

export async function getSalesOrderById(salesOrderId: string) {
  const result = await zoho.getSalesOrderById(salesOrderId);
  const order = result.salesorder;

  if (!order) {
    return null;
  }

  return {
    id: order.salesorder_id,
    orderNumber: order.salesorder_number,
    customer: order.customer_name,
    customerId: order.customer_id,
    date: order.date,
    status: order.status,
    total: order.total,
    currency: order.currency_code,
    quantity: order.quantity,

    items: (order.line_items ?? []).map((item: any) => ({
      itemId: item.item_id,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      rate: item.rate,
      total: item.item_total,
    })),
  };
}
async function main() {
  console.log("=== SEARCH ===");

  const searchResult = await searchSalesOrders("SO-00002");
  console.log(JSON.stringify(searchResult, null, 2));

  console.log("\n=== GET BY ID ===");

  const detailResult = await getSalesOrderById(
    "4220718000000034239"
  );
  console.log(JSON.stringify(detailResult, null, 2));
}

main().catch(console.error);