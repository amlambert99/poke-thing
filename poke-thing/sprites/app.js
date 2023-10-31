const container = document.getElementById("container");
        const searchInput = document.getElementById("search");

        const partyButton = document.getElementById("party-button");

        partyButton.addEventListener("click", () => {
            window.location.href = "party.html";
        });

        const fetchPokemonData = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1292");
                const data = await response.json();
                const pokemonList = data.results;

                for (const pokemon of pokemonList) {
                    await fetchPokemonInfo(pokemon);
                }
            } catch (error) {
                console.error("Error fetching Pokémon data:", error);
            }
        };

        const fetchPokemonInfo = async (pokemon) => {
            try {
                const response = await fetch(pokemon.url);
                const pokemonData = await response.json();
                const types = pokemonData.types.map((type) => type.type.name);
                displayPokemon(pokemonData, types);
            } catch (error) {
                console.error("Error fetching Pokémon info:", error);
            }
        };

        const displayPokemon = (pokemonData, types) => {
            const pokemonDiv = document.createElement("div");
            pokemonDiv.classList.add("pokemon");

            const name = pokemonData.name;
            const spriteURL = pokemonData.sprites.front_default;

            const spriteImg = document.createElement("img");
            spriteImg.src = spriteURL;
            spriteImg.alt = name;

            const nameElement = document.createElement("p");
            nameElement.classList.add("name");
            nameElement.textContent = name;

            // Apply background color based on type
            if (types.length === 2) {
                const backgroundColor1 = getColorForType(types[0]);
                const backgroundColor2 = getColorForType(types[1]);
                pokemonDiv.style.background = `linear-gradient(to right, ${backgroundColor1}, ${backgroundColor1}, ${backgroundColor2}, ${backgroundColor2})`;
            } else if (types.length === 1) {
                const backgroundColor = getColorForType(types[0]);
                pokemonDiv.style.backgroundColor = backgroundColor;
            }

            pokemonDiv.addEventListener("click", () => {
                window.location.href = `pokemon_details.html?name=${name}`;
            })

            pokemonDiv.appendChild(spriteImg);
            pokemonDiv.appendChild(nameElement);

            container.appendChild(pokemonDiv);
        };

        const getColorForType = (type) => {
            // Define color mappings for types (You can expand this)
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

            // If the type is not in the list, use a default color
            return typeColors[type] || "#AAAAAA";
        };

        const filterPokemon = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const pokemonDivs = document.querySelectorAll(".pokemon");

            pokemonDivs.forEach((pokemonDiv) => {
                const name = pokemonDiv.querySelector(".name").textContent.toLowerCase();
                if (name.includes(searchTerm)) {
                    pokemonDiv.style.display = "block";
                } else {
                    pokemonDiv.style.display = "none";
                }
            });
        };

        // Initial data load
        fetchPokemonData();

        // Add event listener for search input
        searchInput.addEventListener("input", filterPokemon);