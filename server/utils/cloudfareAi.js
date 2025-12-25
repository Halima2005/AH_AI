export const generateWithCloudflare = async (prompt, maxTokens = 500) => {
  const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const API_TOKEN = process.env.CF_AI_TOKEN;

  if (!ACCOUNT_ID || !API_TOKEN) {
    throw new Error("Cloudflare credentials missing");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful article writer." },
          { role: "user", content: prompt }
        ],
        max_tokens: maxTokens,
      }),
    }
  );

  const result = await response.json();

  if (!result.success) {
    console.error(result);
    throw new Error("Cloudflare AI authentication failed");
  }

  return result.result.response;
};
