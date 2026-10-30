import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ReceiptText,
  Users,
  Package,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

const files = {
  products: "/student-data/products.json",
  accounts: "/student-data/accounts.json",
  invoices: "/student-data/invoices.json",
};

// Change these names to match invoices.json and accounts.json
const f = {
  invoiceId: "id",
  invoiceCustomer: "accountId",
  invoiceTotal: "total",
  invoiceDate: "date",
  invoiceStatus: "status",
  accountId: "id",
  accountName: "fullName",
  accountRole: "role",
};

// Set to null if accounts.json has no role field
const CUSTOMER_ROLE = null;
const LOW_STOCK_LIMIT = 20;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusStyles = {
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
};

const card = "rounded-2xl border border-cherry/10 bg-white p-6";

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function AdminOverview() {
  const [data, setData] = useState({ products: [], accounts: [], invoices: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [products, accounts, invoices] = await Promise.all([
          getJson(files.products),
          getJson(files.accounts),
          getJson(files.invoices),
        ]);
        setData({ products, accounts, invoices });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const view = useMemo(() => {
    const { products, accounts, invoices } = data;

    const activeProducts = products.filter((p) => p.active !== false);
    const customers = CUSTOMER_ROLE
      ? accounts.filter((a) => a[f.accountRole] === CUSTOMER_ROLE)
      : accounts;

    const revenue = invoices.reduce(
      (sum, i) => sum + Number(i[f.invoiceTotal] || 0),
      0
    );

    // Sales per day, last 7 days of data
    const dated = invoices
      .map((i) => ({ date: new Date(i[f.invoiceDate]), total: Number(i[f.invoiceTotal] || 0) }))
      .filter((i) => !Number.isNaN(i.date.getTime()));

    let week = [];
    if (dated.length > 0) {
      const end = new Date(Math.max(...dated.map((i) => i.date.getTime())));
      for (let k = 6; k >= 0; k--) {
        const day = new Date(end);
        day.setDate(end.getDate() - k);
        week.push({
          label: day.toLocaleDateString("en-US", { weekday: "short" }),
          sales: dated
            .filter((i) => i.date.toDateString() === day.toDateString())
            .reduce((sum, i) => sum + i.total, 0),
        });
      }
    }

    const lowStock = activeProducts
      .filter((p) => p.stockQuantity <= LOW_STOCK_LIMIT)
      .sort((a, b) => a.stockQuantity - b.stockQuantity)
      .slice(0, 5);

    const names = new Map(
      accounts.map((a) => [String(a[f.accountId]), a[f.accountName]])
    );

    const recent = [...invoices]
      .sort((a, b) => new Date(b[f.invoiceDate]) - new Date(a[f.invoiceDate]))
      .slice(0, 5)
      .map((i) => ({
        id: i[f.invoiceId],
        customer: names.get(String(i[f.invoiceCustomer])) ?? "Guest",
        total: Number(i[f.invoiceTotal] || 0),
        status: i[f.invoiceStatus],
      }));

    return {
      stats: [
        { label: "Revenue", value: money.format(revenue), note: "From all invoices", icon: DollarSign },
        { label: "Orders", value: invoices.length, note: "Total invoices", icon: ReceiptText },
        { label: "Customers", value: customers.length, note: "Registered accounts", icon: Users },
        { label: "Products", value: activeProducts.length, note: "Active in catalog", icon: Package },
      ],
      week,
      maxSales: Math.max(...week.map((d) => d.sales), 1),
      lowStock,
      recent,
    };
  }, [data]);

  if (loading) return <p className="text-gray-600">Loading dashboard...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-gray-900 sm:text-4xl">
          Welcome back, Admin
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here is what is happening in your shop.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {view.stats.map(({ label, value, note, icon: Icon }) => (
          <div key={label} className={card}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-deep text-cherry">
              <Icon size={18} aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-3xl text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        {/* Sales chart */}
        <section className={card} aria-label="Sales, last 7 days">
          <h2 className="font-display text-xl text-gray-900">
            Sales, last 7 days
          </h2>
          {view.week.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">No dated invoices yet.</p>
          ) : (
            <div className="mt-6 flex h-48 items-end gap-3">
              {view.week.map((d, i) => (
                <div
                  key={i}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full rounded-t-lg bg-cherry/80 transition-colors hover:bg-cherry"
                    style={{ height: `${Math.max((d.sales / view.maxSales) * 100, 2)}%` }}
                    title={`${d.label}: ${money.format(d.sales)}`}
                  />
                  <span className="text-xs text-gray-500">{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Low stock */}
        <section className={card} aria-label="Low stock">
          <h2 className="flex items-center gap-2 font-display text-xl text-gray-900">
            <AlertTriangle size={18} className="text-amber-600" aria-hidden="true" />
            Low stock
          </h2>
          {view.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">All products are well stocked.</p>
          ) : (
            <ul className="mt-4 divide-y divide-cherry/10">
              {view.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-gray-800">{p.name}</span>
                  <span className="font-medium text-amber-700">
                    {p.stockQuantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/admin/products"
            className="mt-3 inline-flex items-center gap-1 text-sm text-cherry hover:underline"
          >
            Manage products <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      </div>

      {/* Recent orders */}
      <section className={card} aria-label="Recent orders">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-gray-900">Recent orders</h2>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-cherry hover:underline"
          >
            View all <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {view.recent.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-cherry/10 text-xs uppercase tracking-wider text-gray-500">
                  <th scope="col" className="py-3 font-medium">Order</th>
                  <th scope="col" className="py-3 font-medium">Customer</th>
                  <th scope="col" className="py-3 font-medium">Total</th>
                  <th scope="col" className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cherry/10">
                {view.recent.map((o, i) => {
                  const status = String(o.status ?? "-");
                  const style =
                    statusStyles[status.toLowerCase()] ?? "bg-gray-100 text-gray-700";
                  return (
                    <tr key={o.id ?? i}>
                      <td className="py-3 font-medium text-gray-900">#{o.id}</td>
                      <td className="py-3 text-gray-700">{o.customer}</td>
                      <td className="py-3 text-gray-700">{money.format(o.total)}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${style}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminOverview;