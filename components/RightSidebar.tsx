"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const RightSidebar = () => {
  const { user } = useUser();

  return (
    <section className="right_sidebar h-[calc(100vh-5px)]">
      <div className="mt-5">
        <SignedOut>
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button>Log In</Button>
            </Link>

            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </SignedOut>
      </div>
      <SignedIn>
        <Link href="#" className="flex gap-3 pb-12">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "hover:ring-2 hover:ring-blue-500 transition-all",
              },
            }}
          />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>
          </div>
        </Link>
      </SignedIn>
    </section>
  );
};

export default RightSidebar;
