import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

export const runtime = "nodejs";        // <-- Edge নয়, Node.js
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  // 1) Try reading from the filesystem (Node.js runtime only)
  try {
    const raw = await readFile(process.cwd() + "/public/db.json", "utf8");
    const data = JSON.parse(raw);
    const list = Array.isArray(data.localProducts) ? data.localProducts : [];
    return NextResponse.json(list, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e1) {
    console.error("fs read failed:", e1);

    // 2) Fallback: fetch the public file over HTTP (works on Vercel)
    try {
      const base = new URL(request.url).origin;
      const url = `${base}/db.json?v=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data.localProducts) ? data.localProducts : [];
      return NextResponse.json(list, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    } catch (e2) {
      console.error("http fallback failed:", e2);
      return NextResponse.json(
        { error: "db.json read failed" },
        { status: 500 }
      );
    }
  }
}
