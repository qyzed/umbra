export const SITE = {
  name: "UMBRA",
  tagline: "Анонимные сообщения в Telegram",
  botUsername: "UmbraAnonBot",
  botUrl: "https://t.me/UmbraAnonBot",
  creator: "Rin",
  creatorUrl: "https://t.me/Rinbland",
  creatorHandle: "@Rinbland",
} as const;

export const SHARE_TEXT = "Привет. Оставь мне анонимное сообщение — я не узнаю, кто ты.";

export function botDeepLink(payload: string) {
  return `${SITE.botUrl}?start=${encodeURIComponent(payload)}`;
}

export function shareUrl(link: string) {
  const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(SHARE_TEXT)}`;
  return url;
}
