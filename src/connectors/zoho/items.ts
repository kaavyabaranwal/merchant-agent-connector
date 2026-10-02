import ZohoClient from "./client";

const zoho = new ZohoClient();

export async function searchItems(query: string) {
  const result = await zoho.getItems(query);

  return result.items.map((item: any) => ({
    id: item.item_id,
    name: item.item_name,
    sku: item.sku,
    sellingPrice: item.rate,
    stockOnHand: item.stock_on_hand,
    availableForSale: item.available_for_sale,
    reorderLevel: item.reorder_level,
    status: item.status,
  }));
}

// async function main() {
//   const result = await searchItems("keyboard");
//   console.log(JSON.stringify(result, null, 2));
// }

// main().catch(console.error);