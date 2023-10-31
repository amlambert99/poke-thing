document.addEventListener("DOMContentLoaded", () => {
  const pokemonSprite = document.getElementById("pokemon-sprite");
  const pokemonName = document.getElementById("pokemon-name");
  const generateButton = document.getElementById("generate-btn");

  generateButton.addEventListener("click", () => {
    getRandomPokemon();
  });

  async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      pokemonName.textContent = data.name;
      pokemonSprite.src = data.sprites.front_default;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
})