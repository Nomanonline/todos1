'use client';

interface NavbarProps {
  navVisible: boolean;
  items: string[];
}

export function Navbar({ navVisible, items }: NavbarProps) {
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${navVisible ? 'bg-slate-950/60 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#home" className="text-xl font-black tracking-[0.35em] text-cyan-300 drop-shadow-[0_0_16px_rgba(34,211,238,0.55)]">
          VOID HUNTER
        </a>
        <div className="hidden gap-6 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300 md:flex">
          {items.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative transition duration-300 hover:scale-105 hover:text-cyan-300"
            >
              <span className="absolute inset-x-0 bottom-[-6px] h-[2px] origin-left scale-x-0 bg-cyan-300 transition-transform duration-300 group-hover:scale-x-100" />
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
