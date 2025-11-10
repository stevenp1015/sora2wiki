import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import { ThemeProvider } from "./lib/theme/ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ":categorySlug", element: <CategoryPage /> },
      { path: ":categorySlug/:articleSlug", element: <ArticlePage /> },
    ],
  },
]);

const App = () => (
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);

export default App;
