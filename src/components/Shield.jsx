export default function Shield({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <path d="M16 3 5 7v8c0 7 4.7 12 11 14 6.3-2 11-7 11-14V7z" fill="var(--accent)" />
      <path d="m11 16 4 4 7-8" stroke="var(--surface)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
