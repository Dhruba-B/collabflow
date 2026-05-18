# CollabFlow

A modern realtime collaborative project management platform inspired by Linear, Notion, and modern multiplayer productivity tools.

CollabFlow enables teams to collaborate through realtime workspaces, boards, columns, and tasks with smooth drag-and-drop interactions, live synchronization, and a premium SaaS-style experience.

---

# Features

## Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Persistent auth sessions

## Workspaces

* Create and manage collaborative workspaces
* Workspace overview dashboard
* Workspace activity insights
* Workspace-specific board organization

## Boards

* Create boards inside workspaces
* Realtime collaborative board updates
* Dynamic kanban-style layout
* Board-specific websocket rooms

## Columns & Tasks

* Create, update, and delete columns
* Create, update, move, and delete tasks
* Drag-and-drop task movement
* Cross-column task transfers
* Reordering support

## Realtime Collaboration

* Socket.IO powered synchronization
* Realtime task updates
* Realtime column updates
* Board room subscriptions
* Live collaborative movement animations

## UI/UX

* Modern collaborative SaaS design
* Light/Dark mode support
* Smooth layout animations
* Responsive/mobile-friendly experience
* Custom MUI theme system
* Centralized snackbar notification system

---

# Tech Stack

## Frontend

* React
* Vite
* MUI (Material UI)
* Zustand
* TanStack Query
* Socket.IO Client
* dnd-kit
* Framer Motion
* date-fns

## Backend

* Node.js
* Express
* Prisma
* PostgreSQL
* Socket.IO
* JWT Authentication

---

# Architecture

## Frontend Structure

```txt
src/
 ├── app/
 │    ├── router.jsx
 │    ├── providers.jsx
 │
 ├── pages/
 │    ├── auth/
 │    ├── dashboard/
 │    ├── workspace/
 │    └── board/
 │
 ├── modules/
 │    ├── auth/
 │    ├── workspace/
 │    ├── board/
 │    ├── column/
 │    └── task/
 │
 ├── components/
 │
 ├── services/
 │    ├── api/
 │    └── socket/
 │
 ├── store/
 │
 ├── hooks/
 │
 ├── layouts/
 │
 └── utils/
```

---

# Frontend Architecture Principles

## Modular Domain Structure

Each domain contains:

```txt
module/
 ├── api.js
 ├── hooks.js
 ├── keys.js
 └── components/
```

## TanStack Query

Used for:

* server state
* caching
* synchronization
* optimistic updates
* invalidation

## Zustand

Used only for:

* UI state
* theme state
* snackbar state
* temporary interaction state

## Realtime Strategy

Socket events flow through:

```txt
Socket Event
    ↓
TanStack Cache Invalidation
    ↓
Refetch
    ↓
UI Update
```

---

# Routing Structure

```txt
/
/login
/register
/dashboard
/workspace/:workspaceId
/workspace/:workspaceId/board/:boardId
```

---

# Realtime Architecture

## Socket Rooms

```txt
workspace:<workspaceId>
board:<boardId>
```

## Supported Realtime Events

```txt
board:join
board:leave

column:created
column:updated
column:deleted

task:created
task:updated
task:moved
task:deleted
```

---

# Drag & Drop

Implemented using:

* dnd-kit
* sortable contexts
* nested drag architecture
* optimistic UI updates
* realtime synchronization compatibility

Supports:

* column reordering
* task reordering
* cross-column movement
* mobile-friendly drag interactions

---

# Theme System

## Brand Colors

```txt
Primary: #E84855
Highlight: #FFFD82
```

## Fonts

* Geist
* Geist Mono

## Features

* Light mode
* Dark mode
* Responsive layouts
* Modern productivity styling

---

# API Structure

## Workspaces

```txt
GET    /workspace
POST   /workspace
GET    /workspace/:workspaceId
```

## Boards

```txt
GET    /workspace/:workspaceId/boards
POST   /workspace/:workspaceId/boards
GET    /board/:boardId
```

## Columns

```txt
POST   /board/:boardId/columns
PATCH  /column/:columnId
DELETE /column/:columnId
PATCH  /column/:columnId/reorder
```

## Tasks

```txt
POST   /column/:columnId/tasks
PATCH  /task/:taskId
DELETE /task/:taskId
PATCH  /task/:taskId/move
PATCH  /task/:taskId/reorder
```

---

# Getting Started

## Clone Repository

```bash
git clone <repo-url>
cd collabflow
```

---

# Frontend Setup

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Backend Setup

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create:

```txt
.env
```

Example:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

# Prisma Setup

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Migrations

```bash
npx prisma migrate dev
```

---

# Start Backend

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Mobile Support

CollabFlow includes:

* responsive layouts
* touch-optimized drag-and-drop
* mobile-friendly interactions
* smooth horizontal board scrolling
* adaptive drag sensors

---

# Future Roadmap

## Collaboration

* live cursors
* typing indicators
* collaborative editing
* activity feed
* presence tracking

## Productivity

* due dates
* labels
* comments
* attachments
* notifications
* calendar integration

## Scaling

* Redis pub/sub
* horizontal websocket scaling
* queue-based activity processing
* analytics
* monitoring

---

# Deployment Goals

Planned production architecture:

* Dockerized services
* PostgreSQL hosting
* Nginx reverse proxy
* Redis for socket scaling
* CI/CD pipelines
* scalable websocket infrastructure
* production monitoring/logging

---

# Design Philosophy

CollabFlow is designed around:

* realtime collaboration
* modular architecture
* scalable frontend systems
* modern SaaS UX
* smooth interaction design
* production-grade patterns

The project emphasizes:

* clean architecture
* reusable systems
* predictable state management
* scalable realtime synchronization
* premium collaborative experience

---

<!-- # Screenshots

Add screenshots here:

```txt
/docs/screenshots
```

Recommended:

* Login page
* Dashboard
* Workspace page
* Board page
* Mobile views
* Drag-and-drop interactions
* Realtime sync examples

--- -->

# Demo

```txt
Frontend: https://collabflow-cyan.vercel.app/
Backend: https://collabflow-luhs.onrender.com
```

---

# Author

Built by Dhrubashis Basak.
