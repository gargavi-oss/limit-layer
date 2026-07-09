# Architecture

LimitLayer is designed around a modular architecture that separates the core rate-limiting engine from framework integrations and storage implementations.

## High-Level Flow

```text
Application
      │
      ▼
Framework Adapter (Express, Fastify, ...)
      │
      ▼
LimitLayer
      │
      ▼
Decision Engine
      │
 ┌────┴────┐
 ▼         ▼
Rule Matcher   Algorithm Registry
      │               │
      ▼               ▼
 Selected Rule   Selected Algorithm
      │               │
      └──────┬────────┘
             ▼
        Storage Adapter
             │
             ▼
      Decision Result
```

## Core Components

### LimitLayer

The main entry point of the library.

Responsibilities:

* Validates configuration
* Registers built-in algorithms
* Finds matching rules
* Delegates requests to the Decision Engine

---

### Decision Engine

The Decision Engine coordinates the rate-limiting process.

Responsibilities:

* Generates storage keys
* Loads algorithm state
* Executes the selected algorithm
* Persists updated state
* Returns the final decision

---

### Rule Matcher

The Rule Matcher determines which rule applies to an incoming request.

Supported matching:

* Exact paths
* Wildcards (`/api/*`)
* Parameterized routes (`/users/:id`)
* Regular expressions
* HTTP methods
* Rule priorities

---

### Algorithm Registry

The registry maps algorithm names to implementations.

Current algorithms:

* Fixed Window
* Sliding Window

Future algorithms:

* Token Bucket
* Sliding Log
* Leaky Bucket

Custom algorithms can also be registered without modifying the core engine.

---

### Storage Layer

Algorithms remain independent of where their state is stored.

Current storage:

* MemoryStore
* Redis

Planned storage:

* Upstash Redis
* PostgreSQL
* MongoDB

---

## Design Goals

* Framework agnostic
* Extensible algorithms
* Pluggable storage
* Strong TypeScript support
* Easy to test
* High performance

The architecture is intentionally modular so new algorithms, storage adapters, and framework integrations can be added without changing existing components.
