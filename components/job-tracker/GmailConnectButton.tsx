import { getGoogleAuthURL } from "@/lib/client/gmailAuth";

const ConnectGmailButton = () => {
  const handleGmailAuth = () => {
    window.location.href = getGoogleAuthURL();
  };

  return (
    <button onClick={handleGmailAuth} className="btn btn-primary">
      Connect Gmail
    </button>
  );
};

export default ConnectGmailButton;
