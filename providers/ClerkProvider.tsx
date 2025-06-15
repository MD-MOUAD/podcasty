"use client";

import { ClerkProvider as DefaultClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

const ClerkProvider = ({ children }: { children: ReactNode }) => (
  <DefaultClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    appearance={{
      layout: {
        socialButtonsVariant: "iconButton",
        logoImageUrl: "/icons/logo.svg",
        animations: true,
        logoLinkUrl: "/",
        privacyPageUrl: "#",
        helpPageUrl: "#",
        termsPageUrl: "#",
        shimmer: true,
      },
      variables: {
        colorBackground: "#15171c",
        colorPrimary: "#F97535",
        colorText: "white",
        colorInputBackground: "#1b1f29",
        colorInputText: "white",
        colorNeutral: "#fb923c",
      },
    }}
  >
    {children}
  </DefaultClerkProvider>
);

export default ClerkProvider;
