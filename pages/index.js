import HomePage from "@/components/Home/HomePage";
import Head from "next/head";

// console.log = () => {};
// console.error = () => {};
// console.debug = () => {};

export default function Home() {
  return (
    <>
      <Head>
        <title>CIRCLE - Home</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`w-full h-full`}>
        <HomePage />
      </div>
    </>
  );
}
