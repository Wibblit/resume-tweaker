export const getGoogleAuthURL = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/auth";

  const options = {
    redirect_uri: (
      process.env.NEXT_PUBLIC_GOOGLE_NOTIFICATION_SERVICE_REDIRECT_URL || ""
    ).toString(),
    client_id: (
      process.env.NEXT_PUBLIC_GOOGLE_NOTIFICATION_SERVICE_AUTH_ID || ""
    ).toString(),
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
  };

  const qs = new URLSearchParams(options).toString();
  return `${rootUrl}?${qs}`;
};
