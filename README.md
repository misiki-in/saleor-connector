# @misiki/saleor-connector

[![NPM Version](https://img.shields.io/npm/v/@misiki/saleor-connector.svg)](https://www.npmjs.com/package/@misiki/saleor-connector)
[![License](https://img.shields.io/npm/l/@misiki/saleor-connector.svg)](https://github.com/misiki/saleor-connector/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**The Official TypeScript API Connector for connecting `svelte-commerce` to Saleor E-Commerce Backend.**

`@misiki/saleor-connector` provides a production-ready, fully-typed API client and integration layer that seamlessly bridges [svelte-commerce](https://github.com/misiki/svelte-commerce) storefronts with [Saleor](https://saleor.io/) headless e-commerce backends.

---

## 🚀 Step-by-Step Integration Guide

Follow these steps to connect `svelte-commerce` with `saleor-connector` and your Saleor backend.

### 1. Install the Connector

Inside your `svelte-commerce` project directory, run:

```bash
bun i @misiki/saleor-connector
```

*(Or using npm / pnpm / yarn):*
```bash
npm install @misiki/saleor-connector
# or
pnpm add @misiki/saleor-connector
```

### 2. Configure `kitcommerce.config.ts`

In `svelte-commerce`, open `kitcommerce.config.ts` and change the `export *` line to import from `@misiki/saleor-connector`:

```typescript
// kitcommerce.config.ts
export * from '@misiki/saleor-connector';
```

### 3. Environment Variables Setup

Add the required environment variables in your `svelte-commerce` `.env` file:

```env
PUBLIC_SALEOR_API_URL=https://your-saleor-domain.com/graphql/
PUBLISHABLE_API_URL=http://localhost:5173
```

### 4. Obtaining Environment Settings & Configuring Saleor Admin

To get the necessary API configurations and properly configure your Saleor backend:

1. **Log into Saleor Dashboard**:
   - Access your Saleor dashboard (e.g. `https://your-saleor-domain.com/dashboard/` or Saleor Cloud dashboard).
2. **Verify & Copy GraphQL API Endpoint**:
   - Obtain your Saleor GraphQL API endpoint URL (e.g. `https://your-saleor-domain.com/graphql/`).
   - Set this URL as the value for `PUBLIC_SALEOR_API_URL` in your `.env` file.
3. **Configure Required Settings in Saleor Dashboard**:
   - **Email Confirmation**: Ensure **Require email confirmation link for User Registration** is set to `false`.
   - **Phone Requirement**: Ensure **isPhoneMandatory** is set to `false`.
   - **Order Settings**: Enable **Allow unpaid orders** in Order Settings.
   - **Channel Settings**: Enable **Allow unpaid orders** in Channel Settings.

### 5. Build and Run the Project

Run the development server in `svelte-commerce`:

```bash
bun dev
```

To build and run the production application:

```bash
# Build the project
bun run build

# Preview the built application
bun run preview
```
