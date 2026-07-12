type MetricCardProps = {
  label: string;
  value: string | number;
  icon?: string;
  trend?: { direction: "up" | "down"; text: string };
  variant?: "default" | "primary" | "error";
  children?: React.ReactNode;
};

export function MetricCard({ label, value, icon, trend, variant = "default", children }: MetricCardProps) {
  const baseStyle = "bg-surface-container-lowest p-4 rounded-xl border border-outline-variant";
  const variantStyles = {
    default: baseStyle,
    primary: "bg-primary text-on-primary p-4 rounded-xl relative overflow-hidden",
    error: `${baseStyle} border-l-4 border-l-error`,
  };

  return (
    <div className={variantStyles[variant]}>
      {icon && (
        <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
      )}
      <p className="text-label-md text-on-surface-variant/60 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-headline-md font-bold text-primary">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 ${
          trend.direction === "up" ? "text-green-600" : "text-error"
        }`}>
          <span className="material-symbols-outlined text-sm">
            {trend.direction === "up" ? "trending_up" : "trending_down"}
          </span>
          <span className="text-label-md">{trend.text}</span>
        </div>
      )}
      {children}
    </div>
  );
}
