import { useState } from "react";

import AppCard from "../../components/ui/AppCard";
import AppSpinner from "../../components/ui/AppSpinner";

import { buildPeriods } from "../../utils/periodUtils";

import transactionService from "../../services/transactionService";

import { useBudgetConfiguration } from "../../hooks/useBudgetConfiguration";

import PeriodSelector from "../../components/PeriodSelector";
import BudgetConfigurationTable from "./BudgetConfigurationTable";

export default function BudgetPage() {

    const availablePeriods =
        transactionService.getAvailablePeriods;

}