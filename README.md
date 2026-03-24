# XIVTracker

A frameless Electron desktop companion app for Final Fantasy XIV. Connects to a Dalamud plugin running inside the game process and displays real-time game state — current job, location, gil, time, XP, and player name — in a lightweight overlay window.

---

## Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript + Vite + Tailwind CSS v4 |
| Desktop | Electron (frameless, `frame: false`), packaged with `electron-forge` |
| State | Zustand |
| Storage | `lowdb` (JSON file) |
| Plugin comms | JSON-RPC over WebSocket (`ws://localhost:50085`) |

---

## Architecture

```
Dalamud plugin (C#)
    ↕ JSON-RPC WebSocket (port 50085)
Electron main process
    ↕ Electron IPC (ipc-ask: / ipc-recv:)
React renderer
```

**Main process** (`electron/`) wires together three subsystems:
- **`JsonRpcClient`** — WebSocket client to the Dalamud plugin. Handles request/response (`request()`) and push notifications (`on()`).
- **`EventManager`** — registers `ipcMain.handle` listeners for renderer requests and forwards Dalamud push events to the renderer via `win.webContents.send`.
- **`EzDb`** — local JSON database via `lowdb` (recipes, favorites, recent searches).

**Renderer** (`ui/`) has no Electron-specific code. A Zustand store holds all game state. On mount, `init()` is called which:
1. Calls `createInitActions` — fires all data-fetch IPC requests in parallel to populate initial state.
2. Calls `createListeners` — registers `ipcRenderer.on` handlers for push events from main.

**IPC event naming convention:**
- `ipc-ask:*` — renderer → main request/response (via `ipcRenderer.invoke`)
- `ipc-recv:*` — main → renderer push (via `win.webContents.send`)

---

## Project Structure

```
electron/
  main.ts                    # Entry point
  app.ts                     # XIVTrackerApp — wires JsonRpcClient, EzDb, EventManager
  preload.ts                 # Exposes ipcRenderer to renderer via contextBridge
  libs/
    net/JsonRpcClient.ts     # JSON-RPC WebSocket client
    db/EzDb.ts               # lowdb JSON database
    events/
      EventManager.ts        # Registers all IPC and WebSocket handlers
      domains/               # Per-domain handler definitions (jobs, currency, location, ...)
      types.ts               # IPCEvent and DomainHandlers types
ui/
  src/
    store/
      store.ts               # Zustand store + init()
      listeners.ts           # createInitActions + createListeners
      actions/               # Per-domain IPC action classes
    components/              # JobDisplay, LocationDisplay, GilDisplay, etc.
    layout/                  # Frame, Header, Body
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- The Dalamud plugin (`xivsocket/`) loaded in-game — **or** the emulator (see below)

---

## Install

```bash
cd xivelectron
npm install
```

---

## Development

Start the full Electron app with hot reload (renderer HMR + main process restart on change):

```bash
npm run dev
```

This uses `vite-plugin-electron` — Vite builds the main process and starts Electron automatically.

### Without the game (emulator)

A local WebSocket emulator lives in `../xivemulator/` that simulates the Dalamud plugin with randomised game data and periodic push events.

```bash
cd ../xivemulator
npm install
npm run dev
```

Start the emulator **before** launching the Electron app. It listens on `ws://localhost:50085`.

---

## Build & Package

```bash
# Type-check + Vite build + electron-builder
npm run build

# Package x64 installer via electron-forge
npm run make
```

---

## Other Commands

```bash
npm run lint          # ESLint
npx vitest run        # Run tests once
npx vitest            # Run tests in watch mode
```

Tests live in `tests/`. There is no `npm test` script.

---

## Connecting to Dalamud

The app connects to `ws://localhost:50085` on startup and retries every 2 seconds if unavailable. The Dalamud plugin (`xivsocket/`) must be loaded via the Dalamud plugin installer inside FFXIV. Once both are running the app populates automatically — no manual connection step required.
