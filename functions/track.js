
const fs = require("fs");
const path = require("path");

exports.handler = async function (event) {
  const params = new URLSearchParams(event.rawUrl.split("?")[1]);
  const id = params.get("id");

  const dbPath = path.join(__dirname, "data.json");
  const db = JSON.parse(fs.readFileSync(dbPath));

  if (!id || !db.links[id]) {
    return {
      statusCode: 404,
      body: "Short link not found."
    };
  }

  db.links[id].clicks += 1;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  const lety = new URL(db.letyParamsUrl);
  const target = new URL(db.links[id].url);

  lety.searchParams.forEach((v, k) => {
    target.searchParams.set(k, v);
  });

  return {
    statusCode: 302,
    headers: {
      Location: target.toString()
    }
  };
};
