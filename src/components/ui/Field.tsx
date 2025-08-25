"use client";

import * as React from "react";

type FieldContextValue = {
  inputId?: string;
  describedById?: string;
  errorId?: string;
};

const FieldContext = React.createContext<FieldContextValue | undefined>(undefined);

export function useFieldContext() {
  const ctx = React.useContext(FieldContext);
  if (!ctx) throw new Error("Field.* must be used inside <Field />");
  return ctx;
}

type FieldProps = {
  id?: string;
  describedById?: string;
  errorId?: string;
  className?: string;
  children: React.ReactNode;
};
export function Field({
  id,
  describedById,
  errorId,
  className = "",
  children,
}: FieldProps) {
  return (
    <FieldContext.Provider value={{ inputId: id, describedById, errorId }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </FieldContext.Provider>
  );
}

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm text-zinc-700 ${className}`}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

type HintProps = React.HTMLAttributes<HTMLParagraphElement>;
export function Hint({ className = "", ...props }: HintProps) {
  return <p className={`text-xs text-zinc-500 ${className}`} {...props} />;
}

type ErrorProps = React.HTMLAttributes<HTMLParagraphElement>;
export function FieldError({ className = "", ...props }: ErrorProps) {
  return <p className={`text-xs text-rose-600 ${className}`} {...props} />;
}
