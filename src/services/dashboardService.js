// src/services/dashboardService.js

/**
 * Recupera tutti i dati necessari alla Dashboard.
 *
 * @param {Object} period
 * @param {string} period.from
 * @param {string} period.to
 * @returns {Promise<Object>}
 */
export async function getDashboard(period) {

  const [
    summary,
    cashFlow,
    categoryExpenses,
    budgets,
    latestTransactions,
  ] = await Promise.all([
    loadSummary(period),
    loadCashFlow(period),
    loadCategoryExpenses(period),
    loadBudgets(period),
    loadLatestTransactions(period),
  ]);

  return {
    period,
    summary,
    cashFlow,
    categoryExpenses,
    budgets,
    latestTransactions,
  };
}

async function loadSummary(period) {
  // TODO: Query Supabase

  return {
    income: 3200,
    expense: 2150,
    balance: 1050,
    saving: 1050,
    transactionsCount: 58,
  };
}

async function loadCashFlow(period) {
  // TODO: Query Supabase

  return [
    {
      label: "Luglio",
      income: 3200,
      expense: 2150,
    },
  ];
}

async function loadCategoryExpenses(period) {
  // TODO: Query Supabase

  return [
    {
      categoryId: 1,
      name: "Alimentari",
      color: "#4CAF50",
      total: 620,
      percentage: 29,
    },
    {
      categoryId: 2,
      name: "Casa",
      color: "#2196F3",
      total: 450,
      percentage: 21,
    },
    {
      categoryId: 3,
      name: "Trasporti",
      color: "#FF9800",
      total: 280,
      percentage: 13,
    },
  ];
}

async function loadBudgets(period) {
  // TODO: Query Supabase

  return [
    {
      categoryId: 1,
      category: "Alimentari",
      color: "#4CAF50",
      budget: 800,
      spent: 620,
      remaining: 180,
      progress: 78,
      exceeded: false,
    },
    {
      categoryId: 2,
      category: "Casa",
      color: "#2196F3",
      budget: 500,
      spent: 450,
      remaining: 50,
      progress: 90,
      exceeded: false,
    },
  ];
}

async function loadLatestTransactions(period) {
  // TODO: Query Supabase

  return [
    {
      id: 1,
      date: "2026-07-30",
      description: "Esselunga",
      category: "Alimentari",
      amount: -54.8,
      movementType: "EXPENSE",
    },
    {
      id: 2,
      date: "2026-07-29",
      description: "Stipendio",
      category: "Lavoro",
      amount: 2200,
      movementType: "INCOME",
    },
    {
      id: 3,
      date: "2026-07-28",
      description: "Carburante",
      category: "Trasporti",
      amount: -75.2,
      movementType: "EXPENSE",
    },
    {
      id: 4,
      date: "2026-07-27",
      description: "Netflix",
      category: "Intrattenimento",
      amount: -12.99,
      movementType: "EXPENSE",
    },
    {
      id: 5,
      date: "2026-07-26",
      description: "Farmacia",
      category: "Salute",
      amount: -28.5,
      movementType: "EXPENSE",
    },
  ];
}