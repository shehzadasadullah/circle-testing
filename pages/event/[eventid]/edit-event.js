import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import EditEvent from "@/components/EditEvent/EditEvent";
// const CreateEventComponent = dynamic(
//   () => import("@/components/CreateEvent/CreateEvent"),
//   {
//     ssr: false,
//   }
// );

const CreateEvent = () => {
  return (
    <>
      <Head>
        <title>CIRCLE - Edit Event</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`w-full h-full`}>
        <EditEvent />
      </div>
    </>
  );
};

export default CreateEvent;
