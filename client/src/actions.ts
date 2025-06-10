import { redirect } from "react-router-dom";
import { useAuthStore } from "./stores";

export async function loginAction({ request }: { request: Request }) {
  const storeTokens = useAuthStore.getState().storeTokens;
  const formData = await request.formData();
  const apiResponse = await fetch(import.meta.env.VITE_SERVER_LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData.entries())),
  });
  const reponseJson = await apiResponse.json();
  if (!apiResponse.ok) {
    return {
      ok: false,
      ...reponseJson,
    };
  }

  storeTokens(reponseJson.access, reponseJson.refresh);
  return redirect("/");
}

export async function logoutAction() {
  const { clearAuth, refreshToken } = useAuthStore.getState();
  const response = await fetch(import.meta.env.VITE_SERVER_LOGOUT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (response.ok) {
    clearAuth();
    return redirect("/login");
  } else {
    console.error("Logout failed");
    return { ok: false, detail: "Logout failed" };
  }
}
