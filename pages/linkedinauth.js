import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Linkedinauth = () => {
  const [reponseGot, setResponseGot] = useState(false);
  //router
  let router = useRouter();
  let { state, code, error, error_description } = router.query;
  //imp function//get the auth code from
  const GetAccessToken = async (authcode) => {
    let redirectUrl = "https://circle.ooo/linkedinauth/";
    let body = {
      code: authcode,
      redirectUrl: redirectUrl,
    };
    fetch("/api/auth/linkedin/", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.text())
      .then((data) => {
        let resp = JSON.parse(data);
        if (resp.statusCode === 200) {
          let returnpath =
            JSON.parse(localStorage.getItem("returnPath")).returnPath ||
            "/test";
          setResponseGot(true);
          if (resp?.data?.error?.length > 0) {
            router.push(
              `${returnpath}?errorval=${resp?.data?.error}&error_description=${resp?.data?.error_description}`
            );
          } else if (resp?.data?.access_token?.length > 0) {
            router.push(
              `${returnpath}?accessToken=${resp?.data?.access_token}`
            );
          }
        }
      })
      .catch((err) => console.error("state", "error", err));
  };

  //use Effects
  useEffect(() => {
    if (code && code?.length > 0 && !reponseGot) {
      try {
        GetAccessToken(code);
      } catch (error) {
        console.error("state", "error", error);
      }
    }
  }, [code, reponseGot]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      Processing...
    </div>
  );
};

export default Linkedinauth;
