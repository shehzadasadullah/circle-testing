import AttendEventMain from "@/components/Attend/AttendEventMain";
import Head from "next/head";
import React from "react";

const AttendEvent = () => {
  return (
    <>
      <Head>
        <title>CIRCLE - Events</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/noww-d5ce2.appspot.com/o/circles%2FbannerCircle.png?alt=media&token=c951bb6c-8c98-4e3f-9a30-40b6a5ec65d5"
        />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="400" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full">
        <AttendEventMain />
      </div>
    </>
  );
};

export default AttendEvent;
