/**
 * Mailcow Enterprise Mail Server Integration Client
 * Synchronizes users, mailboxes, and passwords in real-time between
 * the HR Sports Manufacturing Operations Dashboard and the Mailcow VPS.
 */

const MAILCOW_API_URL = process.env.MAILCOW_API_URL || 'https://mail.thehrsports.com';
const MAILCOW_API_KEY = process.env.MAILCOW_API_KEY || 'BD5560-120D18-802C0F-0B24A4-3913D5';

interface MailcowResponse {
  type: 'success' | 'danger' | 'warning' | 'info';
  msg: string | string[];
  log?: any[];
}

/**
 * Update a user's mailbox password in Mailcow
 */
export async function syncMailboxPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!email || !newPassword) {
    return { success: false, message: 'Email and new password are required' };
  }

  // Only sync for the enterprise domain
  if (!email.toLowerCase().endsWith('@thehrsports.com')) {
    return { success: true, message: 'Non-enterprise domain skipped' };
  }

  try {
    const res = await fetch(`${MAILCOW_API_URL}/api/v1/edit/mailbox`, {
      method: 'POST',
      headers: {
        'X-API-Key': MAILCOW_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [email.toLowerCase()],
        attr: {
          password: newPassword,
          password2: newPassword,
        },
      }),
    });

    const data: MailcowResponse[] = await res.json();
    const lastItem = Array.isArray(data) ? data[data.length - 1] : data;

    if (lastItem && (lastItem.type === 'success' || (Array.isArray(lastItem.msg) && lastItem.msg[0] === 'mailbox_modified'))) {
      console.log(`[Mailcow Sync] Password updated for ${email}`);
      return { success: true, message: 'Mailbox password updated successfully' };
    }

    console.warn(`[Mailcow Sync Warning] Failed to update ${email}:`, data);
    return { success: false, message: JSON.stringify(data) };
  } catch (err: any) {
    console.error(`[Mailcow Sync Error] ${email}:`, err);
    return { success: false, message: err?.message || 'Network error updating Mailcow' };
  }
}

/**
 * Provision a brand new mailbox for a newly hired staff member
 */
export async function createMailbox(
  fullName: string,
  email: string,
  password: string,
  quotaMb: number = 5120
): Promise<{ success: boolean; message: string }> {
  if (!email.toLowerCase().endsWith('@thehrsports.com')) {
    return { success: true, message: 'Non-enterprise domain skipped' };
  }

  const [local_part, domain] = email.toLowerCase().split('@');

  try {
    const res = await fetch(`${MAILCOW_API_URL}/api/v1/add/mailbox`, {
      method: 'POST',
      headers: {
        'X-API-Key': MAILCOW_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain,
        local_part,
        name: fullName,
        password,
        password2: password,
        quota: quotaMb,
        active: 1,
      }),
    });

    const data: MailcowResponse[] = await res.json();
    console.log(`[Mailcow Create] Mailbox provisioned for ${email}:`, data);
    return { success: true, message: 'Mailbox created successfully' };
  } catch (err: any) {
    console.error(`[Mailcow Create Error] ${email}:`, err);
    return { success: false, message: err?.message || 'Error creating Mailcow mailbox' };
  }
}

/**
 * Enable or disable a mailbox (e.g. when staff member is deactivated)
 */
export async function setMailboxStatus(
  email: string,
  active: boolean
): Promise<{ success: boolean }> {
  if (!email.toLowerCase().endsWith('@thehrsports.com')) return { success: true };

  try {
    await fetch(`${MAILCOW_API_URL}/api/v1/edit/mailbox`, {
      method: 'POST',
      headers: {
        'X-API-Key': MAILCOW_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [email.toLowerCase()],
        attr: {
          active: active ? 1 : 0,
        },
      }),
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
