# Cherry Cheeks student JSON data

These are fictional sample records for a cosmetics shop. Students can fetch the JSON files without starting Java, Spring Boot, or a database. Each file contains a JSON array. The files are read-only; editing a cart or invoice in a browser will not save changes.

| File | Contents |
| --- | --- |
| `categories.json` | Product categories |
| `products.json` | Products and prices |
| `accounts.json` | Fictional customers and staff; no passwords or tokens |
| `carts.json` | Current customer carts |
| `invoices.json` | Customer sales invoices, line items, and payments |
| `suppliers.json` | Product suppliers |
| `stock-receipts.json` | Supplier invoices and received stock |

## Use in a React frontend

Copy this entire `student-data` folder into your React project's `public` folder. The result should look like `public/student-data/products.json`. In a React component or data module, fetch a file like this:

```js
const response = await fetch('/student-data/products.json');
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const products = await response.json();
console.log(products);
```

Use the same path pattern for `categories.json`, `accounts.json`, `carts.json`, `invoices.json`, `suppliers.json`, and `stock-receipts.json`. When the React development server is running, you can also open `/student-data/invoices.json` in the browser to check the data.

You can use these files without copying them by serving this project folder for a quick preview:

```bash
python3 -m http.server 8000
```

That preview exposes the files at `http://localhost:8000/student-data/invoices.json`. For students on other machines, give them the files or publish them on a static host. `localhost` refers only to the computer running the browser.

## Relationships

The `id` fields are stable sample IDs. `products.categoryId` points to `categories.id`. Cart and invoice item `productId` values point to `products.id`. `carts.customerId`, `invoices.customerId`, `invoices.createdByAccountId`, `invoices.cashierId`, and `stock-receipts.actorId` point to `accounts.id`. A `null` invoice `customerId` means a walk-in customer. `stock-receipts.supplierId` points to `suppliers.id`.

`createdByAccountId` identifies who created a customer invoice. `cashierId` identifies who took payment; invoice `00325` illustrates that these can be different people.

## Invoice number exercise

Customer invoice numbers follow `INV-YYYYMMDD-NNNNN`, where the final five digits are a sequence across dates. The sample intentionally skips sequence `00324`: it contains `00323` and `00325`, but no `00324`. The corresponding number would be missing, but its date cannot be determined from the sequence alone. The numeric `id` in this sample matches the suffix for convenience; use `invoiceNumber` for the exercise.

All prices and amounts are in USD. These records are independent of the live Spring Boot database and do not update when the backend changes.
