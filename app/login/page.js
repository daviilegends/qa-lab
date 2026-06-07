"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { login } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const result = login(email, password);
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    signIn(result.user);
    router.push("/account");
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Log in</h1>
        <p className="mt-1 text-sm text-zinc-600">Use one of the predictable test accounts to sign in.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Login form" noValidate>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="standard@test.com"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          data-testid="login-email-input"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Password123"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          data-testid="login-password-input"
          required
        />

        {formError ? (
          <p role="alert" className="text-sm text-red-600" data-testid="login-error">
            {formError}
          </p>
        ) : null}

        <Button type="submit" data-testid="login-submit-button">
          Log in
        </Button>
      </form>

      <div className="rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        <p className="font-medium text-zinc-800">Test accounts</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>standard@test.com / Password123</li>
          <li>newuser@test.com / Password123</li>
          <li>subscribed@test.com / Password123</li>
          <li>blocked@test.com / Password123</li>
        </ul>
      </div>
    </div>
  );
}
