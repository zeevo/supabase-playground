import "../client/styles/globals.css";
import { createTheme, NextUIProvider } from "@nextui-org/react";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    type: "light",
    theme: {
      colors: {},
      space: {},
      fonts: {},
    },
  });

  return (
    <NextUIProvider theme={theme}>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
