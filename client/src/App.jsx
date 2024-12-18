import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );
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
              url: pokemon.url,
            };
          })
        );

        setPokemons(detailedPokemons);
      } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
      }
    };

    fetchPokemons();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardClick = (pokemon) => {
    setSelectedPokemon(selectedPokemon === pokemon ? null : pokemon);
  };

  const capitalizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="app">
      <h1>Pokemons</h1>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <div className="pokemon-list">
        {filteredPokemons.map((pokemon, index) => (
          <div
            key={index}
            className={`pokemon-card ${
              selectedPokemon === pokemon ? "selected" : ""
            }`}
            onClick={() => handleCardClick(pokemon)}
          >
            <div className="card-inner">
              {/* Front side: Name and Image */}
              <div
                className={`card-front ${
                  selectedPokemon === pokemon ? "flipped" : ""
                }`}
              >
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <h3>{capitalizeName(pokemon.name)}</h3>
              </div>

              {/* Back side: Details */}
              <div
                className={`card-back ${
                  selectedPokemon === pokemon ? "selected" : ""
                }`}
              >
                <h3>{capitalizeName(pokemon.name)}</h3>
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <p className="pokemon-details">
                  <strong>Base Experience:</strong> {pokemon.base_experience}
                </p>
                <p className="pokemon-details">
                  <strong>Height:</strong> {pokemon.height}
                </p>
                <p className="pokemon-details">
                  <strong>Weight:</strong> {pokemon.weight}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
