export const handler = async () => {
  const key = process.env.ALLSPORTS_API_KEY;

  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is missing" }),
    };
  }

  try {
    const url = `https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${encodeURIComponent(key)}`;
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not load live scores" }),
    };
  }
};
