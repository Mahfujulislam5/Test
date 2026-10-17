import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const { email, password } = schema.parse(await request.json());
    const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    await createAdminSession(admin.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Please enter a valid email and password." }, { status: 400 });
  }
}
