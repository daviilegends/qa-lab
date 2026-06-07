import Badge from "@/components/ui/Badge";

const STOCK_LABELS = {
  "in-stock": { label: "In stock", tone: "success" },
  "out-of-stock": { label: "Out of stock", tone: "danger" },
};

export default function StockBadge({ status }) {
  const config = STOCK_LABELS[status] ?? { label: status, tone: "neutral" };
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
