type RequestData = {
  count: number;
  startTime: number;
};

const userRequests = new Map<string, RequestData>();
const ipRequests = new Map<string, RequestData>();

const LIMIT_DURATION = 60 * 1000; // 1 minute in milliseconds
const USER_REQUEST_LIMIT = 100; // Max requests per user per minute
const IP_REQUEST_LIMIT = 200; // Max requests per IP per minut

const isRateLimited = (
  keyMap: Map<string, RequestData>,
  key: string,
  limit: number
): boolean => {
  const now = Date.now();

  if (!keyMap.has(key)) {
    keyMap.set(key, { count: 1, startTime: now });
    return false;
  }

  const requestData = keyMap.get(key)!;

  // Reset the count if the duration has passed
  if (now - requestData.startTime > LIMIT_DURATION) {
    requestData.count = 1;
    requestData.startTime = now;
    return false;
  }

  // Check if the count exceeds the limit
  if (requestData.count >= limit) {
    return true;
  }

  // Increment the count and update the map
  requestData.count += 1;
  keyMap.set(key, requestData);
  return false;
};

export const rateLimiter = (
  userId: string | undefined,
  ip: string
): boolean => {
  if (userId && isRateLimited(userRequests, userId, USER_REQUEST_LIMIT)) {
    return true;
  }
  if (isRateLimited(ipRequests, ip, IP_REQUEST_LIMIT)) {
    return true;
  }
  return false;
};
