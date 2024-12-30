import React from 'react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://github.com/condyl"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Connor Bernard
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/condyl/resume-creator-frontend"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/legal/privacy-policy"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal/terms"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
