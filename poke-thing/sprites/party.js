const partyContainer = document.getElementById("party-container");
const backButton = document.getElementById("back-button");
const homeButton = document.getElementById("home-button");
const clearPartyButton = document.getElementById("clear-party-button");

backButton.addEventListener("click", () => {
    window.history.back();
});
homeButton.addEventListener("click", () => {
  window.location.href = "main.html";
});

clearPartyButton.addEventListener("click", () => {
    clearParty();
})

document.addEventListener("DOMContentLoaded", () => {
    displayParty();
    updateClearButtonVisibility();
});

const fetchPokemonInfo = async (pokemonName) => {
  try {
      const response = await fetch(pokemonName.url);
      const pokemonData = await response.json();
      const types = pokemonData.types.map((type) => type.type.name);
      displayPokemon(pokemonData, types);
  } catch (error) {
      console.error("Error fetching Pokémon info:", error);
  }
};



function displayParty() {
    const party = getPartyFromLocalStorage();
    if (party && party.length > 0) {
        party.forEach((pokemonName) => {
            fetchPokemonData(pokemonName,);
        });
    } else {
        partyContainer.innerHTML = "Your party is empty.";
        clearPartyButton.style.display = "none";
    }
}

function getPartyFromLocalStorage() {
    const party = JSON.parse(localStorage.getItem("party")) || [];
    return party;
}

function fetchPokemonData(pokemonName,) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((response) => response.json())
        .then((data) => {
            const pokemonDiv = document.createElement("div");
            pokemonDiv.classList.add("pokemon");

            const spriteUrl = data.sprites.front_default;

            const spriteImg = document.createElement("img");
            spriteImg.src = spriteUrl;
            spriteImg.alt = pokemonName;

            const nameElement = document.createElement("p");
            nameElement.classList.add("name");
            nameElement.textContent = pokemonName;

            const types = data.types.map((type) => type.type.name);
            if (types.length === 2) {
                const backgroundColor1 = getColorForType(types[0]);
                const backgroundColor2 = getColorForType(types[1]);
                pokemonDiv.style.background = `linear-gradient(to right, ${backgroundColor1}, ${backgroundColor1}, ${backgroundColor2}, ${backgroundColor2})`
            } else if (types.length === 1) {
                const backgroundColor = getColorForType(types[0]);
                pokemonDiv.style.backgroundColor = backgroundColor;
            }

          pokemonDiv.addEventListener("click", () => {
              window.location.href = `pokemon_details.html?name=${pokemonName}`;
          })

            partyContainer.appendChild(pokemonDiv);
            pokemonDiv.appendChild(spriteImg);
            pokemonDiv.appendChild(nameElement);
        })
        .catch((error) => {
            console.error("Error fetching Pokemon data:", error);
        });
}

function clearParty() {
    localStorage.removeItem("party");
    alert("Your party has been cleared.");

    location.reload();

    clearPartyButton.style.display = "none";
}

function updateClearButtonVisibility() {
    const party = getPartyFromLocalStorage();
    if (party.length === 0) {
        clearPartyButton.style.display = "none";
    }
}

function getColorForType(type) {
  const typeColors = {
      normal: "#A8A77A",
      fire: "#EE8130",
      water: "#6390F0",
      electric: "#F7D02C",
      grass: "#7AC74C",
      ice: "#96D9D6",
      fighting: "#C22E28",
      poison: "#A33EA1",
      ground: "#E2BF65",
      flying: "#A98FF3",
      psychic: "#F95587",
      bug: "#A6B91A",
      rock: "#B6A136",
      ghost: "#735797",
      steel: "#B7B7CE",
      dragon: "#6F35FC",
      dark: "#705746",
      fairy: "#D685AD",
  };

  return typeColors[type] || "#AAAAAA";
}

