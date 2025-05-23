"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className="left_sidebar h-[calc(100vh-5px)]">
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 text-white font-extrabold max-lg:hidden">
            Podcasty
          </h1>
        </Link>

        {sidebarLinks.map(({ route, label, icon }) => {
          const isActive =
            pathname === route || pathname.startsWith(`${route}/`);
          const Icon = icon;
          return (
            <Link
              href={route}
              key={label}
              className={cn(
                "flex items-center justify-center gap-3 py-4 opacity-90 max-lg:px-4 lg:justify-start",
                {
                  "rounded-[4px] border-r-4 border-orange-1 bg-nav-focus font-semibold opacity-100":
                    isActive,
                },
              )}
            >
              <Icon isActive={isActive} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
