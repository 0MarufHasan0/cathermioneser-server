# Kindora — Backend API

A RESTful backend for the **Kindora** event platform. Built with **Node.js, Express, and MongoDB**, secured with **JWT verification via JWKS**, and deployed as a serverless function on **Vercel**.

<p align="center">
  <a href="https://kindora-backend-five.vercel.app/">
    <img src="https://img.shields.io/badge/Live_API-kindora--backend--five.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live API" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## 🌐 Live API

| Environment | Base URL |
| ----------- | -------- |
| Production  | <https://kindora-backend-five.vercel.app> |

```bash
curl https://kindora-backend-five.vercel.app/
# → Hello World!
```

---

## ✨ Features

- 🔐 **JWT authentication** — verifies bearer tokens against a remote JWKS endpoint using `jose`.
- 📅 **Event management** — create, read, update, and delete Kindora events.
- 🔎 **Filtering & limits** — fetch events by category with an optional result limit.
- 🙋 **Event joining** — users can join events and view their joined events.
- 👤 **Ownership checks** — update/delete actions are scoped to the creator's email.
- 🌍 **CORS enabled** — ready to be consumed by any frontend.
- ⚡ **Serverless deployment** — runs on Vercel with MongoDB Atlas.

---

## 🧰 Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Runtime    | Node.js (ES Modules)                    |
| Framework  | Express 5                               |
| Database   | MongoDB (official `mongodb` driver)     |
| Auth       | JWT + JWKS (`jose`)                     |
| Middleware | `cors`, `express.json`, `dotenv`        |
| Deployment | Vercel (`@vercel/node`)                 |

---

## 📁 Project Structure

```
cathermioneser-server/
├── index.js          # Express app, routes, auth middleware, DB connection
├── package.json      # Scripts and dependencies
├── vercel.json       # Vercel build + routing configuration
├── .env.example      # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/0MarufHasan0/cathermioneser-server.git
cd cathermioneser-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the template and fill in your own values:

```bash
cp .env.example .env
```

| Variable           | Required | Description                                                        |
| ------------------ | :------: | ------------------------------------------------------------------ |
| `MONGODB_BASE_URI` |    ✅    | MongoDB Atlas connection string.                                   |
| `CLIENT_URI`       |    ✅    | Frontend/base URL that exposes `/api/auth/jwks` for token verification. |
| `PORT`             |    ❌    | Local server port (defaults to `8000`).                            |

> **Note:** `CLIENT_URI` is normalized at runtime — trailing slashes are stripped automatically.

### 4. Run locally

```bash
node index.js
```

The API will be available at **<http://localhost:8000>**.

---

## 🔌 API Reference

**Base URL:** `https://kindora-backend-five.vercel.app`

Routes marked 🔒 require an `Authorization: Bearer <token>` header.
The token is verified against `${CLIENT_URI}/api/auth/jwks`.

### Health

| Method | Endpoint | Auth | Description         |
| ------ | -------- | :--: | ------------------- |
| `GET`  | `/`      |  —   | Health check.       |

### Events

| Method   | Endpoint               | Auth | Description                                              |
| -------- | ---------------------- | :--: | -------------------------------------------------------- |
| `POST`   | `/add-kindora`         |  🔒  | Create a new event.                                      |
| `GET`    | `/add-kindora`         |  —   | Get all events.                                          |
| `GET`    | `/events`              |  —   | Get events; supports `?category=` and `?limit=`.         |
| `GET`    | `/kindora/:id`         |  🔒  | Get a single event by ID.                                |
| `PATCH`  | `/kindora/:id`         |  🔒  | Update an event. Body: `{ "email": "...", "updatedData": { ... } }`. |
| `DELETE` | `/kindora/:id`         |  🔒  | Delete an event. Body: `{ "email": "..." }`.             |
| `GET`    | `/my-kindora/:email`   |  🔒  | Get all events created by a specific user.               |

> `/events` is currently a public read endpoint. Every other event route marked 🔒 requires a valid bearer token.

### Event Participation

| Method   | Endpoint                | Auth | Description                                      |
| -------- | ----------------------- | :--: | ------------------------------------------------ |
| `POST`   | `/join-event`           |  🔒  | Join an event.                                   |
| `GET`    | `/joined-event/:email`  |  🔒  | Get all events joined by a specific user.        |
| `DELETE` | `/joined-event/:id`     |  🔒  | Leave/remove a joined event. Body: `{ "email": "..." }`. |

### Example request

```bash
curl -X GET "https://kindora-backend-five.vercel.app/events?category=music&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example response

```json
[
  {
    "_id": "6712f0c9b5e4a12d3c8f9a01",
    "eventType": "music",
    "creatorEmail": "user@example.com",
    "title": "Sunset Concert"
  }
]
```

---

## ☁️ Deployment (Vercel)

This project deploys as a single serverless function via `@vercel/node`.

### One-time setup

```bash
npm i -g vercel
vercel login
vercel link
```

### Add environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (or via CLI):

```bash
vercel env add MONGODB_BASE_URI
vercel env add CLIENT_URI
```

### Deploy to production

```bash
vercel --prod
```

`vercel.json` routes every request to `index.js`, so Express handles all paths.

---

## 🔒 Security Notes

- Never commit your real `.env` file. Use `.env.example` for documentation.
- The MongoDB connection string contains credentials — rotate it immediately if it was ever exposed.
- JWT verification uses the public JWKS endpoint, so no signing secret is stored on this server.
- Update/delete routes verify the requester's email against the record's owner field.

---

## 📄 License

This project is provided for educational and personal use.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/0MarufHasan0">MD. Maruf Hasan</a>
</p>
