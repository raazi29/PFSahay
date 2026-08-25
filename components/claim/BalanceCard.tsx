import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function BalanceCard({ balance }: { balance: number }) {
  const { t } = useLanguage();
  return (
    <Card className="bg-primary text-white">
      <p className="text-sm/relaxed text-white/80">{t("balanceLabel")}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{rupee.format(balance)}</p>
    </Card>
  );
}

export function KYCItem({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[15px] text-ink">{label}</span>
      {verified ? (
        <Badge tone="success">
          <CheckCircle2 size={12} className="mr-1" />
          {label && "Verified"}
        </Badge>
      ) : (
        <Badge tone="warning">Pending</Badge>
      )}
    </div>
  );
}
