import { prisma } from "@/lib/prisma";
import Storefront from "@/components/Storefront";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, nameEn: true, nameBn: true, descriptionEn: true, descriptionBn: true, category: true, price: true, stock: true, imageUrl: true }
  });
  return <Storefront products={products} />;
}
