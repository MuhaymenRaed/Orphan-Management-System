export default function Card({ children }: { children?: React.ReactNode }) {
  return (
    <li className="w-full h-full bg-[var(--backgroundColor)] border border-[var(--borderColor)] rounded-2xl p-5 md:p-6 flex flex-row items-center justify-between gap-4 md:gap-8 shadow-[var(--cardShadow)] transition-all duration-300 hover:shadow-[var(--cardShadowHover)] hover:-translate-y-0.5">
      {children}
    </li>
  );
}
