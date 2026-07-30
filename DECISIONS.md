# Architectural Decisions

Questo documento raccoglie tutte le decisioni architetturali del progetto.

Ogni decisione deve riportare:

- il problema;
- la soluzione scelta;
- la motivazione.

---

# AD-001 - React Query

## Decisione

Utilizzare React Query per la gestione dei dati remoti.

## Motivazione

Evita l'uso estensivo di useEffect.

Gestisce automaticamente:

- cache
- loading
- error
- refetch
- invalidazione dei dati

Rende il codice più semplice e manutenibile.

---

# AD-002 - React Hook Form + Zod

## Decisione

Utilizzare React Hook Form insieme a Zod.

## Motivazione

- meno render
- validazione centralizzata
- codice riutilizzabile
- tipizzazione dello schema

---

# AD-003 - Categorie fisse

## Decisione

Le categorie non vengono create durante l'inserimento delle transazioni.

Sono gestite esclusivamente dalla sezione "Categorie".

## Motivazione

Le categorie rappresentano il budget.

Avere categorie dinamiche renderebbe più difficile:

- confrontare i mesi
- gestire i budget
- leggere i report

---

# AD-004 - Budget separato

## Decisione

I budget sono memorizzati nella tabella budgets.

Non vengono salvati nella tabella categories.

## Motivazione

Il budget può cambiare ogni mese.

La categoria rappresenta solamente una voce del piano dei conti.

---

# AD-005 - Suggerimenti automatici

## Decisione

L'app apprende dalle transazioni passate.

Durante l'inserimento propone automaticamente:

- categoria
- tipo
- bilancio

in base alla descrizione.

## Motivazione

Ridurre il tempo necessario per inserire una nuova transazione.

---

# AD-006 - Rimborsi

## Decisione

I rimborsi sono normali transazioni.

Categoria = stessa categoria della spesa

Tipo = Entrata

Non esiste alcun collegamento tra rimborso e spesa.

## Motivazione

Modello semplice.

I report mostrano automaticamente il saldo reale della categoria.

---

# AD-007 - Service Layer

## Decisione

I componenti React non comunicano direttamente con Supabase.

Ogni operazione passa attraverso i Service.

## Motivazione

Separazione tra UI e accesso ai dati.

Maggiore manutenibilità.

---

# AD-008 - Custom Hooks

## Decisione

La logica React Query viene incapsulata nei Custom Hooks.

Esempio:

- useTransactions()
- useBudgets()
- useCategories()

## Motivazione

Componenti più semplici.

Maggiore riutilizzo.

---

# AD-009 - Componenti riutilizzabili

## Decisione

Creare componenti comuni per:

- Form
- Tabelle
- Pulsanti
- Modali

## Motivazione

Ridurre la duplicazione del codice.

Uniformare l'interfaccia.

---

# AD-010 - Filosofia del progetto

## Decisione

Ogni funzionalità deve rendere l'app più semplice da utilizzare.

Le funzionalità che aumentano la complessità senza portare un reale beneficio vengono rimandate alla versione successiva.

## Motivazione

L'obiettivo è avere un'applicazione veloce, intuitiva e facilmente manutenibile.
