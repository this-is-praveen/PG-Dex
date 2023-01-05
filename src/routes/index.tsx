import { Fragment, ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Header from "../components/Header";
import HomePage from "../pages/home";
import Pokemon from "../pages/pokemon";
import { QueryClient, QueryClientProvider } from "react-query";

const Layout = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Fragment>{children}</Fragment>
    </QueryClientProvider>
  );
};

const router = createBrowserRouter([
  {
    path: `/pokemon/:pokemonId`,
    element: (
      <Layout>
        <Pokemon />
      </Layout>
    ),
  },
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
]);

export default router;
