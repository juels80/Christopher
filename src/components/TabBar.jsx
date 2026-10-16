const TABS = [
  {
    id: "home",
    label: "Home",
    icon: <path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" fill="currentColor" />,
  },
  {
    id: "help",
    label: "Help",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17.5" r="1.2" fill="currentColor" />
      </>
    ),
  },
];

export default function TabBar({ page, onChange }) {
  return (
    <nav className="tabs">
      {TABS.map((t) => (
        <button key={t.id} aria-current={page === t.id ? "page" : undefined} onClick={() => onChange(t.id)}>
          <svg viewBox="0 0 24 24" width="24" height="24">{t.icon}</svg>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
