
export const handler = async () => {
  const key = process.env.GNEWS_API_KEY;

  if (!key) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "GNews API key is missing",
      }),
    };
  }

  try {
    const url = new URL("https://gnews.io/api/v4/search");

    url.searchParams.set("q", "football OR soccer");
    url.searchParams.set("lang", "en");
    url.searchParams.set("max", "10");
    url.searchParams.set("apikey", key);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Could not fetch football news",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900",
      },
      body: JSON.stringify({
        success: true,
        articles: data.articles || [],
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "News service unavailable",
      }),
    };
  }
};
