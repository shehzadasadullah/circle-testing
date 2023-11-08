// import axios from 'axios';
//api to create dynamic link for the event
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { link, id } = req.body;
    let url =
      "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA7Wrm9tcE7J3oujKvmXDMsbuTG7O71d-w";
    let frameBody = {
      dynamicLinkInfo: {
        domainUriPrefix: "https://nowwsocial.page.link",
        link: link,
        androidInfo: {
          androidPackageName: "com.noww.social",
        },
        iosInfo: {
          iosBundleId: "com.noww.social",
          iosCustomScheme: `socialnoww://events/?id=${id}`,
          iosAppStoreId: "1611956542",
          iosIpadBundleId: "com.noww.social",
        },
      },
      suffix: {
        option: "SHORT",
      },
    };
    const headers = {
      "Content-Type": "application/json",
    };

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(frameBody),
    };

    try {
      const response = await fetch(url, options);
      if (res) {
        const json = await response.json();

        if (json) {
          return res.status(200).json(json);
        }
      } else {
        return res.status(500).json({ error: "No response received from api" });
      }
    } catch (err) {
      return res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    return res.status(405).end("Method Not Allowed");
  }
}
