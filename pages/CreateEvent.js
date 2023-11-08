import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
const CreateEventComponent = dynamic(
  () => import("@/components/CreateEvent/CreateEvent"),
  {
    ssr: false,
  }
);

const CreateEvent = () => {
  return (
    <>
      <Head>
        <title>CIRCLE</title>
        <meta name="description" content="Simple Description of Circle app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`w-full h-full`}>
        <CreateEventComponent />
      </div>
    </>
  );
};

export default CreateEvent;
