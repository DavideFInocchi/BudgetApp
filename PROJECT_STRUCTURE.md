# Project Structure

Questo documento descrive la struttura del progetto e lo scopo di ogni cartella.

---

# Root

`	ext
BudgetApp
│
├── docs
├── public
├── src
├── .env
├── package.json
├── vite.config.js
├── README.md
├── CHANGELOG.md
├── ROADMAP.md
├── DATABASE.md
├── ARCHITECTURE.md
├── DECISIONS.md
├── PROJECT_STRUCTURE.md
└── TODO.md
`

---

# src

`	ext
src
│
├── assets
├── components
├── hooks
├── pages
├── router
├── services
├── styles
├── validation
├── App.jsx
└── main.jsx
`

---

# assets

Contiene:

- immagini
- icone
- loghi
- font

---

# components

Componenti React riutilizzabili.

`	ext
components
│
├── common
├── forms
├── layout
├── tables
└── filters
`

---

## common

Componenti condivisi.

Esempi:

- IconButton
- AppModal
- LoadingSpinner
- ConfirmDialog

---

## forms

Componenti dedicati ai form.

Esempi:

- TextField
- NumberField
- DateField
- SelectField
- TransactionForm

---

## layout

Componenti del layout principale.

Esempi:

- Sidebar
- Header
- Footer

---

## tables

Componenti tabellari.

Esempi:

- DataTable
- TransactionTable

---

## filters

Componenti dedicati ai filtri.

Esempi:

- TransactionFilters

---

# hooks

Custom Hooks.

Ogni hook contiene la logica React Query o altra logica condivisa.

Esempi:

- useTransactions
- useCategories
- useBudgets
- useDashboard

---

# pages

Ogni pagina rappresenta una vista dell'applicazione.

`	ext
pages
│
├── Dashboard
├── Transactions
├── Categories
├── Budget
├── Reports
└── Settings
`

---

# router

Configurazione di React Router.

---

# services

Layer di accesso ai dati.

I componenti React non comunicano mai direttamente con Supabase.

Esempi:

- transactionService
- categoryService
- budgetService
- dashboardService

---

# styles

Fogli di stile globali.

Esempi:

- layout.css
- dashboard.css
- tables.css

---

# validation

Schemi Zod.

Ogni entità possiede il proprio schema.

Esempi:

- transactionSchema
- categorySchema
- budgetSchema

---

# Principi Architetturali

- Componenti piccoli e riutilizzabili.
- Nessuna logica di business nelle pagine.
- Nessun accesso diretto a Supabase dai componenti.
- Tutte le operazioni sul database passano dai Services.
- Tutte le query React passano dai Custom Hooks.
- Validazione centralizzata con Zod.
- Stato remoto gestito con React Query.
- Separazione tra UI e Business Logic.

---

# Convenzioni

## Componenti

PascalCase

Esempio:

TransactionTable.jsx

---

## Hooks

camelCase con prefisso use

Esempio:

useTransactions.js

---

## Services

camelCase con suffisso Service

Esempio:

transactionService.js

---

## Schemi Zod

camelCase con suffisso Schema

Esempio:

transactionSchema.js

---

## CSS

Un file CSS per ogni macro componente.

---

# Obiettivo

Realizzare un'applicazione:

- modulare;
- leggibile;
- facilmente estendibile;
- semplice da mantenere nel tempo;
- con una chiara separazione tra interfaccia, logica applicativa e accesso ai dati.

Ogni nuova funzionalità dovrà rispettare questa struttura e queste convenzioni.
