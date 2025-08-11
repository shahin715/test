import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const raw = await readFile(process.cwd() + "/public/db.json", "utf8");
    const data = JSON.parse(raw);
    const list = Array.isArray(data.localProducts) ? data.localProducts : [];
    return NextResponse.json(list, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "read failed" }, { status: 500 });
  }
}
