const params = new URLSearchParams(window.location.search);
const pokemonName = params.get("name");

const homeButton = document.getElementById("home-button");
const addButton = document.getElementById("add-to-party-button");
const partyButton = document.getElementById("party-button");
const backButton = document.getElementById("back-button");

backButton.addEventListener("click", () => {
    window.history.back();
});

partyButton.addEventListener("click", () => {
    window.location.href = "party.html";
});

homeButton.addEventListener("click", () => {
    window.location.href = "main.html";
});

document.addEventListener("DOMContentLoaded", () => {
    const pokemonName = window.location.search.split("=")[1];
    displayPokemonDetails(pokemonName);
});

function displayPokemonDetails(pokemonName) {
    const party = getPartyFromLocalStorage();
    if (party.includes(pokemonName)) {
        addButton.textContent = "Remove from Party";
        document.getElementById("add-to-party-button").className = 'remove';
        addButton.addEventListener("click", () => {
            removeFromParty(pokemonName);
        });
    } else {
        document.getElementById('add-to-party-button').className = 'add';
        addButton.addEventListener("click", () => {
            addToParty(pokemonName);
        });
    }
}

function getPartyFromLocalStorage() {
    const party = JSON.parse(localStorage.getItem("party")) || [];
    return party;
}

function addToParty(pokemonName) {
    const party = getPartyFromLocalStorage();

    if (party.length >= 6) {
        alert("Your party is full. You cannot add more Pokemon.");
        return;
    }

    if (party.includes(pokemonName)) {
        alert("This Pokemon is already in your party.");
        return;
    }

    party.push(pokemonName);
    localStorage.setItem("party", JSON.stringify(party));


    addButton.textContent = "Remove from Party";
    addButton.removeEventListener("click", addToParty);
    addButton.addEventListener("click", () => {
        removeFromParty(pokemonName);
    });
    
    document.getElementById("add-to-party-button").className = 'remove';

    alert(`Added ${pokemonName} to your party!`);
}

function removeFromParty(pokemonName) {
    const party = getPartyFromLocalStorage();
    const index = party.indexOf(pokemonName);

    if (index !== -1) {
        party.splice(index, 1);
        localStorage.setItem("party", JSON.stringify(party));

        addButton.textContent = "Add to Party";
        addButton.removeEventListener("click", removeFromParty);
        addButton.addEventListener("click", () => {
            addToParty(pokemonName);
        });

        alert(`Removed ${pokemonName} from your party.`);
    }
    
    document.getElementById("add-to-party-button").className = 'add';
}

if (pokemonName) {
    const pokemonDefaultImage = document.getElementById("pokemon-default-image");
    const pokemonShinyImage = document.getElementById("pokemon-shiny-image");
    const pokemonInfo = document.getElementById("pokemon-info");

    const fetchPokemonDetails = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const data = await response.json();

            // Fetch the types of the Pokémon
            const types = data.types.map((type) => type.type.name);

            // Determine background color based on the number of types
            if (types.length === 2) {
                // If the Pokémon has two types, split the background color
                const backgroundColor1 = getColorForType(types[0]);
                const backgroundColor2 = getColorForType(types[1]);
                document.body.style.background = `linear-gradient(to right, ${backgroundColor1}, ${backgroundColor1}, ${backgroundColor2}, ${backgroundColor2})`;
            } else if (types.length === 1) {
                // If the Pokémon has only one type, set the background color
                document.body.style.backgroundColor = getColorForType(types[0]);
            }

            // Capitalize the Pokemon name
            const capitalizedPokemonName = capitalizeFirstLetter(pokemonName);

            // Display the Pokemon image
            pokemonDefaultImage.src = data.sprites.front_default;
            pokemonShinyImage.src = data.sprites.front_shiny;

            // Display Pokemon Information
            if (types.length === 2) {
                pokemonInfo.innerHTML = `
                <h2>${capitalizedPokemonName}</h2>
                <p id="pType1">${types[0]}</p>
                <p id="pType2">${types[1]}</p>
                <p>Height: ${data.height / 10} m</p>
                <p>Weight: ${data.weight / 10} kg</p>
                `;
            } else if (types.length === 1) {
                pokemonInfo.innerHTML = `
                <h2>${capitalizedPokemonName}</h2>
                <p id="pType1">${types[0]}</p>
                <p>Height: ${data.height / 10} m</p>
                <p>Weight: ${data.weight / 10} kg</p>
                `;
            }

            document.getElementById("pType1").className = `type-${types[0]}`;
            document.getElementById("pType2").className = `type-${types[1]}`;
        } catch (error) {
            console.error("Error fetching Pokemon details:", error);
        }
    };

    fetchPokemonDetails();
}

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

function getColorForType(type) {
    return typeColors[type] || "#AAAAAA";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}