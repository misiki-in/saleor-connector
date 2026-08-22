# @misiki/saleor-connector

[![NPM Version](https://img.shields.io/npm/v/@misiki/saleor-connector.svg)](https://www.npmjs.com/package/@misiki/saleor-connector)
[![License](https://img.shields.io/npm/l/@misiki/saleor-connector.svg)](https://github.com/misiki-in/saleor-connector/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**The Official TypeScript API Connector for connecting `svelte-commerce` to Saleor E-Commerce Backend.**

`@misiki/saleor-connector` provides a production-ready, fully-typed API client and integration layer that seamlessly bridges [svelte-commerce](https://github.com/misiki-in/svelte-commerce) storefronts with [Saleor](https://saleor.io) headless e-commerce backends — part of the [Litekart](https://litekart.in) connector suite, mirroring the full 43-service surface of [`@misiki/litekart-connector`](https://github.com/misiki-in/litekart-connector).

> **Coverage:** 40 of 43 services are wired to the live Saleor API.
> The remaining 3 have no Saleor equivalent and return empty placeholder
> data. Each placeholder says why in a comment at the top of its service file.

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

## Service coverage

| Service | Status |
| --- | --- |
| `client.product` | ✅ live |
| `client.category` | ✅ live |
| `client.collection` | ✅ live |
| `client.order` | ✅ live |
| `client.coupon` | ⚠️ placeholder (no Saleor equivalent) |
| `client.address` | ✅ live |
| `client.review` | ✅ live |
| `client.cart` | ✅ live |
| `client.country` | ✅ live |
| `client.state` | ✅ live |
| `client.currency` | ✅ live |
| `client.region` | ✅ live |
| `client.page` | ⚠️ placeholder (no Saleor equivalent) |
| `client.blog` | ✅ live |
| `client.settings` | ✅ live |
| `client.store` | ✅ live |
| `client.paymentMethod` | ✅ live |
| `client.search` | ✅ live |
| `client.autocomplete` | ✅ live |
| `client.user` | ✅ live |
| `client.auth` | ✅ live |
| `client.profile` | ✅ live |
| `client.wishlist` | ✅ live |
| `client.vendor` | ✅ live |
| `client.checkout` | ✅ live |
| `client.upload` | ✅ live |
| `client.banner` | ✅ live |
| `client.chat` | ✅ live |
| `client.contact` | ✅ live |
| `client.deal` | ✅ live |
| `client.demoRequest` | ✅ live |
| `client.enquiry` | ✅ live |
| `client.faq` | ✅ live |
| `client.feedback` | ✅ live |
| `client.gallery` | ✅ live |
| `client.home` | ✅ live |
| `client.init` | ✅ live |
| `client.meilisearch` | ✅ live |
| `client.menu` | ✅ live |
| `client.plugins` | ✅ live |
| `client.popularSearch` | ✅ live |
| `client.popularity` | ⚠️ placeholder (no Saleor equivalent) |
| `client.reels` | ✅ live |

## Development

```bash
bun install && bun run build
```

## License

MIT © misiki-in
