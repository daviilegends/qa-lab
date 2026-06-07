// Reusable loyalty-points callout used on PDP, cart, checkout and confirmation.
// Keeps copy/styling consistent so QA can target it with one stable testid pattern.
export default function LoyaltyBanner({ title, message, footnote, testId }) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-cta-200 bg-cta-50 p-4"
      data-testid={testId}
    >
      <span aria-hidden="true" className="mt-0.5 text-xl text-cta-600">
        ★
      </span>
      <div>
        <p className="font-heading text-sm font-semibold text-cta-600">{title}</p>
        <p className="text-sm text-zinc-700">{message}</p>
        {footnote ? <p className="mt-1 text-xs text-zinc-500">{footnote}</p> : null}
      </div>
    </div>
  );
}
