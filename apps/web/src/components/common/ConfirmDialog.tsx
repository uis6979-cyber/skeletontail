"use client";

import { useTranslations } from "next-intl";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import Button from "../ui/button/Button";

type ConfirmOptions = {
    title?: string;
    message?: string;
    onConfirm: () => void | Promise<void>;
};

type ConfirmContextType = {
    confirm: (options: ConfirmOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

/**
 * Orchestrates a global confirmation dialog system using React Context.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
    const t = useTranslations("common");
    const [options, setOptions] = useState<ConfirmOptions | null>(null);

    const confirm = useCallback((opts: ConfirmOptions) => setOptions(opts), []);
    const handleClose = useCallback(() => setOptions(null), []);

    const handleConfirm = async () => {
        if (options?.onConfirm) await options.onConfirm();
        handleClose();
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {options && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-[400px] rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
                        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                            {options.title || t("messages.confirmTitle")}
                        </h2>

                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            {options.message || t("messages.confirmBody")}
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={handleClose}
                                variant="outline"
                                size="sm"
                            >
                                {t("buttons.cancel")}
                            </Button>

                            <Button
                                onClick={handleConfirm}
                                variant="primary"
                                size="sm"
                            >
                                {t("buttons.confirm")}
                            </Button>
                        </div>
                    </div>
                </div>
            )
            }
        </ConfirmContext.Provider >
    );
}

export const useConfirm = () => {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
    return ctx;
};