# Database Schema

Ultimo aggiornamento: 2026-07-22

## Obiettivo

Questo documento descrive lo schema reale del database Supabase. Ogni modifica strutturale deve essere riportata qui prima di essere utilizzata dal frontend.

---

# Tabelle

## categories

| Colonna | Tipo | Note |
|---------|------|------|
| id | bigint | PK |
| name | text | Nome categoria |
| icon | text | Bootstrap Icon |
| color | text | Colore categoria |
| active | boolean | Categoria attiva |
| sort_order | integer | Ordine visualizzazione |
| created_at | timestamptz | Data creazione |
| updated_at | timestamptz | Ultima modifica |

---

## transactions

| Colonna | Tipo | Note |
|---------|------|------|
| id | bigint | PK |
| legacy_id | bigint | Id importazione |
| transaction_date | date | Data movimento |
| description | text | Descrizione |
| category_id | bigint | FK -> categories.id |
| transaction_type | text | Entrata / Uscita |
| balance_type | text | Ordinario / Straordinario |
| amount | numeric | Importo |
| created_at | timestamptz | Data creazione |

---

## budgets

| Colonna | Tipo | Note |
|---------|------|------|
| id | bigint | PK |
| legacy_id | bigint | Id importazione |
| month | date | Primo giorno del mese |
| category_id | bigint | FK -> categories.id |
| balance_type | text | Ordinario / Straordinario |
| amount | numeric | Budget |
| created_at | timestamptz | Data creazione |

---

## transaction_templates

| Colonna | Tipo | Note |
|---------|------|------|
| id | bigint | PK |
| description | text | UNIQUE |
| category_id | bigint | FK -> categories.id |
| transaction_type | text | Entrata / Uscita |
| balance_type | text | Ordinario / Straordinario |
| usage_count | integer | Numero utilizzi |
| last_used | timestamptz | Ultimo utilizzo |
| created_at | timestamptz | Data creazione |
| updated_at | timestamptz | Ultima modifica |

---

## extra_months

Tabella riservata alla gestione dei mesi extra.

---

## settings

Tabella delle impostazioni applicative.

---

# Relazioni

transactions.category_id
→ categories.id

budgets.category_id
→ categories.id

transaction_templates.category_id
→ categories.id

---

# Convenzioni

- Le categorie vengono referenziate esclusivamente tramite `category_id`.
- Le categorie non vengono duplicate come testo.
- I rimborsi sono normali transazioni.
- I budget sono associati alle categorie.
- Tutte le nuove tabelle devono utilizzare `created_at`.
- Se previsto un aggiornamento dei record, utilizzare anche `updated_at`.

---

# Trigger

## update_updated_at_column()

Aggiorna automaticamente la colonna `updated_at` durante gli UPDATE.

Attualmente utilizzato da:

- transaction_templates
- categories

---

# Stato Database

Database Version: **1.0**

Stato:

- [x] Normalizzato
- [x] Foreign Keys
- [x] Budget collegati alle categorie
- [x] Transaction Templates
- [x] Pronto per il frontend React

