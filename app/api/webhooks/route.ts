import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, image_url, first_name, last_name } =
        evt.data;

      // Create a new user in your database
      const mongoUser = await createUser({
        clerkId: id,
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        email: email_addresses[0].email_address,
        picture: image_url,
      });

      return NextResponse.json({ message: "OK", user: mongoUser });
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, image_url, first_name, last_name } =
        evt.data;

      // Update user in database
      const mongoUser = await updateUser({
        clerkId: id,
        updateData: {
          name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
          email: email_addresses[0].email_address,
          picture: image_url,
        },
        path: `/profile/${id}`, // todo: change the path
      });

      return NextResponse.json({ message: "OK", user: mongoUser });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      const deletedUser = await deleteUser({
        clerkId: id!,
      });

      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    const { id } = evt.data;

    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
