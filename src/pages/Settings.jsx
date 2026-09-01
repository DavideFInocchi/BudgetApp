import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import AppCard from "../components/ui/AppCard";
import toastService from "../services/toastService";
import {
    createBackup,
    parseBackupFile,
    restoreBackup,
    BACKUP_TABLE_NAMES,
} from "../services/backupService";

export default function Settings() {

    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreFile, setRestoreFile] = useState(null);
    const [restoreSummary, setRestoreSummary] = useState(null);

    const handleBackup = async () => {
        setIsBackingUp(true);

        try {
            const backup = await createBackup();
            const totalRecords = BACKUP_TABLE_NAMES.reduce(
                (total, table) => total + backup.data[table].length,
                0
            );

            toastService.success(
                `Backup creato: ${totalRecords} record esportati.`
            );
        } catch (error) {
            toastService.error(error.message || "Impossibile creare il backup.");
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        try {
            const backup = await parseBackupFile(file);
            const summary = BACKUP_TABLE_NAMES.map((table) => ({
                table,
                count: backup.data[table].length,
            }));

            setRestoreFile({ file, backup });
            setRestoreSummary(summary);
        } catch (error) {
            setRestoreFile(null);
            setRestoreSummary(null);
            toastService.error(error.message || "Backup non valido.");
        }
    };

    const handleRestore = async () => {
        if (!restoreFile || isRestoring) return;

        const confirmed = window.confirm(
            "Il ripristino sostituirà tutti i dati attuali di BudgetApp con quelli del backup. Continuare?"
        );

        if (!confirmed) return;

        setIsRestoring(true);

        try {
            await restoreBackup(restoreFile.backup);
            await queryClient.invalidateQueries();
            setRestoreFile(null);
            setRestoreSummary(null);
            toastService.success("Backup ripristinato correttamente.");
        } catch (error) {
            toastService.error(error.message || "Impossibile ripristinare il backup.");
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <div className="page">

            <h1>Settings</h1>

            <div className="row g-4 mt-1">

                <div className="col-12 col-lg-6">
                    <AppCard
                        title="Backup"
                        subtitle="Esporta tutti i dati di BudgetApp in un file JSON."
                    >
                        <p className="text-muted mb-3">
                            Il backup comprende categorie, transazioni, budget,
                            template, mensilità extra e impostazioni.
                        </p>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleBackup}
                            disabled={isBackingUp}
                        >
                            <i className="bi bi-download me-2" />
                            {isBackingUp ? "Creazione backup..." : "Crea backup"}
                        </button>
                    </AppCard>
                </div>

                <div className="col-12 col-lg-6">
                    <AppCard
                        title="Ripristino"
                        subtitle="Ripristina BudgetApp da un backup JSON."
                    >
                        <p className="text-muted mb-3">
                            Il ripristino sostituisce i dati attuali con quelli
                            presenti nel file selezionato.
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            className="d-none"
                            onChange={handleFileChange}
                        />

                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isRestoring}
                        >
                            <i className="bi bi-upload me-2" />
                            Seleziona backup
                        </button>

                        {restoreSummary && (
                            <div className="mt-4">
                                <div className="fw-semibold mb-2">
                                    Backup pronto al ripristino
                                </div>

                                <ul className="list-group list-group-flush small">
                                    {restoreSummary.map(({ table, count }) => (
                                        <li
                                            key={table}
                                            className="list-group-item px-0 d-flex justify-content-between"
                                        >
                                            <span>{table}</span>
                                            <span className="text-muted">{count}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    className="btn btn-danger mt-3"
                                    onClick={handleRestore}
                                    disabled={isRestoring}
                                >
                                    <i className="bi bi-arrow-counterclockwise me-2" />
                                    {isRestoring ? "Ripristino..." : "Ripristina backup"}
                                </button>
                            </div>
                        )}
                    </AppCard>
                </div>

            </div>
        </div>
    );
}
