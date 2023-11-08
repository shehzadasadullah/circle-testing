export default async function handler(req, res) {
  const { code, redirectUrl } = JSON.parse(req.body);
  if (req.method == "POST") {
    try {
      const formData = new URLSearchParams();
      formData.append("client_id", "86imx6ec1qvuky");
      formData.append("grant_type", "authorization_code");
      formData.append("client_secret", "GCq8hptJTVE4ieqE");
      formData.append("code", code);
      formData.append("redirect_uri", redirectUrl);
      fetch(`https://www.linkedin.com/oauth/v2/accessToken`, {
        method: "POST",
        body: formData,
      })
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
    res.status(405).end("Method Not Allowed");
  }
}
