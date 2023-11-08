import AttendMain from "@/components/Attend/AttendMain";
import Head from "next/head";
import React from "react";

const Attend = () => {
  return (
    <>
      <Head>
        <title>CIRCLE</title>
        <meta name="description" content="Simple Description of Circle app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full">
        <AttendMain />
      </div>
    </>
  );
};

export default Attend;
