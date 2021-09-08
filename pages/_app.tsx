import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import React, { useEffect, useState } from "react";
import { CssBaseline } from "@material-ui/core";

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>

      <Hydrate state={pageProps.dehydratedState}>
      <CssBaseline />
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
