"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, ArrowUpRight, Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/#about", label: "О боте" },
  { href: "/#how", label: "Как это работает" },
  { href: "/#webapp", label: "Мини-приложение" },
  { href: "/code", label: "Код" },
  { href: "/deploy", label: "Деплой" },
  { href: "/#creator", label: "Создатель" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-graphite transition-colors duration-300 group-hover:border-accent/40">
            <Ghost className="h-4.5 w-4.5 text-accent" strokeWidth={1.8} />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.22em] text-mist">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline text-[13px] font-medium text-dim transition-colors duration-300 hover:text-mist"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={SITE.botUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary hidden px-4! py-2.5! text-[13px] sm:inline-flex"
          >
            Открыть бота
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-dim transition-colors hover:text-mist lg:hidden"
            aria-label="Меню"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass mt-3 mx-4 overflow-hidden rounded-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-dim transition-colors hover:bg-white/5 hover:text-mist"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={SITE.botUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-2 justify-center text-sm"
              >
                Открыть бота
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
