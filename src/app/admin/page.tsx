import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  if (!await getAdminSession()) redirect("/admin/login");
  const [products,orders,totalRevenue,pendingOrders] = await Promise.all([
    prisma.product.findMany({orderBy:{createdAt:"desc"}}),
    prisma.order.findMany({include:{items:true},orderBy:{createdAt:"desc"},take:100}),
    prisma.order.aggregate({where:{status:{not:"CANCELLED"}},_sum:{total:true}}),
    prisma.order.count({where:{status:"PENDING"}})
  ]);
  return <AdminDashboard products={products.map(p=>({...p,createdAt:p.createdAt.toISOString(),updatedAt:p.updatedAt.toISOString()}))} orders={orders.map(o=>({...o,createdAt:o.createdAt.toISOString(),updatedAt:o.updatedAt.toISOString()}))} revenue={totalRevenue._sum.total||0} pendingOrders={pendingOrders}/>;
}
