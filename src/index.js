import {
    fetchPokemon,
    fetchAbility,
    fetchTypes,
    updatePokemonData,
    updateTypesData,
    updateAbilityData,
    setDamageTextContent,
} from "./api.js";
import { saveToLocalStorage, getFromLocalStorage } from "./helpers.js";
import { showView, handlePopState } from "./views.js";

// Set the base path based on the server
const basePath = "/Search-Pokemon";

// Initial state
const defaultView = "home";
showView(window.location.hash.substring(1) || defaultView);

// Handle clicks in navigation
const buttons = document.querySelectorAll("nav button");
buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        const view = button.getAttribute("data-view");
        showView(view);
        history.pushState(null, null, `${basePath}/#${view}`);
    });
});

handlePopState(defaultView);

//event listener for enter press in pokemon search bar
document
    .getElementById("pokemon-search-input")
    .addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            getInputData("pokemon");
        }
    });

//event listener for enter press in ability search bar
document
    .getElementById("ability-search-input")
    .addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            getInputData("ability");
        }
    });

//take input as pokemon or ability
function getInputData(inputSource) {
    let searchTerm = document.getElementById(
        `${inputSource}-search-input`
    ).value;

    // Check if data is in cache
    const cachedData = getFromLocalStorage(`${inputSource}-${searchTerm}`);
    if (cachedData) {
        // If found in cache, update with cached data
        if (inputSource === "pokemon") {
            updatePokemonData(cachedData);
        } else if (inputSource === "ability") {
            updateAbilityData(cachedData);
        }
    } else {
        // If not found in cache, make API call
        if (inputSource === "pokemon") {
            // Fetch Pokemon data
            fetchPokemon(searchTerm);
        } else if (inputSource === "ability") {
            // Fetch Ability data
            fetchAbility(searchTerm);
        }
    }
}

//event listener for clicking type buttons
document.querySelectorAll(".typeButton").forEach((button) => {
    button.addEventListener("click", getTypes);
});

//take button text as type
function getTypes(event) {
    let selectedType = event.target.textContent.toLowerCase();

    //check if data is in cache
    const cachedData = getFromLocalStorage(selectedType);
    if (cachedData) {
        updateTypesData(cachedData);
    } else {
        //fetch if not in cache
        console.log("cache empty, doing an API call");
        fetchTypes(selectedType);
    }
}

const searchInputPokemon = document.getElementById("pokemon-search-input");
const suggestionsListPokemon = document.getElementById("suggestions-pokemon");
const pokemonDetailsContainer = document.getElementById("pokemon-details");

const searchInputAbility = document.getElementById("ability-search-input");
const suggestionsListAbility = document.getElementById("suggestions-ability");
const abilityDetailsContainer = document.getElementById("ability-details");

// Function to display suggestions
function displaySuggestions(suggestions, suggestionsList, searchInput) {
    suggestionsList.innerHTML = "";
    suggestions.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item.name;
        suggestionsList.appendChild(listItem);

        // Add click event to handle selection
        listItem.addEventListener("click", function () {
            if (suggestionsList === suggestionsListPokemon) {
                searchInputPokemon.value = item.name;
                suggestionsListPokemon.innerHTML = "";

                // selection
            } else if (suggestionsList === suggestionsListAbility) {
                searchInputAbility.value = item.name;
                suggestionsListAbility.innerHTML = "";
            }

            suggestionsList.style.display = "none";
        });
    });
}

// Event listener for the pokemon search button
document
    .querySelector(".pokemonSearchButton")
    .addEventListener("click", function () {
        const pokemonInputValue = searchInputPokemon.value.trim();

        if (pokemonInputValue !== "") {
            getInputData("pokemon");
        } else {
            console.log("No Pokémon input value to search");
        }
    });

// Event listener for the ability search button
document
    .querySelector(".abilitySearchButton")
    .addEventListener("click", function () {
        const abilitySearchInput = document.getElementById(
            "ability-search-input"
        );

        if (abilitySearchInput.value.trim() !== "") {
            getInputData("ability", abilitySearchInput.value);
        } else {
            console.log("No Ability input value to search");
        }
    });

// Event listener for Enter key press in pokemon page
searchInputPokemon.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        // Hide suggestion list when Enter is pressed
        suggestionsListPokemon.style.display = "none";
    }
});

// Event listener for Enter key press - Ability
searchInputAbility.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        // Hide the suggestion list when Enter is pressed
        suggestionsListAbility.style.display = "none";
    }
});

// Function to filter pokemon by name
function filterPokemonByName(pokemonData, query) {
    return pokemonData
        .filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(query.toLowerCase());
        })
        .slice(0, 5); // Limit to the first 5 matches
}

// Function to filter Ability by name
function filterAbilityByName(abilityData, query) {
    return abilityData
        .filter((ability) => {
            return ability.name.toLowerCase().startsWith(query.toLowerCase());
        })
        .slice(0, 5); // Limit also to the first 5 matches
}

// Function to fetch all Pokemon data from the PokeAPI
async function fetchAllPokemonData() {
    try {
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=1500"
        );
        const data = await response.json();

        // Cache all Ppkemon data
        saveToLocalStorage("allPokemonData", data.results);

        // Display matching Pokemon names as suggestions
        displaySuggestions(
            filterPokemonByName(data.results, searchInputPokemon.value.trim()),
            suggestionsListPokemon
        );
    } catch (error) {
        console.error("Error fetching all Pokemon data:", error);
    }
}

// Function to fetch all Ability data from PokeAPI
async function fetchAllAbilityData() {
    try {
        const response = await fetch(
            "https://pokeapi.co/api/v2/ability?limit=500"
        );
        const data = await response.json();

        // Cache all Ability data
        saveToLocalStorage("allAbilityData", data.results);

        // Display names as suggestions
        displaySuggestions(
            filterAbilityByName(data.results, searchInputAbility.value.trim()),
            suggestionsListAbility
        );
    } catch (error) {
        console.error("Error fetching all Ability data:", error);
    }
}

// Event listener for input changes - Pokemon
searchInputPokemon.addEventListener("input", function () {
    const inputValue = searchInputPokemon.value.trim();

    // Clear previous suggestions
    suggestionsListPokemon.innerHTML = "";

    // If the input value is not empty, fetch suggestions
    if (inputValue !== "") {
        const allPokemonData = getFromLocalStorage("allPokemonData");

        if (allPokemonData) {
            // Use cached data if available
            displaySuggestions(
                filterPokemonByName(allPokemonData, inputValue),
                suggestionsListPokemon
            );
            // Show the suggestion list
            suggestionsListPokemon.style.display = "block";
        } else {
            fetchAllPokemonData();
        }
    } else {
        // If the input is empty, hide the suggestion list
        suggestionsListPokemon.style.display = "none";
    }
});

// Event listener for input changes - Ability
searchInputAbility.addEventListener("input", function () {
    const inputValue = searchInputAbility.value.trim();

    // Clear previous suggestions
    suggestionsListAbility.innerHTML = "";

    // If the input value is not empty, fetch suggestions
    if (inputValue !== "") {
        const allAbilityData = getFromLocalStorage("allAbilityData");

        // Check if cached data is available
        if (allAbilityData) {
            displaySuggestions(
                filterAbilityByName(allAbilityData, inputValue),
                suggestionsListAbility
            );

            // Show the suggestion list
            suggestionsListAbility.style.display = "block";
        } else {
            fetchAllAbilityData();
        }
    } else {
        // If the input is empty, hide the suggestion list
        suggestionsListAbility.style.display = "none";
    }
});

// Fetch all pokemon and ability data when the page loads
window.addEventListener("load", function () {
    fetchAllPokemonData();
    fetchAllAbilityData();
});
