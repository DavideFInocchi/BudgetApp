import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import transactionService from "../services/transactionService";

export function useTransactions() {

    const queryClient = useQueryClient();

    const query = useQuery({

        queryKey: ["transactions"],

        queryFn: transactionService.getAll

    });

    const create = useMutation({

        mutationFn: transactionService.create,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["transactions"]

            });
            queryClient.invalidateQueries({

                queryKey: ["dashboard"]

            });

        }

    });
    const createMany = useMutation({

        mutationFn: transactionService.createMany,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["transactions"]

                });


        }

    });
    const update = useMutation({

        mutationFn: ({ id, data }) =>
            transactionService.update(id, data),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["transactions"]

            });

        }

    });

    const remove = useMutation({

        mutationFn: transactionService.remove,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["transactions"]

            });

        }

    });

    return {

        ...query,

        create,
        createMany,
        update,
        remove

    };

}