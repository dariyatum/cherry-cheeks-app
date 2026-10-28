import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";

// Change these names to match accounts.json
const fields = {
  id: "id",
  name: "fullName",
  email: "email",
  phone: "phone",
  role: "role",
  status: "active",
};

// Only accounts with this role are shown as customers.
// Set to null if accounts.json has no role field.
const CUSTOMER_ROLE = null;

const card = "rounded-2xl border border-cherry/10 bg-white p-6";

function AdminCustomers() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/student-data/accounts.json");
        if (!response.ok) throw new Error("Could not load customers");
        const data = await response.json();
        setAccounts(Array.isArray(data) ? data : data.accounts ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const customers = useMemo(() => {
    const onlyCustomers = CUSTOMER_ROLE
      ? accounts.filter((a) => a[fields.role] === CUSTOMER_ROLE)
      : accounts;

    const q = query.trim().toLowerCase();
    if (!q) return onlyCustomers;

    return onlyCustomers.filter((a) =>
      `${a[fields.name] ?? ""} ${a[fields.email] ?? ""}`.toLowerCase().includes(q)
    );
  }, [accounts, query]);

  if (loading) return <p className="text-gray-600">Loading customers...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-gray-900 sm:text-4xl">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {customers.length} customer{customers.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            size={18}
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            aria-label="Search customers"
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-cherry focus:ring-2 focus:ring-cherry/30"
          />
        </div>
      </div>

      <section className={card} aria-label="Customer list">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-gray-500">
            <Users size={28} aria-hidden="true" />
            <p>No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-cherry/10 text-xs uppercase tracking-wider text-gray-500">
                  <th scope="col" className="py-3 font-medium">Customer</th>
                  <th scope="col" className="py-3 font-medium">Email</th>
                  <th scope="col" className="py-3 font-medium">Phone</th>
                  <th scope="col" className="py-3 font-medium">Status</th>
                  <th scope="col" className="py-3 font-medium">Role</th>
                
                </tr>
              </thead>
              <tbody className="divide-y divide-cherry/10">
                {customers.map((c, i) => {
                  const name = c[fields.name] ?? "Unknown";
                  const active = c[fields.status] !== false;

                  return (
                    <tr key={c[fields.id] ?? i}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-deep text-sm font-semibold text-cherry">
                            {name.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium text-gray-900">{name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-700">{c[fields.email] ?? "-"}</td>
                      <td className="py-3 text-gray-700">{c[fields.phone] ?? "-"}</td>
                      
                      <td className="py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {active ? "Active" : "Inactive"}
                          
                        </span>
                        
                      </td>
                      <td className="py-3 text-gray-700">{c[fields.role] ?? "-"}</td>
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

export default AdminCustomers;