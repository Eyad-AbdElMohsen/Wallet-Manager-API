# Wallet Manager API

This API powers the Wallet Manager application, enabling secure wallet management, transaction handling, and authentication.


## 📖 API Docs  

🔗 **Explore the magic:** [Swagger Playground](https://wallet-manager-api-production.up.railway.app/api-docs/) 🚀  

---

## Authentication, Authorization, and Security

- The API uses **Google OAuth** for **authentication**.
- Protected routes require an **access token** in the headers.
- A **refresh token** is available to renew expired access tokens.

### Access Control
- Middleware ensures users can only access their **own wallets and transactions**.
- Unauthorized access attempts return appropriate error responses.

### Error Handling
- The API implements a **centralized error handling system** to provide clear and meaningful error messages.
  
---

## API Features

This API includes advanced features for efficient data querying and filtering.

### Filtering, Sorting, and Pagination

- **Filtering:** Supports operators like `gte`, `gt`, `lte`, and `lt` for precise queries.
- **Sorting:** Allows sorting by any field, with `-createdAt` as the default.
- **Pagination:** Enables page-based results with configurable `limit` control.
- **Field Selection:** Allows selecting specific fields to optimize responses.

---

## Installation & Setup

To run the API locally:

```sh
git clone https://github.com/Eyad-AbdElMohsen/Wallet-Manager-API.git
cd Wallet-Manager-API
npm install
```

### Scripts

The project includes several useful scripts for development, testing, and production.

### **Available Commands**

```sh
npm run build    # Compile TypeScript to JavaScript and remove old builds
npm run start    # Run the compiled JavaScript application (Production)
npm run serve    # Start the development server with Nodemon (Auto-restart on changes)
npm run test     # Run tests with Jest and generate a coverage report
```



