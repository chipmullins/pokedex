# Pokédex

Search any Pokémon by name or Pokédex number and see its artwork, types, abilities, and base stats.

**[Live demo](https://chipmullins.github.io/pokedex/)**

![Pokédex screenshot](screenshot.png)

## Features

- Search by name (`pikachu`) or Pokédex number (`25`)
- Handles messy input: extra spaces and capital letters are cleaned up automatically
- Official artwork, Pokédex number, type badges, category, and description
- Height, weight, and base experience
- Abilities and all six base stats, with visual stat bars
- Loading message while data is fetched
- Friendly error message for invalid searches, with no leftover data from the previous Pokémon
- Responsive layout for desktop, tablet, and mobile

## Built with

- HTML
- CSS (Flexbox, media queries)
- Vanilla JavaScript (no frameworks or libraries)
- [PokéAPI](https://pokeapi.co/)

## How it works

1. The search form's submit handler cleans the input (trims spaces, converts to lowercase) and stops early if it's empty.
2. Two requests are made with `fetch` and `async`/`await`: one to the `pokemon` endpoint for core data, and one to the `pokemon-species` endpoint for the category and description.
3. Each response is checked with `response.ok`, and failed requests throw an error that's caught in one place and shown to the user.
4. `renderPokemon()` clears the previous result and builds the card from the data. Helper functions build the repeating sections (types, abilities, physical stats, and base stats) and return them to be appended.

## Technical highlights

- **Explicit HTTP error handling:** checks `response.ok` and throws on failed requests, since `fetch` doesn't reject on a 404
- **Centralized error handling:** fetch functions only fetch and throw, and a single `try`/`catch` in the submit handler decides whether to render the card or show an error
- **Multi-language data filtering:** uses `find` to pull the English category and description out of PokéAPI's multi-language arrays
- **Efficient rendering:** builds the full card in memory and attaches it to the page in one step, after clearing the previous result
- **Separation of concerns:** small helper functions each build one section of the card and return it, keeping `renderPokemon()` short and readable

## Credits

Pokémon data and artwork from [PokéAPI](https://pokeapi.co/).
