import { createContext, Fragment, ReactNode, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Header from "../components/Header";
import HomePage from "../pages/home";
import Pokemon from "../pages/pokemon";
import { QueryClient, QueryClientProvider } from "react-query";
import PG_Context from "../context";

const Layout = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const [contextData, setContextData] = useState<any>({});
  const defaultContextData = { contextData, setContextData };

  return (
    <QueryClientProvider client={queryClient}>
      <PG_Context.Provider value={defaultContextData}>
        <Fragment>{children}</Fragment>
      </PG_Context.Provider>
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
