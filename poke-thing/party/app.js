document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const addToPartyButton = document.getElementById('addToPartyButton');
    const pokemonNameInput = document.getElementById('pokemonName');
    const originalSprite = document.getElementById('originalSprite');
    const shinySprite = document.getElementById('shinySprite');
    const partyList = document.getElementById('partyList');
    const clearPartyButton = document.getElementById('clearPartyButton');
    const originalType = document.getElementById('originalType');
    const shinyType = document.getElementById('shinyType');
    const originalSecondaryType = document.getElementById('originalSecondaryType');
    const shinySecondaryType = document.getElementById('shinySecondaryType');

    generateButton.addEventListener('click', async () => {
        const pokemonName = pokemonNameInput.value.toLowerCase().trim();

        if (pokemonName === '') {
            alert('Please enter a Pokemon name.');
            return;
        }

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (response.status === 404) {
                alert('Pokemon not found. Please check the name.');
                return;
            }
            const data = await response.json();
            updateSpritesAndTypes(data);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching Pokemon data.');
        }
    });

    addToPartyButton.addEventListener('click', () => {
        const pokemonName = pokemonNameInput.value.toLowerCase().trim();

        if (pokemonName === '') {
            alert('Please enter a Pokemon name.');
            return;
        }

        const party = getPartyFromLocalStorage();
        if (party.length >= 6) {
            alert('Your party is already full (maximum of 6 Pokemon).');
            return;
        }

        if (!party.includes(pokemonName)) {
            party.push(pokemonName);
            savePartytoLocalStorage(party);
            displayParty(party);
            pokemonNameInput.value = '';
        } else {
            alert('This Pokemon is already in your Party.');
        }
    });

    clearPartyButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your party?')) {
          clearParty();
        }
    });

    partyList.addEventListener('click', (event) => {
        const clickedPokemonName = event.target.textContent;
        if (clickedPokemonName) {
            showPartyMemberSprite(clickedPokemonName);
        }
    });

    function showPartyMemberSprite(pokemonName) {
        pokemonNameInput.value = pokemonName;
        generateButton.click();
    }

    function clearParty() {
        localStorage.removeItem('pokemonParty');
        displayParty([]);
    };

    function updateSpritesAndTypes(data) {
        const sprites = data.sprites;
        const spriteUrl = sprites['front_default'];
        const shinySpriteUrl = sprites['front_shiny'];
        const types = data.types.map(type => type.type.name);

        originalSprite.src = spriteUrl;
        shinySprite.src = shinySpriteUrl;
        originalType.textContent = `${types[0]}`;
        shinyType.textContent = `${types[0]}`;
        originalSecondaryType.textContent = types[1] ? `${types[1]}` : '';
        shinySecondaryType.textContent = types[1] ? `${types[1]}` : '';

        document.getElementById('originalType').className = `type-${types[0]}`;
        document.getElementById('shinyType').className = `type-${types[0]}`;
        document.getElementById('originalSecondaryType').className = types[1] ? `type-${types[1]}` : '';
        document.getElementById('shinySecondaryType').className = types[1] ? `type-${types[1]}` : '';
    }

    function getPartyFromLocalStorage() {
        const party = JSON.parse(localStorage.getItem('pokemonParty')) || [];
        return party;
    }

    function savePartytoLocalStorage(party) {
        localStorage.setItem('pokemonParty', JSON.stringify(party));
    }

    function displayParty(party) {
        partyList.innerHTML = '';
        party.forEach((pokemonName) => {
            const li = document.createElement('li');
            li.textContent = pokemonName;
            partyList.appendChild(li);
        });
    }

    const initialParty = getPartyFromLocalStorage();
    displayParty(initialParty);
});