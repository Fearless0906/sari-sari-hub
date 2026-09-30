import { useSyncExternalStore } from "react";

export type StockStatus = "in" | "low" | "out";

export type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  lowAt: number;
  soldToday: number;
};

export type Movement = {
  id: string;
  productName: string;
  kind: "restock" | "sale" | "added";
  qty: number;
  at: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  categories: string[];
  lastDelivery: string;
};

export const CATEGORIES = [
  "Beverages",
  "Pantry",
  "Snacks",
  "Personal care",
  "Load",
  "Canned",
] as const;

export function statusOf(p: Product): StockStatus {
  if (p.stock <= 0) return "out";
  if (p.stock <= p.lowAt) return "low";
  return "in";
}

export const peso = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { maximumFractionDigits: 0 });

const initialProducts: Product[] = [
  { id: "p1", name: "Coca-Cola 330ml", category: "Beverages", stock: 142, price: 35, lowAt: 24, soldToday: 48 },
  { id: "p2", name: "Sunflower Oil 1L", category: "Pantry", stock: 8, price: 145, lowAt: 12, soldToday: 6 },
  { id: "p3", name: "Dove Soap 100g", category: "Personal care", stock: 0, price: 55, lowAt: 10, soldToday: 4 },
  { id: "p4", name: "Rice 5kg", category: "Pantry", stock: 64, price: 320, lowAt: 15, soldToday: 9 },
  { id: "p5", name: "Oreo 150g", category: "Snacks", stock: 23, price: 75, lowAt: 25, soldToday: 17 },
  { id: "p6", name: "Shampoo Sachet 12ml", category: "Personal care", stock: 51, price: 120, lowAt: 20, soldToday: 22 },
  { id: "p7", name: "Lucky Me Pancit Canton", category: "Snacks", stock: 96, price: 18, lowAt: 30, soldToday: 41 },
  { id: "p8", name: "Globe Load ₱20", category: "Load", stock: 6, price: 22, lowAt: 10, soldToday: 14 },
  { id: "p9", name: "Century Tuna 155g", category: "Canned", stock: 38, price: 42, lowAt: 15, soldToday: 7 },
];

const initialMovements: Movement[] = [
  { id: "m1", productName: "Coca-Cola 330ml", kind: "sale", qty: 12, at: "09:42" },
  { id: "m2", productName: "Sunflower Oil 1L", kind: "restock", qty: 24, at: "08:15" },
  { id: "m3", productName: "Lucky Me Pancit Canton", kind: "sale", qty: 20, at: "07:58" },
];

const suppliers: Supplier[] = [
  { id: "s1", name: "Bayan Distributors", contact: "0917 442 1180", categories: ["Beverages", "Snacks"], lastDelivery: "2 days ago" },
  { id: "s2", name: "Malaya Grocery Supply", contact: "0918 220 7741", categories: ["Pantry", "Canned"], lastDelivery: "5 days ago" },
  { id: "s3", name: "Tindahan Direct", contact: "0995 118 3020", categories: ["Personal care", "Load"], lastDelivery: "Yesterday" },
];

type State = { products: Product[]; movements: Movement[] };

let state: State = { products: initialProducts, movements: initialMovements };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const getSnapshot = () => state;

export function useInventory() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getSuppliers() {
  return suppliers;
}

function now() {
  return new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

export function addProduct(input: Omit<Product, "id" | "soldToday">) {
  const product: Product = { ...input, id: crypto.randomUUID(), soldToday: 0 };
  set({
    products: [product, ...state.products],
    movements: [
      { id: crypto.randomUUID(), productName: product.name, kind: "added", qty: product.stock, at: now() },
      ...state.movements,
    ],
  });
}

export function restock(id: string, qty: number) {
  const product = state.products.find((p) => p.id === id);
  if (!product) return;
  set({
    products: state.products.map((p) => (p.id === id ? { ...p, stock: p.stock + qty } : p)),
    movements: [
      { id: crypto.randomUUID(), productName: product.name, kind: "restock", qty, at: now() },
      ...state.movements,
    ],
  });
}

export function recordSale(id: string, qty: number) {
  const product = state.products.find((p) => p.id === id);
  if (!product || product.stock < qty) return;
  set({
    products: state.products.map((p) =>
      p.id === id ? { ...p, stock: p.stock - qty, soldToday: p.soldToday + qty } : p,
    ),
    movements: [
      { id: crypto.randomUUID(), productName: product.name, kind: "sale", qty, at: now() },
      ...state.movements,
    ],
  });
}

export function summary(products: Product[]) {
  const totalSkus = products.length;
  const lowStock = products.filter((p) => statusOf(p) !== "in").length;
  const stockValue = products.reduce((a, p) => a + p.stock * p.price, 0);
  const soldToday = products.reduce((a, p) => a + p.soldToday * p.price, 0);
  const transactions = products.reduce((a, p) => a + p.soldToday, 0);
  return { totalSkus, lowStock, stockValue, soldToday, transactions };
}

export function categoryBreakdown(products: Product[]) {
  const total = products.reduce((a, p) => a + p.stock * p.price, 0) || 1;
  const map = new Map<string, number>();
  for (const p of products) {
    map.set(p.category, (map.get(p.category) ?? 0) + p.stock * p.price);
  }
  return [...map.entries()]
    .map(([category, value]) => ({ category, pct: Math.round((value / total) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);
}
