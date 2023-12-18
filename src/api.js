import { saveToLocalStorage, getFromLocalStorage } from "./helpers.js";

//API call to fetch pokemon data
export async function fetchPokemon(pokemon) {
    try {
        let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
        let hr = await fetch(url);

        if (!hr.ok) {
            throw new Error(`Failed to fetch Pokemon data for ${pokemon}`);
        }
        let pokemonData = await hr.json();

        //debugging, show the fetched pokemon
        console.log(pokemonData);

        //call to update the html elements with pokemon data
        updatePokemonData(pokemonData);
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
    }
}
//API call to fetch Ability data
export async function fetchAbility(ability) {
    try {
        let url = `https://pokeapi.co/api/v2/ability/${ability}`;
        let hr = await fetch(url);
        if (!hr.ok) {
            throw new Error(`Failed to fetch Pokemon data for ${pokemon}`);
        }

        let abilityData = await hr.json();

        // Cache the data
        saveToLocalStorage(`ability-${ability}`, abilityData);

        //debugging, show the fetched ability
        console.log(abilityData);

        //call to update the html elements with ability data
        updateAbilityData(abilityData);
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
    }
}

//API call to get a pokemon type
export async function fetchTypes(type) {
    let url = `https://pokeapi.co/api/v2/type/${type}`;
    let response = await fetch(url);

    if (!response.ok) {
        console.error("Failed to fetch data");
        return;
    }

    let typesData = await response.json();

    //cache the data
    saveToLocalStorage(type, typesData);

    //debugging, show the fetched pokemon
    console.log(typesData);

    //call to update the html elements with pokemon data
    updateTypesData(typesData);
}

//Update ability data to html elements
export function updateAbilityData(abilityData) {
    document.getElementById("abilityInfoParent").style.display = "block";
    document.getElementById("abilityInfoName").textContent = abilityData.name;
    //some info empty on API, check if data is empty
    if (abilityData.effect_entries < 1) {
        document.getElementById(
            "abilityInfoEffect"
        ).textContent = `This effect has no description`;
    } else {
        document.getElementById("abilityInfoEffect").textContent =
            abilityData.effect_entries[1].effect;
    }

    document.getElementById(
        "pokemonsWithAbilityTitle"
    ).textContent = `Pokemon with ${abilityData.name}:`;
    document.getElementById(
        "pokemonsWithAbility"
    ).textContent = `${abilityData.pokemon
        .map((pokemons) => pokemons.pokemon.name)
        .join(", ")}`;
}

//Updates Pokemon data to html elements
export function updatePokemonData(pokemonData) {
    document.getElementById("pokemonInfoContParent").style.display = "block";
    document.getElementById("pokemonInfoName").textContent =
        pokemonData.name.toUpperCase();

    let imgElement = document.createElement("img");
    imgElement.src =
        pokemonData.sprites.other["official-artwork"].front_default;
    imgElement.alt = "Pokemon Image";

    let imageContainer = document.getElementById("pokemonImageContainer");
    imageContainer.innerHTML = "";
    imageContainer.appendChild(imgElement);
    document.getElementById(
        "pokemonInfoAbilities"
    ).textContent = `${pokemonData.abilities
        .map((abilities) => abilities.ability.name)
        .join(", ")}`;
    document.getElementById("pokemonInfoHp_text").textContent = `HP:`;
    document.getElementById(
        "pokemonInfoHp_data"
    ).textContent = `${pokemonData.stats[0].base_stat}`;
    document.getElementById(
        "pokemonInfoAttack_text"
    ).textContent = `Attack power:`;
    document.getElementById(
        "pokemonInfoAttack_data"
    ).textContent = `${pokemonData.stats[1].base_stat}`;

    document.getElementById("pokemonInfoDefence_text").textContent = `Defence:`;

    document.getElementById(
        "pokemonInfoDefence_data"
    ).textContent = `${pokemonData.stats[2].base_stat}`;

    document.getElementById(
        "pokemonInfoSpecialAtt_text"
    ).textContent = `Special Attack:`;

    document.getElementById(
        "pokemonInfoSpecialAtt_data"
    ).textContent = `${pokemonData.stats[3].base_stat}`;

    document.getElementById(
        "pokemonInfoSpecialDef_text"
    ).textContent = `Special Defence:`;

    document.getElementById(
        "pokemonInfoSpecialDef_data"
    ).textContent = `${pokemonData.stats[4].base_stat}`;

    document.getElementById("pokemonInfoSpeed_text").textContent = `Speed:`;

    document.getElementById(
        "pokemonInfoSpeed_data"
    ).textContent = `${pokemonData.stats[5].base_stat}`;

    document.getElementById("pokemonInfoHeight_text").textContent = `Height:`;

    document.getElementById("pokemonInfoHeight_data").textContent = `${(
        pokemonData.height * 10
    ).toFixed(1)} cm`;

    document.getElementById("pokemonInfoWeight_text").textContent = `Weight:`;

    document.getElementById("pokemonInfoWeight_data").textContent = `${(
        pokemonData.weight / 10
    ).toFixed(2)} kg`;

    document.getElementById(
        "pokemonInfoTypes"
    ).textContent = `Types: ${pokemonData.types
        .map((types) => types.type.name)
        .join(", ")}`;
}

//Update the Types data to html elements
export function updateTypesData(typesData) {
    document.getElementById("typeData").style.display = "block";
    document.getElementById("typeName").textContent = typesData.name;

    setDamageTextContent(
        "doubleDamageTo_data",
        typesData.damage_relations.double_damage_to
    );
    setDamageTextContent(
        "halfDamageTo_data",
        typesData.damage_relations.half_damage_to
    );
    setDamageTextContent(
        "noDamageTo_data",
        typesData.damage_relations.no_damage_to
    );
    setDamageTextContent(
        "doubleDamageFrom_data",
        typesData.damage_relations.double_damage_from
    );
    setDamageTextContent(
        "halfDamageFrom_data",
        typesData.damage_relations.half_damage_from
    );
    setDamageTextContent(
        "noDamageFrom_data",
        typesData.damage_relations.no_damage_from
    );

    document.getElementById(
        "pokemonWithTypeTitle"
    ).textContent = `${typesData.name} type Pokemon`;
    document.getElementById(
        "pokemonsWithType"
    ).textContent = `${typesData.pokemon
        .map((element) => element.pokemon.name)
        .join(", ")}`;
}

// Display type data
export function setDamageTextContent(elementId, damageRelation) {
    const damageElement = document.getElementById(elementId);

    //check if API data is empty, and display alternative text.
    if (damageRelation.length > 0) {
        damageElement.textContent = `${damageRelation
            .map((type) => type.name)
            .join(", ")}`;
    } else {
        // If the list is empty, set text content with X icon
        damageElement.textContent = `X`;
    }
}
