import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoot from "./App.jsx"; // Public layout
import { ApiProvider } from "./context/ApiContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "antd";

// --- Layouts ---
import DashboardLayout from "./layouts/DashboardLayout.jsx"; // (1) Dashboard Layout import karein

// --- Auth Pages (Public Only) ---
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// --- Route Components ---
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute.jsx";

// --- Pages ---
import HomePage from "./pages/HomePage.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import DeliveryDashboard from "./pages/deliveryBoy/DeliveryDashboard.jsx";
import OwnerMyShopPage from "./pages/owner/OwnerMyShopPage.jsx";
import OwnerFoodItemPage from "./pages/owner/OwnerFoodItemPage.jsx";
import { CartProvider } from "./context/CartContext.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    children: [{ path: "/", element: <HomePage /> }],
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicOnlyRoute>
        <SignUpPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/verify-otp",
    element: (
      <PublicOnlyRoute>
        <VerifyOTPPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <PublicOnlyRoute>
        <ResetPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <UserDashboard /> },
      // (Jab aap naye pages banayein, yahan add karein)
      // { path: "my-orders", element: <UserOrdersPage /> },
      // { path: "profile", element: <ProfilePage /> },
    ],
  },

  // (B) Owner Routes
  {
    path: "/owner", // Parent path
    element: (
      <ProtectedRoute allowedRoles={["owner"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <OwnerDashboard /> },
      { path: "my-shop", element: <OwnerMyShopPage /> },
      { path: "my-item", element: <OwnerFoodItemPage /> },
      // { path: "orders", element: <OwnerOrdersPage /> },
      // { path: "menu", element: <OwnerMenuPage /> },
    ],
  },

  // (C) Delivery Boy Routes
  {
    path: "/delivery", // Parent path
    element: (
      <ProtectedRoute allowedRoles={["deliveryBoy"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DeliveryDashboard /> },
      // { path: "tasks", element: <DeliveryTasksPage /> },
      // { path: "profile", element: <DeliveryProfilePage /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App>
      <ApiProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ApiProvider>
    </App>
  </StrictMode>
);
