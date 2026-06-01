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
* Shared board access for collaborators
* Dashboard discovery for boards shared with the signed-in user

## Columns & Tasks

* Create, update, and delete columns
* Create, update, move, and delete tasks
* Drag-and-drop task movement
* Cross-column task transfers
* Reordering support

## Realtime Collaboration

* Socket.IO powered synchronization
* JWT-authenticated websocket connections
* Realtime task updates
* Realtime column updates
* Realtime collaborator updates
* Board room subscriptions
* Live collaborative movement animations
* Server-authoritative state with last-write-wins updates
* Version and timestamp tracking on boards, columns, and tasks

## Role-Based Permissions

CollabFlow supports board-level collaborators with backend-enforced permissions.

```txt
OWNER
- Full board access
- Read, write, delete board, and manage collaborators

EDITOR
- View board
- Create, edit, delete, move, and reorder board contents
- Cannot manage collaborators
- Cannot delete the board

VIEWER
- View board only
- Cannot modify board contents
```

Collaborator permissions are enforced in backend services before board, column, task, and collaborator mutations. The UI also reflects the user's role by disabling write controls for viewers.

## Shared Board Navigation

Collaborators do not automatically own or see the workspace that contains a shared board. Instead, shared board access is listed on the dashboard.

To open a board shared with you:

```txt
1. Log in with the collaborator account.
2. Go to /dashboard.
3. Find the board in the Shared boards section.
4. Open it from there.
```

The direct route is:

```txt
/workspace/:workspaceId/board/:boardId
```

The board detail API accepts collaborator access, so a collaborator can open a shared board even if the workspace is not listed under "My Workspaces".

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

The collaboration domain follows the same frontend module pattern under:

```txt
src/modules/collaboration/
```

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

Board socket subscriptions are permission-checked on the backend before a client can join `board:<boardId>`.

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
user:<userId>:workspace-list
```

## Supported Realtime Events

```txt
board / join-board
leave-board
workspace
leave-workspace
workspace-list
leave-workspace-list

board
column
task
collaborator
board:error
workspace:error
```

Event payloads include an `action` field such as:

```txt
created
updated
deleted
moved
reordered
upserted
removed
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
GET    /board/workspace/:workspaceId
GET    /board/shared
POST   /board
GET    /board/:id
PUT    /board/:id
PATCH  /board/:id
DELETE /board/:id
```

`GET /board/shared` returns boards where the authenticated user is an `EDITOR` or `VIEWER` collaborator.

## Collaborators

```txt
GET    /collaboration/board/:boardId
POST   /collaboration/board/:boardId
PATCH  /collaboration/board/:boardId/:userId
DELETE /collaboration/board/:boardId/:userId
```

Only board owners can add, update, or remove collaborators. Collaborators are added by user email with either `EDITOR` or `VIEWER` role.

## Columns

```txt
GET    /column/board/:boardId
POST   /board/:boardId/column
POST   /column
PUT    /column/reorder
PUT    /column/:id
PATCH  /column/:id
DELETE /column/:id
```

## Tasks

```txt
GET    /task/column/:columnId
POST   /column/:columnId/task
POST   /task
GET    /task/:id
PUT    /task/:id
PATCH  /task/:id
DELETE /task/:id
PUT    /task/move
PATCH  /task/:taskId/move
PUT    /task/reorder
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

The collaboration implementation adds:

* `BoardCollaborator`
* `BoardRole`
* `updatedAt` and `version` fields on boards, columns, and tasks

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Migrations

```bash
npx prisma migrate dev
```

For deployed environments, apply migrations with:

```bash
npm run db:migrate
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
