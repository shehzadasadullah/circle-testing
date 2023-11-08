import axios from "axios";
//api to create a email and sending ticket form email back to the user's email, using circle cloud function
export default async function handler(req, res) {
  const { bodymessage, usersdata } = req.body;
  if (req.method == "POST") {
    try {
      axios
        .post("https://apps.noww.co/ticket", {
          bodymessage: bodymessage,
          usersdata: usersdata,
        })
        .then(function (response) {
          res.status(200).json({
            statusCode: 200,
            data: { body: "Successfully sent email" },
          });
        })
        .catch(function (error) {
          console.error("state", "error", error);
          return res
            .status(500)
            .json({ statusCode: 500, message: error.message });
        });
    } catch (err) {
      return res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    return res.status(405).end("Method Not Allowed");
  }
}
