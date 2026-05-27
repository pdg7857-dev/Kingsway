import { Badge } from "@/components/ui/badge";
import { Mail, MessageCircle } from "lucide-react";
import { relTime } from "@/lib/utils";
import type { EmailImport, WhatsAppMessage } from "@prisma/client";

export function EmailPreview({ items }: { items: EmailImport[] }) {
  if (!items.length) return <div className="text-sm text-fg-subtle py-2">No important emails right now.</div>;
  return (
    <ul className="space-y-2">
      {items.map((e) => (
        <li key={e.id} className="flex gap-3 rounded-lg border border-border-subtle bg-bg-raised/30 p-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-bg-raised text-fg-muted">
            <Mail className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-fg truncate">{e.from}</span>
              <Badge tone="warn">imp {e.importance}</Badge>
            </div>
            <div className="text-[12px] text-fg-muted truncate">{e.subject ?? "(no subject)"}</div>
            <div className="text-[11px] text-fg-subtle truncate">{e.snippet}</div>
            <div className="text-[10px] text-fg-subtle">{relTime(e.receivedAt)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function WhatsAppPreview({ items }: { items: WhatsAppMessage[] }) {
  if (!items.length) return <div className="text-sm text-fg-subtle py-2">No customer inquiries waiting.</div>;
  return (
    <ul className="space-y-2">
      {items.map((m) => (
        <li key={m.id} className="flex gap-3 rounded-lg border border-border-subtle bg-bg-raised/30 p-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-success-soft text-success">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-fg truncate">{m.contactName ?? m.contactPhone}</span>
              <Badge tone="success">{m.direction}</Badge>
            </div>
            <div className="text-[12px] text-fg-muted truncate">{m.body}</div>
            <div className="text-[10px] text-fg-subtle">{relTime(m.receivedAt)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
