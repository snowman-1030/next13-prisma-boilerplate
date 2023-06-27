import { Redis } from "@openstatus/upstash";

const redis = Redis.fromEnv();

export async function GET(req: Request) {
  const RANDOM = Math.random() > 0.9;
  try {
    // TODO: connect tinybird, upstash and planetscale
    await redis.ping();
    if (RANDOM) {
      throw new Error("Arg");
    }
    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Error", { status: 500 });
  }
}
