import HomePage from "@/components/Home/HomePage";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>CIRCLE - Homepage</title>
        <meta name="description" content="Simple Description of Circle app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`w-full h-full`}>
        <HomePage />
      </div>
    </>
  );
}
