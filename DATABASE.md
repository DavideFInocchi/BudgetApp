# Database

## transactions

- id
- transaction_date
- description
- amount
- category_id
- type
- balance_type
- notes
- created_at
- updated_at

---

## categories

- id
- name
- icon
- color
- sort_order
- active

---

## budgets

- id
- month
- category_id
- budget_amount

---

## transaction_templates

- id
- description
- category_id
- type
- balance_type
- usage_count
- last_used

---

# Regole

- Le categorie sono fisse.
- I rimborsi sono semplici entrate nella stessa categoria della spesa.
- I suggerimenti vengono generati automaticamente dalla cronologia.
