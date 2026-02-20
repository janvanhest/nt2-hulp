# Container Diagram (opties)

## Doel
Vergelijking van twee architectuurroutes met een React SPA.

## Optie A: Laravel API + React SPA
```mermaid
flowchart LR
    subgraph Browser
      SPA[React SPA]
    end

    subgraph Backend
      API[Laravel API]
      DB[(PostgreSQL)]
      Files[(Storage: exports)]
    end

    SPA -->|HTTPS/JSON| API
    API --> DB
    API --> Files
```

## Optie B: Python API + React SPA
```mermaid
flowchart LR
    subgraph Browser
      SPA[React SPA]
    end

    subgraph Backend
      API[Python API (FastAPI of Django)]
      DB[(PostgreSQL)]
      Files[(Storage: exports)]
    end

    SPA -->|HTTPS/JSON| API
    API --> DB
    API --> Files
```

## Optie C: Hybrid (Laravel API + Python Service)
```mermaid
flowchart LR
    subgraph Browser
      SPA[React SPA]
    end

    subgraph Backend
      LAPI[Laravel API]
      PAPI[Python Service]
      DB[(PostgreSQL)]
      Files[(Storage: exports)]
    end

    SPA -->|HTTPS/JSON| LAPI
    LAPI --> DB
    LAPI --> Files
    LAPI -->|HTTP/RPC| PAPI
    PAPI --> DB
```

## Notities
- Exports (PDF/Markdown) hangen aan de API‑laag.
- Auth/roles kunnen in API‑laag of via externe auth provider.
- Hybrid is krachtig maar introduceert extra deployment‑complexiteit.
