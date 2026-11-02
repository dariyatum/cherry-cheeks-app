import { useEffect, useMemo, useState } from "react";
import { Search, Users, Plus, Pencil, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

// Change these names to match accounts.json
const fields = {
  id: "id",
  name: "fullName",
  email: "email",
  phone: "phone",
  role: "role",
  status: "active",
};

// Only accounts with this role are shown. Set to null to show everyone.
const CUSTOMER_ROLE = null;

const card = "rounded-2xl border border-cherry/10 bg-white p-6";
const input =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-cherry focus:ring-2 focus:ring-cherry/30";
const iconBtn =
  "rounded-full p-2 text-gray-600 transition-colors hover:bg-cherry/10 hover:text-cherry focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry";

function CustomerForm({ initial, roles, accounts, onSave, onCancel }) {
  const [name, setName] = useState(initial?.[fields.name] ?? "");
  const [email, setEmail] = useState(initial?.[fields.email] ?? "");
  const [phone, setPhone] = useState(initial?.[fields.phone] ?? "");
  const [role, setRole] = useState(initial?.[fields.role] ?? roles[0]);
  const [active, setActive] = useState(initial?.[fields.status] !== false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const duplicate = accounts.some(
      (a) =>
        a[fields.id] !== initial?.[fields.id] &&
        String(a[fields.email]).toLowerCase() === email.trim().toLowerCase()
    );
    if (duplicate) {
      setError("This email is already used by another account.");
      return;
    }

    onSave({
      [fields.name]: name.trim(),
      [fields.email]: email.trim(),
      [fields.phone]: phone.trim(),
      [fields.role]: role,
      [fields.status]: active,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="c-name" className="mb-1 block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} className={input} />
      </div>

      <div>
        <label htmlFor="c-email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="c-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className={input}
        />
      </div>

      <div>
        <label htmlFor="c-phone" className="mb-1 block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={input} />
      </div>

      <div>
        <label htmlFor="c-role" className="mb-1 block text-sm font-medium text-gray-700">
          Role
        </label>
        <select id="c-role" value={role} onChange={(e) => setRole(e.target.value)} className={input}>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4 accent-[#8b3a55]"
        />
        Active account
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" arrow={false} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" arrow={false}>
          Save
        </Button>
      </div>
    </form>
  );
}

function AdminCustomers() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null, "new", or an account
  const [deleting, setDeleting] = useState(null); // null or an account
  const [notice, setNotice] = useState("");

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

  // Hide the success message after 3 seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const roles = useMemo(() => {
    const found = [...new Set(accounts.map((a) => a[fields.role]).filter(Boolean))];
    return found.length > 0 ? found : ["CUSTOMER", "ADMIN"];
  }, [accounts]);

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

  const handleSave = (values) => {
    if (editing === "new") {
      const nextId =
        accounts.reduce((max, a) => Math.max(max, Number(a[fields.id]) || 0), 0) + 1;
      setAccounts((prev) => [{ [fields.id]: nextId, ...values }, ...prev]);
      setNotice("Customer added.");
    } else {
      setAccounts((prev) =>
        prev.map((a) =>
          a[fields.id] === editing[fields.id] ? { ...a, ...values } : a
        )
      );
      setNotice("Customer updated.");
    }
    setEditing(null);
  };

  const handleDelete = () => {
    setAccounts((prev) => prev.filter((a) => a[fields.id] !== deleting[fields.id]));
    setDeleting(null);
    setNotice("Customer deleted.");
  };

  if (loading) return <p className="text-gray-600">Loading customers...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl text-gray-900 sm:text-4xl">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {customers.length} customer{customers.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
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

          <Button arrow={false} onClick={() => setEditing("new")}>
            <Plus size={18} aria-hidden="true" />
            Add customer
          </Button>
        </div>
      </div>

      <p role="status" className="min-h-5 text-sm font-medium text-green-700">
        {notice}
      </p>

      <section className={card} aria-label="Customer list">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-gray-500">
            <Users size={28} aria-hidden="true" />
            <p>No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-cherry/10 text-xs uppercase tracking-wider text-gray-500">
                  <th scope="col" className="py-3 font-medium">Customer</th>
                  <th scope="col" className="py-3 font-medium">Email</th>
                  <th scope="col" className="py-3 font-medium">Phone</th>
                  <th scope="col" className="py-3 font-medium">Status</th>
                  <th scope="col" className="py-3 font-medium">Role</th>
                  <th scope="col" className="py-3 text-right font-medium">Actions</th>
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
                      <td className="py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditing(c)}
                            aria-label={`Edit ${name}`}
                            className={iconBtn}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setDeleting(c)}
                            aria-label={`Delete ${name}`}
                            className={iconBtn}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add / Edit modal */}
      <Modal
        open={editing !== null}
        title={editing === "new" ? "Add customer" : "Edit customer"}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <CustomerForm
            initial={editing === "new" ? null : editing}
            roles={roles}
            accounts={accounts}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={deleting !== null}
        title="Delete customer?"
        onClose={() => setDeleting(null)}
      >
        <p className="text-sm text-gray-600">
          You are about to delete{" "}
          <span className="font-medium text-gray-900">
            {deleting?.[fields.name]}
          </span>
          . This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" arrow={false} onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 text-base text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminCustomers;