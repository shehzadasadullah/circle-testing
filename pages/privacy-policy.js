import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
const PrivacyMain = dynamic(() => import("@/components/privacy/PrivacyMain"), {
  ssr: false,
});

const About = () => {
  return (
    <>
      <Head>
        <title>CIRCLE</title>
        <meta name="description" content="Simple Description of Circle app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`w-full h-full`}>
        <PrivacyMain />
      </div>
    </>
  );
};

export default About;
