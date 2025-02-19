import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ProductDetailPage from "./routers/productDetailPage/productDetailPage.jsx";
import HomePage from "./routers/homePage/homePage.jsx";
import ShoppingCartPage from "./routers/shoppingCartPage/shoppingCartPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/rootLayout.jsx";
import React from "react";
import PaymentPage from "./routers/payment/paymentPage.jsx";
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/product",
        element: <ProductDetailPage />
      },
      {
        path: "/cart",
        element: <ShoppingCartPage />
      },
      {
        path: "/payment",
        element: <PaymentPage />
      },
     
    ]
  }
]);
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
