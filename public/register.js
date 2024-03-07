/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Username already taken
 *       500:
 *         description: Failed to save user
 */

import { BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const password = formData.get("password");
    const password2 = formData.get("password2");

    if (password !== password2) {
      errorMessage.textContent = "Passwords do not match";
      return;
    } else {
      errorMessage.textContent = "";
    }

    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        console.log("User saved successfully");
        const { token } = await response.json();
        localStorage.setItem("token", token);
        window.location.href = "in.html";
      } else {
        const data = await response.json();
        if (data.error === "Username already taken") {
          errorMessage.textContent = "Username already taken";
        } else {
          console.error("Failed to save user");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Response Text:", await response.text());
    }
  });
});
