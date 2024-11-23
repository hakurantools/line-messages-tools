import { serve } from "https://deno.land/std/http/server.ts";

const links: string[] = [];
let currentIndex = 0;

// 固定メッセージとリンク生成関数
function generateMessage(baseMessage: string, repeatCount: number): string {
  const lines = Array.from({ length: repeatCount }, () => {
    const randomHex = Math.random().toString(16).slice(2, 6).toUpperCase();
    return `${baseMessage} #${randomHex}`;
  });
  return lines.join('%0A'); // URLエンコードされた改行
}

const baseURL = "https://line.me/R/msg/text/";
function generateLinks(message: string, count: number): string[] {
  return Array.from({ length: count }, () => `${baseURL}${encodeURIComponent(message)}`);
}

// サーバーの処理
serve(async (req) => {
  if (req.method === "POST") {
    const { baseMessage, repeatCount } = await req.json();
    if (!baseMessage || !repeatCount || repeatCount <= 0) {
      return new Response("Invalid input", { status: 400 });
    }

    const message = generateMessage(baseMessage, repeatCount);
    links.splice(0, links.length, ...generateLinks(message, 50));
    currentIndex = 0;
    return new Response("Links generated", { status: 200 });
  }

  if (req.method === "GET") {
    if (links.length === 0) {
      return new Response("No links available", { status: 404 });
    }
    const link = links[currentIndex];
    currentIndex = (currentIndex + 1) % links.length;
    return new Response(JSON.stringify({ link }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
});
