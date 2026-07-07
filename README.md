# @misiki/saleor-connector

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

TypeScript API connector for **[Saleor](https://saleor.io)** — part of the [Litekart](https://litekart.in) connector suite.
Full 43-service surface mirroring [`@misiki/litekart-connector`](https://github.com/misiki-in/litekart-connector).

> **Coverage:** 6/43 services are wired to the live Saleor GraphQL API.
> The rest are present for interface parity and throw `NotSupportedError` (Saleor has no equivalent endpoint).

## Installation

```bash
npm install @misiki/saleor-connector
```

## Configuration

Pass `baseUrl` (full GraphQL endpoint), `accessToken` (App/user JWT — optional for public queries).
API docs: https://docs.saleor.io/api-reference

## Usage

```ts
import { SaleorConnector } from '@misiki/saleor-connector'

const client = new SaleorConnector({
  "baseUrl": "https://store.example.com/graphql/",
  "accessToken": "app_or_user_token"
})

const products = await client.product.list({ take: 10 })
```

## Service coverage

| Service | Status |
| --- | --- |
| `client.product` | ✅ live |
| `client.category` | ✅ live |
| `client.collection` | ✅ live |
| `client.order` | ✅ live |
| `client.coupon` | ⚠️ stub (NotSupported) |
| `client.address` | ⚠️ stub (NotSupported) |
| `client.review` | ⚠️ stub (NotSupported) |
| `client.cart` | ⚠️ stub (NotSupported) |
| `client.country` | ⚠️ stub (NotSupported) |
| `client.state` | ⚠️ stub (NotSupported) |
| `client.currency` | ⚠️ stub (NotSupported) |
| `client.region` | ⚠️ stub (NotSupported) |
| `client.page` | ⚠️ stub (NotSupported) |
| `client.blog` | ⚠️ stub (NotSupported) |
| `client.settings` | ⚠️ stub (NotSupported) |
| `client.store` | ⚠️ stub (NotSupported) |
| `client.paymentMethod` | ⚠️ stub (NotSupported) |
| `client.search` | ✅ live |
| `client.autocomplete` | ⚠️ stub (NotSupported) |
| `client.user` | ✅ live |
| `client.auth` | ⚠️ stub (NotSupported) |
| `client.profile` | ⚠️ stub (NotSupported) |
| `client.wishlist` | ⚠️ stub (NotSupported) |
| `client.vendor` | ⚠️ stub (NotSupported) |
| `client.checkout` | ⚠️ stub (NotSupported) |
| `client.upload` | ⚠️ stub (NotSupported) |
| `client.banner` | ⚠️ stub (NotSupported) |
| `client.chat` | ⚠️ stub (NotSupported) |
| `client.contact` | ⚠️ stub (NotSupported) |
| `client.deal` | ⚠️ stub (NotSupported) |
| `client.demoRequest` | ⚠️ stub (NotSupported) |
| `client.enquiry` | ⚠️ stub (NotSupported) |
| `client.faq` | ⚠️ stub (NotSupported) |
| `client.feedback` | ⚠️ stub (NotSupported) |
| `client.gallery` | ⚠️ stub (NotSupported) |
| `client.home` | ⚠️ stub (NotSupported) |
| `client.init` | ⚠️ stub (NotSupported) |
| `client.meilisearch` | ⚠️ stub (NotSupported) |
| `client.menu` | ⚠️ stub (NotSupported) |
| `client.plugins` | ⚠️ stub (NotSupported) |
| `client.popularSearch` | ⚠️ stub (NotSupported) |
| `client.popularity` | ⚠️ stub (NotSupported) |
| `client.reels` | ⚠️ stub (NotSupported) |

## Development

```bash
bun install && bun run typecheck && bun run build
```

## License

ISC © misiki-in
