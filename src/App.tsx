import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import GuideSectionPage from "./components/GuideSectionPage/GuideSectionPage";
import { contentService } from "./services/contentService";
import { ThemeProvider } from "./lib/theme/ThemeContext";
import { SoraVersionProvider } from "./contexts/SoraVersionContext";

// Create a wrapper component that has access to the Sora version
const VersionedAppLayout = () => {
  const content = contentService.getContent();
  const categories = content.categories || [];
  
  // Create navigation items for the sidebar
  const navItems = categories.map((category: any) => ({
    id: category.category_slug,
    title: category.category_title,
    full_title: category.category_title,
    description: category.category_description,
    items: category.articles.map((article: any) => ({
      id: `${category.category_slug}/${article.article_slug}`,
      title: article.article_title,
      path: `/guide/${category.category_slug}/${article.article_slug}`
    }))
  }));
  
  return <AppLayout navItems={navItems} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <VersionedAppLayout />,
    children: [
      { 
        index: true, 
        element: <GuideSectionPage />,
        loader: () => {
          // Redirect to the first category's first article
          const content = contentService.getContent();
          if (content.categories?.length > 0 && content.categories[0].articles?.length > 0) {
            const firstCategory = content.categories[0];
            const firstArticle = firstCategory.articles[0];
            return {
              redirect: `/guide/${firstCategory.category_slug}/${firstArticle.article_slug}`
            };
          }
          return null;
        }
      },
      { 
        path: "guide/:sectionId", 
        element: <GuideSectionPage /> 
      },
      { 
        path: "guide/:sectionId/:articleSlug", 
        element: <GuideSectionPage /> 
      },
    ],
  },
]);

const App = () => (
  <ThemeProvider>
    <SoraVersionProvider>
      <RouterProvider router={router} />
    </SoraVersionProvider>
  </ThemeProvider>
);

export default App;
