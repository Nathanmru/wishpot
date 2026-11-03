"use client";

import { useTransition } from "react";

export default function ConfirmButton({
  action,
  confirmText,
  label,
}: {
  action: () => Promise<void>;
  confirmText: string;
  label: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) start(() => action());
      }}
      className="text-muted underline-offset-4 hover:text-terra hover:underline"
    >
      {label}
    </button>
  );
}
