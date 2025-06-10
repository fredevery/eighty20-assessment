import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  favouritePokemon: {
    id: string;
    key: string;
    name: string;
    spriteFilename: string;
  };
  refreshToken: string | null;
};

export type AuthState = {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  storeTokens: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
  fetchRefreshToken: () => Promise<void>;
  fetchUser: () => Promise<User>;
};

const camelCase = (str: string) => {
  return str.replace(/([-_][a-z])/g, group =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};
const parseServerData = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map(item => parseServerData(item));
  }
  if (typeof data !== "object" || data === null) {
    return data; // Return primitive values as is
  }
  const parsedData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    parsedData[camelCase(key)] = parseServerData(value);
  }
  return parsedData;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) =>
      ({
        token: null,
        refreshToken: null,
        setToken: (token: string) => set({ token }),
        setRefreshToken: (refreshToken: string) => set({ refreshToken }),
        storeTokens: (token: string, refreshToken: string) =>
          set({ token, refreshToken }),
        clearAuth: () => set({ token: null, refreshToken: null }),
        fetchRefreshToken: async () => {
          const { refreshToken } = useAuthStore.getState();
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }
          try {
            const response = await fetch(
              import.meta.env.VITE_SERVER_REFRESH_URL,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
              }
            );
            if (!response.ok) {
              throw new Error("Failed to refresh token");
            }
            const data = await response.json();
            set({ token: data.access, refreshToken: data.refresh });
          } catch (error) {
            console.error("Error refreshing token:", error);
            throw error;
          }
        },
        fetchUser: async () => {
          const { token } = useAuthStore.getState();
          await useAuthStore.getState().fetchRefreshToken();
          if (!token) {
            throw new Error("No token available");
          }
          try {
            const response = await fetch(import.meta.env.VITE_SERVER_USER_URL, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              throw new Error("Failed to fetch user data");
            }
            const data = await response.json();
            return parseServerData(data) as User;
          } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
          }
        },
      } as AuthState),
    {
      name: "auth-storage",
    }
  )
);
