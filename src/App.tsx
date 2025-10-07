import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import GuideSectionPage from "./components/GuideSectionPage";
import sections from "./lib/sections";
import { ThemeProvider } from "./lib/theme/ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout sections={sections} />,
    children: [
      { index: true, element: <GuideSectionPage /> },
      { path: "guide/:sectionId", element: <GuideSectionPage /> },
    ],
  },
]);

const App = () => (
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);

export default App;
