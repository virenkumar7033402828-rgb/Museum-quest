import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Museum Quest — Restore the Missing Labels",
      },
      {
        name: "description",
        content:
          "A short historical mystery in three missions. Restore three missing exhibit labels and learn the real stories behind the Rosetta Stone, the Antikythera Mechanism and Ötzi the Iceman.",
      },
      { name: "theme-color", content: "#16181a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&display=swap",
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="grid min-h-dvh place-items-center bg-paper px-6 text-center">
      <div>
        <h1 className="text-4xl text-carbon">Not in this gallery</h1>
        <p className="mt-3 text-base text-graphite">
          That page isn&rsquo;t part of the exhibit.
        </p>
        <a
          className="mt-6 inline-block min-h-[44px] text-base font-semibold text-brass underline decoration-2 underline-offset-4"
          href="/"
        >
          Return to Museum Quest
        </a>
      </div>
    </main>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
