/* eslint-disable @next/next/no-document-import-in-page */

import Document, { Html, Head, Main, NextScript } from "next/document";

// console.log = () => {};
// console.error = () => {};
// console.debug = () => {};

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* <script
            async
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){ c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "gqp2vn24r1");`,
            }}
          /> */}
          <script src="https://www.google.com/recaptcha/api.js?render=6LdBm7EpAAAAAM8Gp9XV977r-2Q27D4s_VNq7Vop"></script>
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA_2dI8vYCq13R5i-__U6oIog1Xon63jhA&libraries=places"></script>
        </Head>
        <body>
          <Main />
          <NextScript />{" "}
        </body>{" "}
      </Html>
    );
  }
}
