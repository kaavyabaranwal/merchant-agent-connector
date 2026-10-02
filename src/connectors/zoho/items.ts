import ZohoClient from "./client.js";

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
export async function getItemById(itemId: string) {
  const result = await zoho.getItem(itemId);
  const item = result.item;

  if (!item) {
    return null;
  }

  return {
    id: item.item_id,
    name: item.item_name,
    sku: item.sku,
    sellingPrice: item.rate,
    purchasePrice: item.purchase_rate,
    stockOnHand: item.stock_on_hand,
    availableForSale: item.available_for_sale,
    reorderLevel: item.reorder_level,
    status: item.status,
  };
}
// async function main() {
//   const result = await getItemById("4220718000000034204");
//   console.log(JSON.stringify(result, null, 2));
// }

// main().catch(console.error);

// async function main() {
//   const result = await searchItems("keyboard");
//   console.log(JSON.stringify(result, null, 2));
// }

// main().catch(console.error);