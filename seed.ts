import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password === "change-this-before-deploying") {
    throw new Error("Set ADMIN_EMAIL and a strong ADMIN_PASSWORD in .env before seeding.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { nameEn: "Wireless Earbuds", nameBn: "ওয়্যারলেস ইয়ারবাড", descriptionEn: "Compact everyday audio for music and calls.", descriptionBn: "গান শোনা ও কলের জন্য কমপ্যাক্ট ইয়ারবাড।", category: "Audio", price: 1250, stock: 20, imageUrl: "", active: true },
        { nameEn: "Fast Charging Adapter", nameBn: "ফাস্ট চার্জিং অ্যাডাপ্টার", descriptionEn: "A handy charger for compatible devices.", descriptionBn: "সামঞ্জস্যপূর্ণ ডিভাইসের জন্য চার্জার।", category: "Accessories", price: 850, stock: 30, imageUrl: "", active: true },
        { nameEn: "USB-C Cable", nameBn: "USB-C কেবল", descriptionEn: "A practical charging and data cable.", descriptionBn: "চার্জিং ও ডেটা ট্রান্সফারের কেবল।", category: "Mobile", price: 350, stock: 50, imageUrl: "", active: true },
        { nameEn: "Smart Watch", nameBn: "স্মার্টওয়াচ", descriptionEn: "Everyday style with handy smart features.", descriptionBn: "প্রতিদিনের ব্যবহারের জন্য স্মার্টওয়াচ।", category: "Smart gadgets", price: 1850, stock: 12, imageUrl: "", active: true },
        { nameEn: "Power Bank", nameBn: "পাওয়ার ব্যাংক", descriptionEn: "Extra power when you are away from a socket.", descriptionBn: "বাইরে থাকলে ডিভাইসে অতিরিক্ত চার্জ।", category: "Accessories", price: 1450, stock: 18, imageUrl: "", active: true },
        { nameEn: "Bluetooth Speaker", nameBn: "ব্লুটুথ স্পিকার", descriptionEn: "Portable sound for your room or get-together.", descriptionBn: "ঘর বা আড্ডার জন্য পোর্টেবল স্পিকার।", category: "Audio", price: 1100, stock: 15, imageUrl: "", active: true }
      ]
    });
  }
  console.log("Admin account ready. Sample products are seeded.");
}

main().finally(async () => prisma.$disconnect());
