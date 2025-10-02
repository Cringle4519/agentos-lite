// pages/api/analyze.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set this in Vercel env vars
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    const prompt = `
You are a real estate DealEngine + FutureValue bot. Return STRICT JSON only.

INPUT:
Property: { address: "${body.address}", list_price: ${body.list_price}, beds: ${body.beds}, baths: ${body.baths}, sqft: ${body.sqft}, dom: ${body.dom} }
Buyer: { financing: "${body.buyer_financing}", close_days: ${body.buyer_close_days} }
Comps: [
  { price: ${body.comp1_price}, sqft: ${body.comp1_sqft}, dom: ${body.comp1_dom} },
  { price: ${body.comp2_price}, sqft: ${body.comp2_sqft}, dom: ${body.comp2_dom} },
  { price: ${body.comp3_price}, sqft: ${body.comp3_sqft}, dom: ${body.comp3_dom} }
]

TASKS:
1) FUTURE VALUE: Give forecast_curve with values for year 1, 5, 10. Add forecast_confidence (0–1).
2) DEAL ENGINE: Build 5 rows of deal_matrix with {offer_price, close_days, accept_prob_0to1, notes}.
3) Pick best_offer with price, close_days, and reason.

OUTPUT STRICT JSON ONLY:
{
  "forecast_curve": [
    {"year":1,"value":0},
    {"year":5,"value":0},
    {"year":10,"value":0}
  ],
  "forecast_confidence": 0.0,
  "deal_matrix": [
    {"offer_price":0,"close_days":0,"accept_prob_0to1":0.0,"notes":""}
  ],
  "best_offer": {"offer_price":0,"close_days":0,"reason":""}
}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    // Try to parse JSON safely
    let output;
    try {
      output = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      return res.status(500).json({ error: "Invalid JSON returned", raw: completion.choices[0].message.content });
    }

    res.status(200).json(output);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}add analyze API route
