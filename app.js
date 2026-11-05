const searchForm = document.getElementById("searchForm")
const searchInput = document.getElementById("searchBox")
const pokeResult = document.getElementById("pokeResult")
const errorBox = document.querySelector('#messageCard')
const errMessageText = document.querySelector('#errMessage')
errorBox.removeAttribute('id')

async function pokeSearch(e) {
    e.preventDefault()
    errorBox.removeAttribute('id')
    errMessageText.textContent = "";
    const searchedValue = searchInput.value.trim().toLowerCase()
    if (searchedValue.length == 0) {
        return
    }

    try {
        errorBox.setAttribute('id', 'messageCard')
        errMessageText.textContent = "Loading..."
        const returnedData = await requestPokemon(searchedValue)
        const speciesInfo = await speciesDetails(returnedData.id)

        errorBox.removeAttribute('id')
        errMessageText.textContent = "";
        renderPokemon(returnedData, speciesInfo)
        
    } catch (err) {
        pokeResult.textContent = "";
        errorBox.setAttribute('id', 'messageCard')
        errMessageText.textContent = "Couldn't find the Pokemon. Check the entered value and try again!"
        
    }
}



searchForm.addEventListener("submit", pokeSearch) 
    
async function requestPokemon(searchedPokemon) {
    const url = 'https://pokeapi.co/api/v2/pokemon/' + searchedPokemon
    
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const pokemonData = await response.json()
    return pokemonData
    
}

async function speciesDetails(queriedPokemon) {
    const url = 'https://pokeapi.co/api/v2/pokemon-species/' + queriedPokemon
    
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const speciesData = await response.json()
    return speciesData
    
}



function renderPokemon(poke, speciesInformation) {
    
    
    const mainCard = document.createElement("div")
    const pokeRow = document.createElement("div")
    const pokeImage = document.createElement("img")
    const pokeColumn = document.createElement("div")
    const pokeID = document.createElement("p")
    const pokeName = document.createElement("h2")
    const pokeGenus = document.createElement("p")
    const miniBio = document.createElement("p")
    
    const abilitiesLabel = document.createElement("p")
    const bStats = document.createElement("p")
    pokeResult.textContent = "";
    mainCard.className = "pokeCard"
    pokeRow.className = "pokeRow"
    pokeImage.src = poke.sprites.other["official-artwork"].front_default
    pokeImage.alt = makeCapital(poke.name)
    pokeImage.className = "pokeImage"
    pokeColumn.className = "pokeColumn"
    pokeID.textContent = '#' + String(poke.id).padStart(4, '0');
    pokeID.className = "lightText"
    pokeName.textContent = makeCapital (poke.name)
    pokeGenus.textContent = speciesInformation.genera.find((p) => p.language.name === "en").genus
    pokeGenus.className = "lightText"
    const typeRender = getType(poke.types)
    miniBio.textContent = speciesInformation.flavor_text_entries.find((p) => p.language.name === "en").flavor_text
    
    const getPhysStats = getPhysicalStats(poke)
    const abilitiesResult = getAbilities(poke.abilities)
    abilitiesLabel.className = "lightText"
    abilitiesLabel.textContent = "Abilities"
    bStats.className = "lightText simpleColumnContainer"
    bStats.textContent = "Base Stats"
    const statResult = statsCalculator(poke.stats)
    pokeRow.appendChild(pokeImage)
    pokeRow.appendChild(pokeColumn)
    pokeColumn.appendChild(pokeID)
    pokeColumn.appendChild(pokeName)
    pokeColumn.appendChild(pokeGenus)
    pokeColumn.appendChild(typeRender)
    pokeColumn.appendChild(miniBio)
    mainCard.appendChild(pokeRow)
    mainCard.appendChild(getPhysStats)
    mainCard.appendChild(abilitiesLabel)
    mainCard.appendChild(abilitiesResult)
    mainCard.appendChild(bStats)
    mainCard.appendChild(statResult)
    pokeResult.appendChild(mainCard)


}








const makeCapital = (toCapitalize) => {
    return toCapitalize.slice(0,1).toUpperCase() + toCapitalize.slice(1)
    
}

function getAbilities(abilities) {
    const abilitiesRow = document.createElement("div")
    abilitiesRow.className = "bubbleRow"


    abilities.forEach((queryAbility) => {
        const abilityElement = document.createElement("p")
        abilityElement.className = "pokeAbilityBubble"
        abilityElement.textContent = capitalizeTwoWords(removeHyphen(queryAbility.ability.name))
        abilitiesRow.appendChild(abilityElement)
    })
    return abilitiesRow
}

function getType(type) {
    const typeRow = document.createElement("div")
    typeRow.className = "bubbleRow"

    type.forEach((typeSearch) => {
        const typeElement = document.createElement("p")
        typeElement.className = "pokeTypeBubble"
        typeElement.textContent = capitalizeTwoWords(typeSearch.type.name)
        typeRow.appendChild(typeElement)
    })

    return typeRow
}

function getPhysicalStats(pmon) {
    const statsRow = document.createElement("div")
    statsRow.className = "statsRowContainer"

    const height = pmon.height / 10
    const weight = pmon.weight / 10

    statsRow.appendChild(buildStatColumn("Height", height + " m"))
    statsRow.appendChild(buildStatColumn("Weight", weight + " kg"))
    statsRow.appendChild(buildStatColumn("Base Exp", pmon.base_experience))

    return statsRow
}

function buildStatColumn(label, value) {
    const column = document.createElement("div")
    column.className = "statsColumnContainer"

    const labelElement = document.createElement("p")
    labelElement.className = "lightText"
    labelElement.textContent = label

    const valueElement = document.createElement("p")
    valueElement.className = "statValue"
    valueElement.textContent = value

    column.appendChild(labelElement)
    column.appendChild(valueElement)
    return column
}

function statsCalculator (stat) {
    const statsSection = document.createElement("div")
    

    stat.forEach((stats) => {
        const statsRow = document.createElement("div")
        statsRow.className = "statsRow"
        const statsColumn = document.createElement("div")
        statsColumn.className = "statsColumnLeft"
        const statName = document.createElement("p")
        statName.textContent = capitalizeTwoWords(removeHyphen(stats.stat.name))
        const statColumn = document.createElement("div")
        statColumn.className = "statsColumnRight"
        const statValue = document.createElement("p")
        statValue.className = "numberAlign"
        statValue.textContent = stats.base_stat
        const baseBar = document.createElement("div")
        baseBar.className = "baseBar"
        const fillBar = document.createElement("div")
        fillBar.className = "fillBar"

        const statPercent = stats.base_stat / 255 * 100
        fillBar.style.width = `${statPercent}%`

        statsColumn.appendChild(statName)
        baseBar.appendChild(fillBar)
        statColumn.appendChild(statValue)
        statColumn.appendChild(baseBar)
        statsRow.appendChild(statsColumn)
        statsRow.appendChild(statColumn)
        statsSection.appendChild(statsRow)
    })
    return statsSection
}

const removeHyphen = (words) => {
    return words.replace('-', ' ')
    
}

const capitalizeTwoWords = (word) => {
    return word.split(" ").map(words => words.charAt(0).toUpperCase() + words.slice(1)).join(" ")
}


