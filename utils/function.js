export const RandomNdigitnumber = (n) => {
  var letters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var uid = "";
  for (var i = 0; i < n; i++) {
    uid += letters[Math.floor(Math.random() * 62)];
  }
  return uid;
};
