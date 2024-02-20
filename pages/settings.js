import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import Dashboard from "@/components/Settings/Settings";
import LogoIcon from "@/components/SvgIcons/LogoIcon";
import Head from "next/head";
import React, { useState } from "react";
import { BsLink } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";

const Settings = () => {
  const [activeView, setActiveView] = useState("integrations");

  const switchView = (view) => {
    setActiveView(view);
  };

  return (
    <>
      <Head>
        <title>CIRCLE - Settings</title>
        <meta
          name="description"
          content="Circle.ooo ❤️'s our customers! Events: beautiful, fast & simple for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Dashboard />
      </div>
    </>
  );
};

export default Settings;
