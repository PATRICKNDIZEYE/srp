import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connection = async () => {
  try {
    await prisma.$connect();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connection, prisma };
