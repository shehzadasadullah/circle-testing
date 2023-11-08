//api to fetch the user's email from linkedin using access token
export default async function handler(req, res) {
  const { accessToken } = req.query;
  if (req.method == "GET") {
    console.log("state", "accessToken", req.query, accessToken);
    try {
      let headers = {
        Authorization: `Bearer ${accessToken}`,
        "cache-control": "no-cache",
        "X-Restli-Protocol-Version": "2.0.0",
      };
      fetch(
        `https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))`,
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
