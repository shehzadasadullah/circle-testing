import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import AboutMain from "@/components/privacy/PrivacyMain";

const About = () => {
  return (
    <>
      <Head>
        <title>CIRCLE - Privacy Policy</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`w-full h-full`}>
        <AboutMain />
      </div>
    </>
  );
};

export default About;
