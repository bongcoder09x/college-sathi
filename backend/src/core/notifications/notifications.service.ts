import { Injectable, Logger } from "@nestjs/common";

export type Channel = "inapp" | "email" | "sms" | "push";

export type Template = { key: string; channel: Channel[]; subject: string; body: string };

const TEMPLATES: Template[] = [
  { key: "fees.reminder", channel: ["sms", "email"], subject: "Fee reminder", body: "₹{{amount}} is due on {{dueDate}}. Pay from the parent portal." },
  { key: "attendance.shortage", channel: ["sms"], subject: "Attendance shortage", body: "{{student}} is at {{percent}}% attendance in {{subject}}." },
  { key: "admission.offer", channel: ["email", "inapp"], subject: "Offer of admission", body: "Congratulations — your offer for {{programme}} is ready." },
  { key: "outpass.decision", channel: ["inapp", "push"], subject: "Outpass {{status}}", body: "Your outpass for {{when}} was {{status}}." },
];

@Injectable()
export class NotificationsService {
  private readonly log = new Logger(NotificationsService.name);
  private readonly outbox: any[] = [];
  private readonly preferences = new Map<string, Channel[]>();

  templates() {
    return TEMPLATES;
  }

  setPreference(userId: string, channels: Channel[]) {
    this.preferences.set(userId, channels);
    return { userId, channels };
  }

  send(input: { userId: string; template: string; data?: Record<string, string>; channels?: Channel[] }) {
    const template = TEMPLATES.find((t) => t.key === input.template);
    if (!template) return { queued: false, error: "Unknown template" };
    const channels = input.channels || this.preferences.get(input.userId) || template.channel;
    const body = template.body.replace(/\{\{(\w+)\}\}/g, (_m, key) => input.data?.[key] ?? `{{${key}}}`);
    const row = { id: `msg_${this.outbox.length + 1}`, userId: input.userId, template: input.template, subject: template.subject, body, channels, status: "queued", at: new Date().toISOString() };
    this.outbox.unshift(row);
    this.log.log(`queued ${input.template} → ${input.userId} via ${channels.join(",")}`);
    return { queued: true, message: row };
  }

  outboxList(userId?: string) {
    return this.outbox.filter((m) => (userId ? m.userId === userId : true));
  }
}
