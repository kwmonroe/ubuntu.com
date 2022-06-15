import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// import BlenderPurchase from "./BlenderPurchase";

declare global {
  interface Window {
    STATE: {
      package: string;
      period: string;
      quantity: number;
      product: {
        name: string;
        price: {
          value: number;
          currency: string;
        };
        period: string;
        productID: string;
        canBeTrialled: boolean;
        private: boolean;
        marketplace: string;
      };
    };
  }
}

Sentry.init({
  dsn: "https://0293bb7fc3104e56bafd2422e155790c@sentry.is.canonical.com//13",
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["ubuntu.com"],
    }),
  ],
  allowUrls: ["ubuntu.com"],
  tracesSampleRate: 1.0,
});

const stripePromise = loadStripe(window.stripePublishableKey ?? "");
const oneHour = 1000 * 60 * 60;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: oneHour,
      retryOnMount: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>{/* <BlenderPurchase /> */}</Elements>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("react-root"));
