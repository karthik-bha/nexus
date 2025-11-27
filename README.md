# Nexus 

A full-stack social platform featuring a **Polylithic architecture** that combines **Spring Boot** for core services and **Node.js/Express** for real-time chat.

> **Note: Initial Load Time**
> The backend runs on Render's Free Tier. Please allow **~60 seconds** for the server to wake up on the first request.

## Quick Login 
| User | Password |
| :--- | :--- |
| `codemon` | `test` |
| `plant_man` | `test` |
| `random user` | `test` |

## Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Vercel
* **Core Backend:** Spring Boot 3, MongoDB Atlas, Docker (Render)
* **Chat Service:** Node.js, Express, Socket.io (Render)
* **Media:** ImageKit.io

## Services
This project is split across three repositories:
* **Core Backend:** [github.com/karthik-bha/nexus-spring-backend](https://github.com/karthik-bha/nexus-spring-backend)
* **Socket Service:** [github.com/karthik-bha/nexus-socket-service](https://github.com/karthik-bha/nexus-socket-service)

## Local Setup
1.  **Clone & Install:** `git clone <repo_url>` then `npm install`
2.  **Configure .env:** Set `VITE_BACKEND_URL` and `VITE_SOCKET_URL`.
3.  **Run:** `npm run dev`