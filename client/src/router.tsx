import {
  createBrowserRouter,
} from 'react-router-dom'

import App from './App.tsx'
import FourOhFour from './404.tsx'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import { useAuthStore } from './stores.ts'
import { redirect } from 'react-router-dom'
import { loginAction, logoutAction } from './actions.ts'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <FourOhFour />,
    children: [
      {
        path: "",
        element: <Home />,
        loader: async () => {
          const { token, refreshToken, fetchUser } = useAuthStore.getState();
          if (!token || !refreshToken) {
            // If no token or refresh token, redirect to login
            return redirect("/login");
          }
          try {
            return await fetchUser();
          } catch (error) {
            return redirect("/login");
          }
        }
      },
      {
        path: "login",
        action: loginAction,
        element: <Login />,
      },
      {
        path: "logout",
        action: logoutAction,
      }
    ]
  }
])