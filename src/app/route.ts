import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(25),
  address: z.string().trim().min(8).max(500),
  note: z.string().max(1000).optional().default(""),
  locale: z.enum(["bn","en"]).default("bn"),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(50) })).min(1).max(30)
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const result = await prisma.$transaction(async tx => {
      const ids = [...new Set(input.items.map(i => i.productId))];
      const products = await tx.product.findMany({ where: { id: { in: ids }, active: true } });
      if (products.length !== ids.length) throw new Error("One or more products are unavailable.");
      const lookup = new Map(products.map(p => [p.id,p]));
      let subtotal = 0;
      for (const item of input.items) {
        const p = lookup.get(item.productId)!;
        if (p.stock < item.quantity) throw new Error(`${p.nameEn} has insufficient stock.`);
        subtotal += p.price * item.quantity;
      }
      const orderNumber = `MR-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2,5).toUpperCase()}`;
      const order = await tx.order.create({
        data: {
          orderNumber, customerName: input.customerName, phone: input.phone, address: input.address,
          note: input.note || "", locale: input.locale, subtotal, deliveryFee: 0, total: subtotal,
          items: { create: input.items.map(item => { const p = lookup.get(item.productId)!; return { productId: p.id, productNameEn: p.nameEn, productNameBn: p.nameBn, unitPrice: p.price, quantity: item.quantity }; }) }
        }
      });
      for (const item of input.items) {
        const update = await tx.product.updateMany({ where: { id: item.productId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
        if (update.count !== 1) throw new Error("Stock changed during checkout. Please retry.");
      }
      return order;
    });
    return NextResponse.json({ ok: true, orderNumber: result.orderNumber, total: result.total }, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? "Please check the order form and try again." : error instanceof Error ? error.message : "Unable to place order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
