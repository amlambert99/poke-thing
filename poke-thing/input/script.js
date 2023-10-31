document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const pokemonNameInput = document.getElementById('pokemonName');
    const originalSprite = document.getElementById('originalSprite');
    const shinySprite = document.getElementById('shinySprite');

    const generationButtons = document.querySelectorAll('#generationButtons button');
    let currentGeneration = 1;

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
            updateSprites(data);

        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while fetching Pokemon data.');
        }
    });

    generationButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            currentGeneration = index + 1;
            generateButton.click();
        });
    });

    function updateSprites(data) {
        const sprites = data.sprites;
        const spriteUrl = sprites['front_default'];
        const shinySpriteUrl = sprites['front_shiny'];

        originalSprite.src = spriteUrl;
        shinySprite.src = shinySpriteUrl;

        if (data.sprites.versions) {
            const versionSprites = data.sprites.versions[currentGeneration];
            if (versionSprites) {
                const generationSpriteUrl = versionSprites.front_default;
                const generationShinySpriteUrl = versionSprites.front_shiny;

                originalSprite.src = generationSpriteUrl || spriteUrl;
                shinySprite.src = generationShinySpriteUrl || shinySpriteUrl;
            }
        }
    }
});