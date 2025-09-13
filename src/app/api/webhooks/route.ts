import { clerkClient } from '@clerk/nextjs/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

// Add these placeholder functions or import from your database module
async function createOrUpdateUser(userData: any) {
  // Implement your database logic here
  console.log('createOrUpdateUser called with:', userData);
  // Return a mock user object for now - replace with actual implementation
  return { _id: 'mock-user-id' };
}

async function deleteUser(id: string) {
  // Implement your database logic here
  console.log('deleteUser called with id:', id);
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt?.data
    const eventType = evt?.type

    let user: any = null; // Declare user variable in proper scope

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { first_name, last_name, email_addresses, image_url } = evt?.data; // Added missing image_url

      try {
        user = await createOrUpdateUser({ // Fixed: Added parentheses and await
          id,
          first_name,
          last_name,
          email_addresses,
          image_url
        });
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
      } catch (error) {
        console.error('Error updating user metadata:', error);
      }
    }

    if (eventType === 'user.deleted') {
      try {
        await deleteUser(id);
      } catch (error) { // Fixed: Added missing space and proper block structure
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