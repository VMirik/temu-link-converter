const fetch = require("node-fetch");

const FIREBASE_URL = "https://temu-link-converter-default-rtdb.europe-west1.firebasedatabase.app";

exports.handler = async function (event) {
  const params = new URLSearchParams(event.rawUrl.split("?")[1]);
  const id = params.get("id");

  if (!id) {
    return {
      statusCode: 400,
      body: "Missing id parameter"
    };
  }

  try {
    const res = await fetch(`${FIREBASE_URL}/links/${id}.json`);
    const data = await res.json();

    if (!data || !data.url) {
      return {
        statusCode: 404,
        body: "Short link not found"
      };
    }

    const baseRes = await fetch(`${FIREBASE_URL}/letyParamsUrl.json`);
    const baseUrl = await baseRes.json();

    const lety = new URL(baseUrl);
    const target = new URL(data.url);

    lety.searchParams.forEach((v, k) => {
      target.searchParams.set(k, v);
    });

    await fetch(`${FIREBASE_URL}/links/${id}/clicks.json`, {
      method: "PUT",
      body: JSON.stringify((data.clicks || 0) + 1)
    });

    return {
      statusCode: 302,
      headers: {
        Location: target.toString()
      }
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: "Server error: " + error.toString()
    };
  }
};