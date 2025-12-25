export default {
  async fetch(request, env) {
    // Health check
    if (request.method === "GET") {
      return new Response(
        "Cloudflare AI Worker is running ✅",
        { status: 200 }
      );
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const { type, prompt } = await request.json();

      if (!prompt) {
        return new Response(
          JSON.stringify({ success: false, message: "Prompt is required" }),
          { status: 400 }
        );
      }

      /* =========================
         IMAGE GENERATION
      ========================= */
      if (type === "image") {
        const image = await env.AI.run(
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          {
            prompt,
            num_steps: 20
          }
        );

        return new Response(image, {
          headers: {
            "Content-Type": "image/png",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      /* =========================
         TITLE GENERATION
      ========================= */
      let finalPrompt = prompt;

      if (type === "title") {
        finalPrompt = `Generate 5 short, catchy blog titles for the topic: ${prompt}`;
      }
        if (type === "resume") {
      finalPrompt = `
          You are an expert resume reviewer.

          Review the resume below and provide:
          1. Overall score out of 10
          2. Strengths
          3. Weaknesses
          4. Suggestions for improvement
          5. ATS optimization tips

          Resume:
          ${prompt}
          `;
              }

      /* =========================
         TEXT / ARTICLE GENERATION
      ========================= */
      const result = await env.AI.run(
        "@cf/meta/llama-2-7b-chat-int8",
        {
          messages: [
            {
              role: "user",
              content: finalPrompt
            }
          ]
        }
      );

      return new Response(
        JSON.stringify({ success: true, result }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        { status: 500 }
      );
    }
  }
};
