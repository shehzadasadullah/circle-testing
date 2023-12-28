import React, { useEffect } from "react";
import Context from "@/context/context";
import "@/styles/globals.css";
import "aos/dist/aos.css";
import AOS from "aos";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <Context>
      <Component {...pageProps} />
    </Context>
  );
}
