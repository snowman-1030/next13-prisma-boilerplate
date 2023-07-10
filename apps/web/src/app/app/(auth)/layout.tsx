import * as React from "react";

// TODO: update description

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <aside className="border-border col-span-1 flex w-full items-center justify-center border p-3 backdrop-blur-[2px] md:p-6">
        <div className="w-full max-w-lg text-left">
          <h1 className="font-cal text-foreground mb-3 text-2xl">
            Open Source Status Page
          </h1>
          <p className="text-muted-foreground">
            Create your own status page within a couple of minutes. You are
            developer and want to know how it works? <br />
            Check out{" "}
            <a
              href="https://github.com/mxkaske/openstatus"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              GitHub
            </a>{" "}
            and let us know your use case!
          </p>
          {/* Add Demo tracker here? */}
          <div className="h-12" />
          <p className="text-muted-foreground text-right text-sm font-light">
            *your data is safe
          </p>
        </div>
      </aside>
      <main className="container col-span-1 mx-auto flex items-center justify-center md:col-span-1 xl:col-span-2">
        {children}
      </main>
    </div>
  );
}
