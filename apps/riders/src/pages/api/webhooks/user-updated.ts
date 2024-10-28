import { Webhook } from "svix";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { prisma } from "@acme/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405);
  }
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.USER_UPDATED_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add USER_UPDATED_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Error occured -- no svix headers" });
  }

  const body = (await buffer(req)).toString();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).json({ Error: err });
  }

  try {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      primary_email_address_id,
      image_url,
    } = evt.data as UserJSON;

    const email = email_addresses.find(
      (email) => email.id === primary_email_address_id,
    )?.email_address;

    await prisma.user.upsert({
      where: {
        clerkId: id,
      },
      update: {
        email: email,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
      create: {
        clerkId: id,
        email: email,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
    });

    return res.status(200).json({ response: "Success" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
