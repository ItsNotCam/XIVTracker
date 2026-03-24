# IPC Event Naming Refactor + Startup Init Fix

## Why

Two problems to fix together:

**1. Naming confusion**
`ask:` and `recv:` prefixes echo the WebSocket layer's own concepts (`wsClient.ask()`, `wsClient.on()`), making it ambiguous whether a string belongs to IPC or WebSocket. Renaming to `ipc-ask:` / `ipc-recv:` makes the transport explicit at a glance.

**2. Structural bugs in the renderer store**
- `global:init` is called via `ipcInvoke` but has no `ipcMain.handle` on the main side — it hangs forever, so initial data never loads
- `ask:currency.get`, `ask:name.get`, `ask:connection.isConnected` are registered as push listeners via `ipc().on()` — dead code, `ask:*` events are request-response and never pushed from main
- `app.ts` sends `"connection.changed"` (no prefix) but the renderer listens for `"recv:connection.changed"` — connection state is never received

---

## Rename Map

| Old | New |
|---|---|
| `ask:job.getMain` | `ipc-ask:job.getMain` |
| `ask:job.getCurrent` | `ipc-ask:job.getCurrent` |
| `ask:job.getAll` | `ipc-ask:job.getAll` |
| `ask:currency.get` | `ipc-ask:currency.get` |
| `ask:connection.isConnected` | `ipc-ask:connection.isConnected` |
| `ask:location.getAll` | `ipc-ask:location.getAll` |
| `ask:time.get` | `ipc-ask:time.get` |
| `ask:name.get` | `ipc-ask:name.get` |
| `ipc:recipe.get` | `ipc-ask:recipe.get` |
| `ipc:recipe.getRecentSearches` | `ipc-ask:recipe.getRecentSearches` |
| `ipc:recipe.getFavorites` | `ipc-ask:recipe.getFavorites` |
| `ipc:recipe.isFavorite` | `ipc-ask:recipe.isFavorite` |
| `ipc:recipe.toggleFavorite` | `ipc-ask:recipe.toggleFavorite` |
| `recv:location.changed` | `ipc-recv:location.changed` |
| `recv:location.positionChanged` | `ipc-recv:location.positionChanged` |
| `recv:location.areaChanged` | `ipc-recv:location.areaChanged` |
| `recv:location.territoryChanged` | `ipc-recv:location.territoryChanged` |
| `recv:location.regionChanged` | `ipc-recv:location.regionChanged` |
| `recv:location.subAreaChanged` | `ipc-recv:location.subAreaChanged` |
| `recv:job.changed` | `ipc-recv:job.changed` |
| `recv:loggedIn` | `ipc-recv:loggedIn` |
| `recv:loggedOut` | `ipc-recv:loggedOut` |
| `recv:currency.changed` | `ipc-recv:currency.changed` |
| `recv:name.changed` | `ipc-recv:name.changed` |
| `recv:time.changed` | `ipc-recv:time.changed` |
| `connection.changed` *(app.ts — no prefix)* | `ipc-recv:connection.changed` |
| `global:init` | **removed entirely** |

---

## Structural Fix: Split the Listener Map

`ui/src/store/listeners.ts` currently puts both "startup calls" and "push event handlers" in the same `ListenerMap`, which is wrong — they are different things.

### Add `createInitActions` to `listeners.ts`

A plain array of async functions called once at app startup. No IPC event names involved.

```ts
export type InitAction = () => Promise<void>;

export const createInitActions = (
    get: StoreApi<Store>['getState'],
    set: StoreApi<Store>['setState']
): InitAction[] => {
    const currencyActions = new CurrencyActions(get, set);
    const timeActions = new TimeActions(get, set);
    const connectionActions = new ConnectionActions(get, set);
    const jobActions = new JobActions(get, set);
    const userActions = new UserActions(get, set);
    const locationActions = new LocationActions(get, set);
    return [
        currencyActions.askGil,
        timeActions.askWorldTime,
        connectionActions.askConnectionStatus,
        jobActions.askJobInfo,
        jobActions.askJobs,
        userActions.askName,
        locationActions.askLocation,
    ];
};
```

### Clean `createListeners` — only real push events

Remove these keys entirely:
- `'global:init'` — was never a real IPC event
- `'ask:currency.get'` — dead, `ask:*` are never pushed from main
- `'ask:name.get'` — dead
- `'ask:connection.isConnected'` — dead

Keep all `ipc-recv:*` entries (renamed).

### Fix `store.ts` — replace the broken invoke

```ts
// Remove:
ipcInvoke("global:init").then(() => set({ isInitialized: true }))

// Replace with:
const initActions = createInitActions(get, set);
Promise.all(initActions.map(action => action()))
    .then(() => set({ isInitialized: true }))
    .catch((e) => console.error("[init] Startup actions failed:", e));
```

Remove the `ipcInvoke` import from `store.ts` — it is no longer used there.

---

## Files to Modify

### Main process

| File | Change |
|---|---|
| `electron/libs/events/ipc-event-types.ts` | Rename all strings; remove `global:init` from union |
| `electron/app.ts` | `"connection.changed"` → `"ipc-recv:connection.changed"` |
| `electron/libs/events/ask/AskJobEvents.ts` | `ask:job.*` → `ipc-ask:job.*` |
| `electron/libs/events/ask/AskCurrencyEvents.ts` | `ask:currency.get` → `ipc-ask:currency.get` |
| `electron/libs/events/ask/AskConnectionEvents.ts` | `ask:connection.isConnected` → `ipc-ask:connection.isConnected` |
| `electron/libs/events/ask/AskLocationEvents.ts` | `ask:location.getAll` → `ipc-ask:location.getAll` |
| `electron/libs/events/ask/AskTimeEvents.ts` | `ask:time.get` → `ipc-ask:time.get` |
| `electron/libs/events/ask/AskNameEvents.ts` | `ask:name.get` → `ipc-ask:name.get` |
| `electron/libs/events/ask/AskRecipeEvents.ts` | `ipc:recipe.*` → `ipc-ask:recipe.*` |
| `electron/libs/events/recv/jobs/RecvJobCurrentEvent.ts` | `recv:job.changed` → `ipc-recv:job.changed` |
| `electron/libs/events/recv/jobs/RecvJobMainEvent.ts` | `recv:job.changed` → `ipc-recv:job.changed` |
| `electron/libs/events/recv/jobs/RecvJobAllEvent.ts` | `recv:job.changed` → `ipc-recv:job.changed` |
| `electron/libs/events/recv/location/RecvLocationEventAll.ts` | `recv:location.changed` → `ipc-recv:location.changed` |
| `electron/libs/events/recv/location/RecvLocationEventPosition.ts` | `recv:location.positionChanged` → `ipc-recv:location.positionChanged` |
| `electron/libs/events/recv/location/RecvLocationEventArea.ts` | `recv:location.areaChanged` → `ipc-recv:location.areaChanged` |
| `electron/libs/events/recv/location/RecvLocationEventTerritory.ts` | `recv:location.territoryChanged` → `ipc-recv:location.territoryChanged` |
| `electron/libs/events/recv/location/RecvLocationEventRegion.ts` | `recv:location.regionChanged` → `ipc-recv:location.regionChanged` |
| `electron/libs/events/recv/location/RecvLocationEventSubArea.ts` | `recv:location.subAreaChanged` → `ipc-recv:location.subAreaChanged` |
| `electron/libs/events/recv/time/RecvTimeEvent.ts` | `recv:time.changed` → `ipc-recv:time.changed` |
| `electron/libs/events/recv/name/RecvName.ts` | `recv:name.changed` → `ipc-recv:name.changed` |
| `electron/libs/events/recv/currency/RecvCurrencyEvent.ts` | `recv:currency.changed` → `ipc-recv:currency.changed` |
| `electron/libs/events/recv/login-logout/RecvLoginEvent.ts` | `recv:loggedIn` → `ipc-recv:loggedIn` |
| `electron/libs/events/recv/login-logout/RecvLogoutEvent.ts` | `recv:loggedOut` → `ipc-recv:loggedOut` |

### Renderer

| File | Change |
|---|---|
| `ui/src/store/listeners.ts` | Add `createInitActions`; rename all keys; remove dead entries |
| `ui/src/store/store.ts` | Replace `ipcInvoke("global:init")` with `createInitActions` call; remove `ipcInvoke` import |
| `ui/src/store/actions/job.ts` | `ask:job.*` → `ipc-ask:job.*` |
| `ui/src/store/actions/currency.ts` | `ask:currency.get` → `ipc-ask:currency.get` |
| `ui/src/store/actions/time.ts` | `ask:time.get` → `ipc-ask:time.get` |
| `ui/src/store/actions/user.ts` | `ask:name.get` → `ipc-ask:name.get` |
| `ui/src/store/actions/location.ts` | `ask:location.getAll` → `ipc-ask:location.getAll` |
| `ui/src/store/actions/connection.ts` | `ask:connection.isConnected` → `ipc-ask:connection.isConnected` |

---

## Execution Order

1. **`ipc-event-types.ts`** — rename types first; TypeScript errors now act as a checklist
2. **`ask/` files** — fix `addHandler` calls to satisfy the new types
3. **`recv/` files** — fix `sendToClient` calls to satisfy the new types
4. **`app.ts`** — fix the bare `connection.changed` send
5. **`listeners.ts`** — rename keys + add `createInitActions` + remove dead entries
6. **`store.ts`** — wire up `createInitActions`, remove broken `ipcInvoke("global:init")`
7. **`actions/*.ts`** — fix `ipcInvoke` call strings

After step 1, `npx tsc --noEmit` should show every affected file. Zero errors after step 7 means the rename is complete.

---

## Verification

- `npx tsc --noEmit` — zero errors
- App opens → gil, job, location, time, name, and connection status all populate immediately without waiting for a push event
- `isInitialized` flips to `true` in Zustand devtools shortly after mount
- Disconnecting and reconnecting the WebSocket updates `socketConnected` in the store
- DevTools console shows no hanging/timeout errors for `global:init`

---

## Out of Scope

- `ipc-recv:xp.changed` / `ipc-recv:level.changed`: listeners registered in the renderer but no corresponding `RecvEvent` exists on the main side — requires C# plugin work first
- Window events (`exit`, `minimize`, `maximize`): fire-and-forget, don't interact with the WebSocket layer, no rename needed
