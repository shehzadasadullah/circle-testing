import Context from "@/context/context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <Context>
      <Component {...pageProps} />
    </Context>
  );
}
