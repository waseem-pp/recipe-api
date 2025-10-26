const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "recipes.json");

app.use(cors());
app.use(express.json());

// Helper: Load recipes
function loadRecipes() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

// Helper: Save recipes
function saveRecipes(recipes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2));
}

// GET: Fetch all recipes
app.get("/api/recipes", (req, res) => {
  try {
    const recipes = loadRecipes();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Unable to read recipes" });
  }
});

// POST: Add new recipe
app.post("/api/recipes", (req, res) => {
  const { title, ingredients, instructions, cookTime, difficulty } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newRecipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    cookTime,
    difficulty: difficulty || "medium",
  };

  const recipes = loadRecipes();
  recipes.push(newRecipe);
  saveRecipes(recipes);

  res.status(201).json(newRecipe);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
