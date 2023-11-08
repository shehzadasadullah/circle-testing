//api to fetch the user's detials from linkedin using access token
export default async function handler(req, res) {
  const { accessToken } = req.query;
  if (req.method == "GET") {
    try {
      let headers = {
        Authorization: `Bearer ${accessToken}`,
        "cache-control": "no-cache",
        "X-Restli-Protocol-Version": "2.0.0",
      };
      fetch(
        `https://api.linkedin.com/v2/me?projection=(*,profilePicture(displayImage~:playableStreams))`,
        { method: "GET", headers: headers }
      )
        .then((r) => r.json())
        .then((data) => {
          return res.status(200).json({ statusCode: 200, data: data });
        })
        .catch((error) => {
          console.error("state", "error value", error);
          return res.status(400).json({
            statusCode: 400,
            message: error?.error_description || error?.message,
            error: error,
          });
        });
    } catch (err) {
      return res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    return res.status(405).end("Method Not Allowed");
  }
}
