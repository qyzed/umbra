"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ghost,
  Inbox,
  ChartColumn,
  Settings2,
  Image as ImageIcon,
  Clapperboard,
  Sticker,
  Copy,
  Check,
  Ban,
  Bell,
  BellOff,
  ChevronLeft,
  Trash2,
  Share2,
  RefreshCw,
  EyeOff,
} from "lucide-react";
import { SITE, botDeepLink, shareUrl } from "@/lib/site";

// ————— Типы —————

type Kind = "text" | "photo" | "video" | "sticker";

interface DemoMessage {
  id: number;
  kind: string;
  body: string | null;
  isRead: boolean;
  createdAt: string;
}

interface Stats {
  total: number;
  today: number;
  unread: number;
  bans: number;
  kinds: Record<string, number>;
  days: Array<{ date: string; label: string; count: number }>;
}

type Tab = "inbox" | "stats" | "settings";

interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TgWebApp {
  initDataUnsafe?: { user?: TgUser };
  ready?: () => void;
  expand?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  openTelegramLink?: (url: string) => void;
}

function getTelegram(): TgWebApp | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { Telegram?: { WebApp?: TgWebApp } };
  return w.Telegram?.WebApp ?? null;
}

const KIND_META: Record<Kind, { label: string; icon: typeof ImageIcon }> = {
  text: { label: "Текст", icon: Inbox },
  photo: { label: "Фото", icon: ImageIcon },
  video: { label: "Видео", icon: Clapperboard },
  sticker: { label: "Стикер", icon: Sticker },
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return time;
  return `${d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}, ${time}`;
}

// ————— Компонент страницы —————

export default function MiniAppPage() {
  const [tab, setTab] = useState<Tab>("inbox");
  const [tgUser, setTgUser] = useState<TgUser | null>(null);
  const [messages, setMessages] = useState<DemoMessage[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, sRes] = await Promise.all([
        fetch("/api/messages", { cache: "no-store" }),
        fetch("/api/stats", { cache: "no-store" }),
      ]);
      if (!mRes.ok || !sRes.ok) throw new Error("bad response");
      const mData = (await mRes.json()) as { messages: DemoMessage[] };
      const sData = (await sRes.json()) as Stats;
      setMessages(mData.messages);
      setStats(sData);
    } catch {
      setError("Не удалось загрузить данные. Проверьте соединение.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const tg = getTelegram();
    if (tg) {
      tg.ready?.();
      tg.expand?.();
      tg.setHeaderColor?.("#050708");
      tg.setBackgroundColor?.("#050708");
      const u = tg.initDataUnsafe?.user;
      if (u) setTgUser(u);
    }
    void load();
  }, [load]);

  const markAllRead = () => {
    setMessages((prev) => prev?.map((m) => ({ ...m, isRead: true })) ?? null);
    setStats((prev) => (prev ? { ...prev, unread: 0 } : prev));
  };

  const name = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") : "Владелец ссылки";
  const userId = tgUser?.id ?? 13371337;

  return (
    <main className="relative flex min-h-dvh flex-col border-x border-line bg-ink">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />

      {/* Шапка */}
      <header className="sticky top-0 z-40 border-b border-line bg-coal/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-dim transition-colors hover:text-mist"
            aria-label="На сайт"
          >
            <ChevronLeft className="h-4.5 w-4.5" strokeWidth={1.8} />
          </Link>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/25 bg-accent-deep font-display text-sm font-semibold text-accent">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-mist">{name}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              владелец ссылки · id {userId}
            </p>
          </div>
          <span className="chip px-3! py-1.5!">
            <Ghost className="h-3.5 w-3.5 text-accent" strokeWidth={1.8} />
            {SITE.name}
          </span>
        </div>
      </header>

      {/* Контент */}
      <div className="mx-auto w-full max-w-md flex-1 px-5 pb-32 pt-6">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="glass mt-10 rounded-3xl p-8 text-center">
            <EyeOff className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
            <p className="mt-4 text-[14px] text-dim">{error}</p>
            <button onClick={load} className="btn-ghost mt-6 px-5! py-2.5! text-[13px]">
              <RefreshCw className="h-4 w-4" strokeWidth={1.8} />
              Повторить
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === "inbox" && messages && stats && (
                <InboxTab
                  messages={messages}
                  unread={stats.unread}
                  onMarkAll={markAllRead}
                />
              )}
              {tab === "stats" && stats && <StatsTab stats={stats} />}
              {tab === "settings" && <SettingsTab userId={userId} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Нижняя навигация */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-coal/90 backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-3 px-6 py-2.5">
          {(
            [
              { id: "inbox", label: "Входящие", icon: Inbox },
              { id: "stats", label: "Статистика", icon: ChartColumn },
              { id: "settings", label: "Настройки", icon: Settings2 },
            ] as const
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="relative flex flex-col items-center gap-1 py-1.5"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute -top-2.5 h-0.5 w-8 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative">
                  <item.icon
                    className={`h-5 w-5 transition-colors duration-300 ${active ? "text-accent" : "text-faint"}`}
                    strokeWidth={1.8}
                  />
                  {item.id === "inbox" && (stats?.unread ?? 0) > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-strong px-1 text-[9px] font-bold text-ink">
                      {stats?.unread}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10.5px] transition-colors duration-300 ${active ? "text-mist" : "text-faint"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

// ————— Скелет загрузки —————

function Skeleton() {
  return (
    <div className="space-y-3">
      {[72, 48, 88, 60, 76].map((h, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-line bg-surface/60"
          style={{ height: h, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

// ————— Вкладка «Входящие» —————

function InboxTab({
  messages,
  unread,
  onMarkAll,
}: {
  messages: DemoMessage[];
  unread: number;
  onMarkAll: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "text" | "media">("all");

  const filtered = useMemo(() => {
    if (filter === "text") return messages.filter((m) => m.kind === "text");
    if (filter === "media") return messages.filter((m) => m.kind !== "text");
    return messages;
  }, [messages, filter]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-mist">Входящие</h2>
        {unread > 0 && (
          <button
            onClick={onMarkAll}
            className="text-[12px] font-medium text-accent transition-opacity hover:opacity-75"
          >
            Прочитать все ({unread})
          </button>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {(
          [
            { id: "all", label: "Все" },
            { id: "text", label: "Текст" },
            { id: "media", label: "Медиа" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-xl border px-4 py-2 text-[12.5px] font-medium transition-all duration-300 ${
              filter === f.id
                ? "border-accent/35 bg-accent-deep/60 text-accent"
                : "border-line bg-surface/60 text-faint hover:text-dim"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2.5">
        <AnimatePresence initial={false}>
          {filtered.map((m, i) => {
            const meta = KIND_META[m.kind as Kind] ?? KIND_META.text;
            return (
              <motion.article
                key={m.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
                className="anon-quote px-4! py-3.5!"
              >
                {m.kind !== "text" && (
                  <span className="mb-1.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
                    <meta.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {meta.label} · вложение скрыто
                  </span>
                )}
                <p className="text-[13.5px] leading-relaxed text-mist/90">
                  {m.body ?? "Сообщение без текста"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-faint">
                    <EyeOff className="h-3 w-3" strokeWidth={1.8} />
                    отправитель скрыт
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10px] text-faint">
                    {!m.isRead && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    {fmtTime(m.createdAt)}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-[13px] text-faint">
            В этой категории пока пусто.
          </p>
        )}
      </div>
    </div>
  );
}

// ————— Вкладка «Статистика» —————

function StatsTab({ stats }: { stats: Stats }) {
  const max = Math.max(...stats.days.map((d) => d.count), 1);
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-mist">Статистика</h2>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {[
          { label: "Всего", value: stats.total },
          { label: "Сегодня", value: stats.today },
          { label: "Новых", value: stats.unread },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-line bg-surface/70 px-4 py-4"
          >
            <p className="font-display text-xl font-semibold text-mist">{c.value}</p>
            <p className="mt-1 text-[11px] text-faint">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface/70 p-5">
        <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-faint">
          <ChartColumn className="h-3.5 w-3.5 text-steel" strokeWidth={1.8} />
          активность · 7 дней
        </p>
        <div className="mt-4 flex h-28 items-end gap-2">
          {stats.days.map((d, i) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-t-md"
                style={{
                  background:
                    i === stats.days.length - 1
                      ? "linear-gradient(180deg, #34d399, #0b3b2e)"
                      : "linear-gradient(180deg, rgba(126,166,196,0.55), rgba(22,40,58,0.55))",
                }}
              />
              <span className="font-mono text-[9px] uppercase text-faint">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface/70 p-5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-faint">
          типы вложений
        </p>
        <div className="mt-4 space-y-3">
          {(
            [
              { key: "text", label: "Текст" },
              { key: "photo", label: "Фото" },
              { key: "video", label: "Видео" },
              { key: "sticker", label: "Стикеры" },
            ] as const
          ).map((row) => {
            const value = stats.kinds[row.key] ?? 0;
            const width = stats.total ? Math.round((value / stats.total) * 100) : 0;
            return (
              <div key={row.key} className="flex items-center gap-3">
                <span className="w-16 text-[12px] text-dim">{row.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-graphite">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-steel to-accent"
                  />
                </div>
                <span className="w-8 text-right font-mono text-[11px] text-faint">{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface/70 px-5 py-4">
        <Ban className="h-4.5 w-4.5 text-steel" strokeWidth={1.8} />
        <p className="text-[13px] text-dim">
          В бан-листе: <span className="font-semibold text-mist">{stats.bans}</span>
        </p>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-faint">
          личности скрыты
        </span>
      </div>
    </div>
  );
}

// ————— Вкладка «Настройки» —————

function SettingsTab({ userId }: { userId: number }) {
  const [notifications, setNotifications] = useState(true);
  const [copied, setCopied] = useState(false);
  const [confirmPurge, setConfirmPurge] = useState(false);
  const link = botDeepLink(String(userId));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* буфер недоступен — молча */
    }
  };

  const share = () => {
    const url = shareUrl(link);
    const tg = getTelegram();
    if (tg?.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, "_blank", "noopener");
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-mist">Настройки</h2>

      {/* Ссылка */}
      <div className="mt-5 rounded-2xl border border-line bg-surface/70 p-5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-faint">
          ваша ссылка
        </p>
        <p className="mt-2.5 break-all rounded-xl border border-line bg-graphite/60 px-4 py-3 font-mono text-[12px] text-steel">
          {link}
        </p>
        <div className="mt-3 flex gap-2.5">
          <button onClick={copy} className="btn-ghost flex-1 justify-center py-2.5! text-[12.5px]">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-accent" strokeWidth={2} /> Скопировано
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" strokeWidth={1.8} /> Копировать
              </>
            )}
          </button>
          <button onClick={share} className="btn-primary flex-1 justify-center py-2.5! text-[12.5px]">
            <Share2 className="h-4 w-4" strokeWidth={2} /> Поделиться
          </button>
        </div>
      </div>

      {/* Тумблеры */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface/70">
        <button
          onClick={() => setNotifications(!notifications)}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-graphite">
            {notifications ? (
              <Bell className="h-4 w-4 text-accent" strokeWidth={1.8} />
            ) : (
              <BellOff className="h-4 w-4 text-faint" strokeWidth={1.8} />
            )}
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-medium text-mist">Уведомления</span>
            <span className="block text-[11.5px] text-faint">
              Мгновенные пуши о новых сообщениях
            </span>
          </span>
          <span
            className={`toggle-track flex h-6 w-11 items-center rounded-full px-1 ${
              notifications ? "justify-end bg-accent-strong/80" : "justify-start bg-graphite"
            }`}
          >
            <span className="toggle-knob h-4 w-4 rounded-full bg-mist" />
          </span>
        </button>
      </div>

      {/* Опасная зона */}
      <div className="mt-4 rounded-2xl border border-red-400/15 bg-red-950/10 p-5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-red-300/70">
          опасная зона
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-dim">
          Удаляет ссылку, все сообщения и бан-лист безвозвратно.
        </p>
        {!confirmPurge ? (
          <button
            onClick={() => setConfirmPurge(true)}
            className="mt-3.5 flex items-center gap-2 rounded-xl border border-red-400/25 px-4 py-2.5 text-[12.5px] font-medium text-red-300 transition-colors hover:bg-red-400/10"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.8} />
            Удалить мои данные
          </button>
        ) : (
          <div className="mt-3.5 flex gap-2.5">
            <button
              onClick={() => setConfirmPurge(false)}
              className="btn-ghost py-2.5! text-[12.5px]"
            >
              Отмена
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-red-400/90 px-4 py-2.5 text-[12.5px] font-semibold text-red-950 transition-opacity hover:opacity-90">
              <Trash2 className="h-4 w-4" strokeWidth={2} />
              Подтверждаю удаление
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-faint">
        Демо-режим: данные загружаются из API проекта.
        <br />
        Проект создан{" "}
        <a href={SITE.creatorUrl} target="_blank" rel="noreferrer" className="text-steel hover:text-accent">
          {SITE.creator}
        </a>
      </p>
    </div>
  );
}
