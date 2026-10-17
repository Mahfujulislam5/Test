import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  nameEn: z.string().trim().min(2).max(120),
  nameBn: z.string().trim().min(2).max(120),
  descriptionEn: z.string().max(500).default(""),
  descriptionBn: z.string().max(500).default(""),
  category: z.string().trim().min(2).max(60),
  price: z.number().int().min(0).max(100000000),
  stock: z.number().int().min(0).max(1000000),
  imageUrl: z.string().url().or(z.literal("")).default(""),
  active: z.boolean().default(true)
});

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  try {
    const input = schema.parse(await request.json());
    const product = await prisma.product.create({ data: input });
    return NextResponse.json({ product }, { status:201 });
  } catch (error) {
    return NextResponse.json({ error:error instanceof Error ? error.message : "Invalid product" }, { status:400 });
  }
}
