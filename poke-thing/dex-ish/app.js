const searchButton = document.getElementById('searchButton');
const pokemonNameInput = document.getElementById('pokemonName');
const pokemonSprite = document.getElementById('pokemonSprite');
const typeList = document.getElementById('typeList');

searchButton.addEventListener('click', () => {
    const pokemonName = pokemonNameInput.value.toLowerCase();
    if (pokemonName) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then((response) => response.json())
            .then((data) => {
                const spriteUrl = data.sprites.front_default;
                const types = data.types.map((type) => type.type.name);
                pokemonSprite.innerHTML = `<img src="${spriteUrl}" alt="${pokemonName}">`;
                displayTypeAdvantages(types);
            })
            .catch((error) => {
                console.error(error);
                pokemonSprite.innerHTML = 'Pokémon not found.';
                typeList.innerHTML = '';
            });
    }
});

function displayTypeAdvantages(types) {
    typeList.innerHTML = '';
    types.forEach((type) => {
        fetch(`https://pokeapi.co/api/v2/type/${type}`)
            .then((response) => response.json())
            .then((data) => {
                const { damage_relations } = data;
                const { double_damage_to, half_damage_to } = damage_relations;

                const typeListItem = document.createElement('li');
                typeListItem.innerHTML = `<span class="type ${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>: 
                    Strong against: ${double_damage_to.map((t) => `<span class="type ${t.name}">${t.name}</span>`).join(', ') || 'None'}, 
                    Weak to: ${half_damage_to.map((t) => `<span class="type ${t.name}">${t.name}</span>`).join(', ') || 'None'}`;

                typeList.appendChild(typeListItem);
            })
            .catch((error) => {
                console.error(error);
            });
    });
}