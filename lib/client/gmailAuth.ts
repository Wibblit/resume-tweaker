export const getGoogleAuthURL = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/auth";

  const options = {
    redirect_uri: "http://localhost:3000/api/email-auth/gmail/callback",
    client_id:
      "493445936272-cd0u6a6940g3d5i3on95tr8g46c7l9jj.apps.googleusercontent.com",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
  };

  const qs = new URLSearchParams(options).toString();
  return `${rootUrl}?${qs}`;
};  
