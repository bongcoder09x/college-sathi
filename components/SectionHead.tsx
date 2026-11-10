export default function SectionHead({
  eyebrow,
  title,
  body,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="h2 mt-2 text-ink">{title}</h2>
        {body ? <p className="muted mt-3">{body}</p> : null}
      </div>
      {action}
    </div>
  );
}
