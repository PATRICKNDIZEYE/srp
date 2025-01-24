  import express from "express";
  import bcrypt from "bcrypt";
  import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../models/userModel.js";

  const router = express.Router();

  // Create a new user
  router.post("/", async (req, res) => {
    try {
      const { username, email, password, role, name } = req.body;

      // Validate role (optional step, you can define your own validation rules)
      const validRoles = ['ADMIN', 'USER', 'GUEST'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be one of: ADMIN, USER, GUEST.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with role
      const user = await createUser({
        username,
        email,
        password: hashedPassword,
        role,
        name,
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all users
  router.get("/", async (req, res) => {
    try {
      const users = await getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a user by ID
  router.get("/:id", async (req, res) => {
    try {
      const user = await getUserById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a user by ID
  router.put("/:id", async (req, res) => {
    try {
      const { username, email, password, role, name } = req.body;

      // If password is provided, hash it before updating
      let hashedPassword = password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // Validate role (optional)
      const validRoles = ['ADMIN', 'USER', 'GUEST'];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be one of: ADMIN, USER, GUEST.' });
      }

      // Update user with role
      const user = await updateUser(req.params.id, {
        username,
        email,
        password: hashedPassword,
        role,
        name,
      });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete a user by ID
  router.delete("/:id", async (req, res) => {
    try {
      const user = await deleteUser(req.params.id);
      if (user) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  export default router;
