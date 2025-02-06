// Example of a basic authentication middleware
import { prisma } from "../postgres/postgres.js";

export default async function loginPOCAuth(req, res, next) {
  try {
    const { email, password } = req.body;

    // Example logic to authenticate a POC user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.password === password) {
      // Authentication successful
      req.user = user;
      next();
    } else {
      // Authentication failed
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 