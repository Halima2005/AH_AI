export const generateWithCloudflare = async (
  prompt,
  type = "text" // "text" | "title" | "image"
) => {
  const WORKER_URL = process.env.CLOUDFLARE_AI_WORKER_URL;

  if (!WORKER_URL) {
    throw new Error("Cloudflare AI Worker URL missing");
  }

  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type,
      prompt
    })
  });

  const contentType = response.headers.get("content-type");

  // 🖼️ IMAGE RESPONSE
  if (contentType && contentType.includes("image")) {
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer); // return image buffer
  }

  // 📝 TEXT / TITLE RESPONSE
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "AI Worker failed");
  }

  return data.result.response;
};
