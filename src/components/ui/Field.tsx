"use client";

/**
 * Underlined form field — the input treatment used on the reference contact
 * panel. The label doubles as the placeholder and the rule highlights on focus.
 */
export function Field({
  name,
  label,
  type = "text",
  required,
  error,
  textarea,
  autoComplete,
  className,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  textarea?: boolean;
  autoComplete?: string;
  className?: string;
  defaultValue?: string;
}) {
  const shared = [
    "peer w-full bg-transparent pt-5 pb-2.5 font-sans text-[14.5px] text-ink",
    "placeholder:text-transparent focus:outline-none",
    "border-b transition-colors duration-300",
    error
      ? "border-red-400/70"
      : "border-white/18 hover:border-white/35 focus:border-verdigris",
  ].join(" ");

  return (
    <div className={`relative ${className ?? ""}`}>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          required={required}
          defaultValue={defaultValue}
          placeholder={label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`${shared} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          placeholder={label}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={shared}
        />
      )}

      <label
        htmlFor={name}
        className={[
          "text-ink-dim pointer-events-none absolute left-0 font-sans transition-all duration-300",
          "top-5 text-[14.5px]",
          "peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.12em] peer-focus:uppercase",
          "peer-[&:not(:placeholder-shown)]:top-0",
          "peer-[&:not(:placeholder-shown)]:text-[11px]",
          "peer-[&:not(:placeholder-shown)]:tracking-[0.12em]",
          "peer-[&:not(:placeholder-shown)]:uppercase",
        ].join(" ")}
      >
        {label}
        {required ? <span className="text-verdigris ml-0.5">*</span> : null}
      </label>

      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-[12px] text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
