"use client";

import { CookieConsent } from "./cookie-consent";

export function CookieConsentWrapper() {
  return (
    <CookieConsent
      variant="default"
      onAcceptCallback={() => {
      }}
      onDeclineCallback={() => {
      }}
    />
  );
}
