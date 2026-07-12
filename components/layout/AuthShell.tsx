import { Icon } from "@/components/ui/Icon";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-highest via-surface to-background" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#000f3f 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[80px]" />
      </div>

      <main className="relative z-10 w-full max-w-[480px] px-4 md:px-0">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            <h1 className="text-headline-md font-bold text-primary tracking-tight">ES Payment</h1>
          </div>
          <p className="text-on-surface-variant text-body-sm tracking-wide uppercase text-xs opacity-70">
            Admin Console • Secure Access
          </p>
        </div>

        <div className="glass-panel border border-outline-variant/30 rounded-xl p-4 md:p-8 shadow-sm">
          <div className="mb-4">
            <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">{title}</h2>
            <p className="text-on-surface-variant text-body-md">{subtitle}</p>
          </div>

          {children}

          {footer && (
            <div className="mt-6 flex flex-col gap-3">{footer}</div>
          )}
        </div>

        <footer className="mt-6 text-center">
          <nav className="flex justify-center gap-3 text-on-surface-variant font-label-md opacity-50">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <span>•</span>
            <a className="hover:text-primary transition-colors" href="#">Support Desk</a>
            <span>•</span>
            <a className="hover:text-primary transition-colors" href="#">Compliance</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
