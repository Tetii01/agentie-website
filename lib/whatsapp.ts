/** Link wa.me cu mesaj precompletat. `number`: format internațional, fără + și spații. */
export function whatsappUrl({ number, message }: { number: string; message: string }) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
