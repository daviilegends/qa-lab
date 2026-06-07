"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CouponForm({ onApply, message }) {
  const [code, setCode] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onApply(code);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" aria-label="Apply coupon code">
      <div className="flex items-end gap-2">
        <Input
          id="coupon-code"
          label="Coupon code"
          placeholder="e.g. WELCOME10"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          data-testid="coupon-input"
        />
        <Button type="submit" variant="secondary" data-testid="apply-coupon-button">
          Apply
        </Button>
      </div>
      {message ? (
        <p role="status" className={`text-sm ${message.tone === "error" ? "text-red-600" : "text-green-700"}`} data-testid="coupon-message">
          {message.text}
        </p>
      ) : null}
    </form>
  );
}
