import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../services/dashboardService";

export function useDashboard(period) {
  return useQuery({
    queryKey: ["dashboard", period],
    queryFn: () => getDashboard(period),
    enabled: !!period,
  });
}