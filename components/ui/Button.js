const VARIANT_CLASSES = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-700 disabled:bg-zinc-300",
  secondary: "border border-zinc-300 text-zinc-800 hover:bg-zinc-50 disabled:text-zinc-400",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

export default function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
