export type SlaStatus = 'MET' | 'ON_TRACK' | 'NEAR_OVERDUE' | 'OVERDUE' | 'AWAITING_CLIENT';

export interface SlaCalculation {
  status: SlaStatus;
  remainingMinutes: number;
  formattedRemaining: string;
  overdueMinutes: number;
  formattedOverdue: string;
  isOverdue: boolean;
  isNearOverdue: boolean; // <= 60 mins remaining
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m';
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * 8-Hour First Response SLA Engine
 */
export function calculateFirstResponseSla(
  createdAtStr: string,
  isMet: boolean,
  deadlineStr?: string | null
): SlaCalculation {
  if (isMet) {
    return {
      status: 'MET',
      remainingMinutes: 0,
      formattedRemaining: 'Met',
      overdueMinutes: 0,
      formattedOverdue: '',
      isOverdue: false,
      isNearOverdue: false,
    };
  }

  const now = new Date().getTime();
  const createdTime = new Date(createdAtStr).getTime();
  const deadline = deadlineStr ? new Date(deadlineStr).getTime() : createdTime + 8 * 60 * 60 * 1000;

  const diffMs = deadline - now;
  const diffMinutes = Math.round(diffMs / (60 * 1000));

  if (diffMinutes <= 0) {
    const overdue = Math.abs(diffMinutes);
    return {
      status: 'OVERDUE',
      remainingMinutes: 0,
      formattedRemaining: '0m',
      overdueMinutes: overdue,
      formattedOverdue: formatDuration(overdue),
      isOverdue: true,
      isNearOverdue: false,
    };
  }

  const isNear = diffMinutes <= 60;
  return {
    status: isNear ? 'NEAR_OVERDUE' : 'ON_TRACK',
    remainingMinutes: diffMinutes,
    formattedRemaining: formatDuration(diffMinutes),
    overdueMinutes: 0,
    formattedOverdue: '',
    isOverdue: false,
    isNearOverdue: isNear,
  };
}

/**
 * 24-Hour Subsequent Response SLA Engine
 */
export function calculateSubsequentResponseSla(
  lastCustomerMessageAt?: string | null,
  lastStaffMessageAt?: string | null,
  deadlineStr?: string | null
): SlaCalculation {
  if (!lastCustomerMessageAt) {
    return {
      status: 'AWAITING_CLIENT',
      remainingMinutes: 0,
      formattedRemaining: '',
      overdueMinutes: 0,
      formattedOverdue: '',
      isOverdue: false,
      isNearOverdue: false,
    };
  }

  const customerTime = new Date(lastCustomerMessageAt).getTime();
  const staffTime = lastStaffMessageAt ? new Date(lastStaffMessageAt).getTime() : 0;

  // If staff replied after customer, ball is in customer's court
  if (staffTime > customerTime) {
    return {
      status: 'AWAITING_CLIENT',
      remainingMinutes: 0,
      formattedRemaining: 'Awaiting Client',
      overdueMinutes: 0,
      formattedOverdue: '',
      isOverdue: false,
      isNearOverdue: false,
    };
  }

  const now = new Date().getTime();
  const deadline = deadlineStr ? new Date(deadlineStr).getTime() : customerTime + 24 * 60 * 60 * 1000;

  const diffMs = deadline - now;
  const diffMinutes = Math.round(diffMs / (60 * 1000));

  if (diffMinutes <= 0) {
    const overdue = Math.abs(diffMinutes);
    return {
      status: 'OVERDUE',
      remainingMinutes: 0,
      formattedRemaining: '0m',
      overdueMinutes: overdue,
      formattedOverdue: formatDuration(overdue),
      isOverdue: true,
      isNearOverdue: false,
    };
  }

  const isNear = diffMinutes <= 60;
  return {
    status: isNear ? 'NEAR_OVERDUE' : 'ON_TRACK',
    remainingMinutes: diffMinutes,
    formattedRemaining: formatDuration(diffMinutes),
    overdueMinutes: 0,
    formattedOverdue: '',
    isOverdue: false,
    isNearOverdue: isNear,
  };
}

/**
 * 24-Hour Quotation Expiration Timer
 */
export function calculateQuoteExpiration(quoteExpiresAt?: string | null): {
  isExpired: boolean;
  formattedTime: string;
} {
  if (!quoteExpiresAt) {
    return { isExpired: false, formattedTime: 'No limit' };
  }

  const now = new Date().getTime();
  const expiresAt = new Date(quoteExpiresAt).getTime();
  const diffMs = expiresAt - now;
  const diffMinutes = Math.round(diffMs / (60 * 1000));

  if (diffMinutes <= 0) {
    return { isExpired: true, formattedTime: 'Expired' };
  }

  return { isExpired: false, formattedTime: formatDuration(diffMinutes) };
}
