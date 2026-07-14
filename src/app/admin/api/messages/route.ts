// ═══════════════════════════════════════════════
//  GET/PATCH /admin/api/messages — Contact messages
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/admin/auth";

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

async function getMessages(): Promise<any[]> {
  try {
    const raw = await readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveMessages(messages: any[]): Promise<void> {
  await mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
  await writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
}

// GET /admin/api/messages
export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const unread = searchParams.get("unread");

    let messages = await getMessages();
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = messages.filter((m) => !m.read).length;

    if (unread === "true") {
      return NextResponse.json({ unread: unreadCount });
    }

    return NextResponse.json({
      messages,
      total: messages.length,
      unread: unreadCount,
    });
  } catch (err) {
    return NextResponse.json({ messages: [], total: 0, unread: 0 }, { status: 500 });
  }
}

// PATCH /admin/api/messages — Mark as read
export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ message: "ID and action are required." }, { status: 400 });
    }

    const validActions = ["read", "unread", "delete"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ message: `Invalid action. Must be one of: ${validActions.join(", ")}` }, { status: 400 });
    }

    const messages = await getMessages();
    const index = messages.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ message: "Message not found." }, { status: 404 });
    }

    if (action === "read") {
      messages[index].read = true;
    } else if (action === "unread") {
      messages[index].read = false;
    } else if (action === "delete") {
      messages.splice(index, 1);
    }

    await saveMessages(messages);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update message:", err);
    return NextResponse.json({ message: "Failed to update message." }, { status: 500 });
  }
}
