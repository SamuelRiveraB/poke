const express = require("express");

const app = express();
const port = 8080;

const cors = require("cors");
app.use(cors());

app.get("/api/pokemons", async (req, res) => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();

    const detailedPokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const details = await res.json();
        return {
          name: pokemon.name,
          sprite: details.sprites.front_default,
          base_experience: details.base_experience,
          height: details.height,
          weight: details.weight,
        };
      })
    );

    res.json(detailedPokemons);
  } catch (error) {
    console.error("Failed to fetch Pokémon:", error);
    res.status(500).json({ error: "Failed to fetch Pokémon" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
