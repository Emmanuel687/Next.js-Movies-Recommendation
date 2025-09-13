import { clerkClient } from '@clerk/nextjs/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { createOrUpdateUser, deleteUser } from '@/app/lib/actions/user.actions'


export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Extract event data
    const { id } = evt?.data
    const eventType = evt?.type

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

    let user: any = null; // Declare user variable in proper scope

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { first_name, last_name, email_addresses, image_url } = evt?.data;

      try {
        // Call the actual database function with the correct parameter structure
        user = await createOrUpdateUser(
          id,
          first_name,
          last_name,
          image_url,
          email_addresses
        );
        console.log('User created/updated successfully:', user);
      } catch (error) {
        console.error('Error creating/updating user:', error);
        return new Response('Error processing user', { status: 400 });
      }
    }

    if (user && eventType === 'user.created') {
      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(id, {
          publicMetadata: { userMongoId: user._id.toString() }
        });
        console.log('User metadata updated successfully');
      } catch (error) {
        console.error('Error updating user metadata:', error);
      }
    }

    if (eventType === 'user.deleted') {
      try {
        await deleteUser(id);
        console.log('User deleted successfully');
      } catch (error) {
        console.log('Error deleting user:', error);
        return new Response('Error deleting user', { status: 400 });
      }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}