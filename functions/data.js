const FIREBASE_URL = "https://temu-link-converter-default-rtdb.europe-west1.firebasedatabase.app";

exports.handler = async function () {
  try {
    const res = await fetch(`${FIREBASE_URL}/links.json`);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: "Error fetching data"
    };
  }
};