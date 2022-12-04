// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";
import { v4 as uuid } from "uuid";

const redis = new Redis({
  //@ts-ignore upstash types are wrong
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers = req.headers;
  if (req.headers.origin !== "https://chat.openai.com")
    return res.status(400).json("Invalid origin");
  const html = req.body;
  console.log(html);
  if (req.method !== "OPTIONS") {
    const id = uuid();
    const result = await redis.set(id, html);
    res.status(200).json({ id });
  } else {
    return res.status(200).end();
  }
}
