import { create } from "zustand";
import {
    fetchWeeklyMenu,
    fetchMyMealPlans,
    saveMealPlan,
} from "../services/menuService";

export const useMenuStore = create((set, get) => ({
    menus: {},
    loading: false,
    error: null,
    loadedMessId: null,
    plans: {},
    plansLoading: false,
    plansError: null,
    loadedPlansUserId: null,
    savingPlan: false,

    fetchMenu: async (messId, token) => {
        if (!messId || !token) return;

        set({
            loading: true,
            error: null,
        });

        try {
            const data = await fetchWeeklyMenu(messId, token);

            set({
                menus: data,
                loading: false,
                error: null,
                loadedMessId: messId,
            });
        } catch (err) {
            set({
                loading: false,
                error: err.message,
            });
        }
    },

    fetchPlans: async (userId, token) => {
        if (!userId || !token) return;

        if (get().loadedPlansUserId === userId) return;

        set({
            plansLoading: true,
            plansError: null,
        });

        try {
            const plans = await fetchMyMealPlans(userId, token);

            set({
                plans,
                plansLoading: false,
                plansError: null,
                loadedPlansUserId: userId,
            });
        } catch (err) {
            set({
                plansLoading: false,
                plansError: err.message,
            });
        }
    },

    updatePlan: async ({ userId, token, date, meal, status }) => {
        if (!userId || !token) return;

        const key = `${date}-${meal}`;
        const previousStatus = get().plans[key];

        set((state) => ({
            plans: {
                ...state.plans,
                [key]: status,
            },
            savingPlan: true,
            plansError: null,
        }));

        try {
            await saveMealPlan({
                userId,
                token,
                date,
                meal,
                status,
            });

            set({
                savingPlan: false,
            });
        } catch (err) {
            set((state) => {
                const plans = { ...state.plans };

                if (previousStatus === undefined) {
                    delete plans[key];
                } else {
                    plans[key] = previousStatus;
                }

                return {
                    plans,
                    savingPlan: false,
                    plansError: err.message,
                };
            });
        }
    },

    clearMenu: () =>
        set({
            menus: {},
            loading: false,
            error: null,
            loadedMessId: null,
            plans: {},
            plansLoading: false,
            plansError: null,
            loadedPlansUserId: null,
            savingPlan: false,
        }),
}));