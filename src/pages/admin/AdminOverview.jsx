import { Link } from "react-router-dom";
import {
  DollarSign,
  ReceiptText,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

const stats = [
  { label: "Revenue", value: "$12,480", change: "+12%", icon: DollarSign },
  { label: "Orders", value: "326", change: "+8%", icon: ReceiptText },
  { label: "Customers", value: "1,204", change: "+5%", icon: Users },
  { label: "Products", value: "48", change: "+2", icon: Package },
];

const week = [
  { day: "Mon", sales: 420 },
  { day: "Tue", sales: 680 },
  { day: "Wed", sales: 540 },
  { day: "Thu", sales: 910 },
  { day: "Fri", sales: 760 },
  { day: "Sat", sales: 1100 },
  { day: "Sun", sales: 830 },
];

const lowStock = [
  { name: "Silk Veil Cushion", left: 4 },
  { name: "Velvet Shadow Palette", left: 6 },
  { name: "Rose Petal Lip Tint", left: 3 },
];

const orders = [
  { id: "#1042", customer: "Jina Park", total: "$96", status: "Shipped" },
  { id: "#1041", customer: "Maya Chen", total: "$42", status: "Paid" },
  { id: "#1040", customer: "Sora Lee", total: "$138", status: "Pending" },
  { id: "#1039", customer: "Emma Kim", total: "$48", status: "Shipped" },
  { id: "#1038", customer: "Lina Cho", total: "$84", status: "Paid" },
];

const statusStyle = {
  Shipped: "bg-green-100 text-green-800",
  Paid: "bg-blue-100 text-blue-800",
  Pending: "bg-amber-100 text-amber-800",
};

const card = "rounded-2xl border border-cherry/10 bg-white p-6";

function AdminOverview() {
  const max = Math.max(...week.map((d) => d.sales));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-gray-900 sm:text-4xl">
          Welcome back, Admin
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here is what is happening in your shop this week.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className={card}>
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-deep text-cherry">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                <TrendingUp size={14} aria-hidden="true" />
                {change}
              </span>
            </div>
            <p className="mt-4 font-display text-3xl text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <section className={card} aria-label="Sales this week">
          <h2 className="font-display text-xl text-gray-900">Sales this week</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {week.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className="w-full rounded-t-lg bg-cherry/80 transition-colors hover:bg-cherry"
                  style={{ height: `${(d.sales / max) * 100}%` }}
                  title={`${d.day}: $${d.sales}`}
                />
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={card} aria-label="Low stock">
          <h2 className="flex items-center gap-2 font-display text-xl text-gray-900">
            <AlertTriangle size={18} className="text-amber-600" aria-hidden="true" />
            Low stock
          </h2>
          <ul className="mt-4 divide-y divide-cherry/10">
            {lowStock.map((p) => (
              <li key={p.name} className="flex items-center justify-between py-3 text-sm">
                <span className="text-gray-800">{p.name}</span>
                <span className="font-medium text-amber-700">{p.left} left</span>
              </li>
            ))}
          </ul>
          <Link
            to="/admin/products"
            className="mt-3 inline-flex items-center gap-1 text-sm text-cherry hover:underline"
          >
            Manage products <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      </div>

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
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 font-medium text-gray-900">{o.id}</td>
                  <td className="py-3 text-gray-700">{o.customer}</td>
                  <td className="py-3 text-gray-700">{o.total}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminOverview;