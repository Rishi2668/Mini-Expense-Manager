## Mini Expense Manager

Simple full‑stack app to track expenses, auto‑categorize them by vendor, detect anomalies, and show a small dashboard.

### Setup Instructions

- **Backend**
  - **Prerequisites**: Java 17+, PostgreSQL.
  - Create the database:
    ```sql
    CREATE DATABASE expense_db;
    ```
  - Check and update DB username/password in `backend/src/main/resources/application.properties` if needed.
  - From the `backend` folder run:
    ```bash
    mvn spring-boot:run
    ```
  - Backend runs at `http://localhost:8080`.

- **Frontend**
  - **Prerequisites**: Node.js (LTS), npm.
  - Go to `Mini-Expense-Manager-main` and install dependencies:
    ```bash
    npm install
    ```
  - Start the dev server:
    ```bash
    npm run dev
    ```
  - Frontend runs at `http://localhost:5173` and talks to the backend on port `8080`.

### Technologies Used

- **Backend**: Java, Spring Boot (Web, Spring Data JPA), PostgreSQL, Maven.  
- **Frontend**: React, TypeScript, Vite, Axios, Material UI + simple CSS.  
- **Data**: REST JSON APIs and CSV file upload for bulk expenses.

### Assumptions

- Single logical user, no login or multi‑tenant support.
- CSV has a header and at least 4 columns: `date,amount,vendorName,description`.
- Date format is `yyyy-MM-dd` and amounts are valid numbers.
- Vendor names are alphanumeric (spaces allowed); descriptions are taken as‑is.
- CORS is opened for the React dev server on `http://localhost:5173`.

### Short Design Note (Rule Logic, CSV, Exceptions, Data Model)
- The main data model is small on purpose: `Expense` stores date, amount, vendor name, description, derived category, and `isAnomaly`, while `VendorCategory` only maps vendor to category to keep rule management simple. 
- Rule‑based categorization is done in the backend by looking up the `vendorName` in a `VendorCategory` table; if no match is found the expense is labeled `"Others"` by default.  
- Anomaly detection is simple: for each category the service calculates an average of existing expenses, and marks a new expense as anomalous if its amount is more than 3× that category’s average (no anomalies are raised when there is no historical data).  
 
- Trade‑offs: rules are hard‑coded to a basic vendor→category mapping and a fixed anomaly threshold (3× average), we do not handle complex CSV cases (quoted fields, commas inside descriptions), and we skipped auth and multi‑user features to keep the implementation focused and easy to run.
- The upload flow collects all valid rows and then reuses the same save logic as the single‑expense API, so categorization and anomaly rules stay consistent for manual and CSV imports.  

- Validation and parsing errors (like missing fields, bad date or amount, or non‑alphanumeric vendor names) throw `IllegalArgumentException`, which is caught by a global `@RestControllerAdvice` and returned to the frontend as a simple JSON `{ "message": "..." }` for user‑friendly error toasts.  
