const searchInput = document.getElementById("searchInput");
const suggestionSearch = document.getElementById("suggestionSearch");

const searchButton = document.getElementById("searchButton");

// let apiKey = 'bd0d48a3dff6d38c3a7e1ed5ef43f427'


let allCities = [];

// fetch countries once
async function fetchCountries() {
  try {
    let response = await fetch("https://countriesnow.space/api/v0.1/countries");
    if (!response.ok) {
      throw new Error("Error in response");
    }

    let data = await response.json();

    // data.data is countries

    allCities = data.data.flatMap((country) => country.cities);
  } catch (err) {
    console.error(`Error : ${err}`);
  }
}

fetchCountries();

// searchinput event when inputing a city manually

searchInput.addEventListener("input", function () {
  const searchInputValue = searchInput.value.toLowerCase();
  let filtered = allCities.filter((city) =>
    city.toLowerCase().includes(searchInputValue)
  );

  suggestionSearch.innerHTML = "";

  if (filtered.length > 0) {
    for (let i = 0; i < Math.min(7, filtered.length); i++) {
      let li = document.createElement("li");
      li.textContent = filtered[i];
      li.className = "suggestion-result";
      li.style.display = "block";

      // adding a event for results when clicking to added it to the input search
      li.addEventListener("click", () => {
        searchInput.value = li.textContent;
        suggestionSearch.innerHTML = ""; 
      });
      suggestionSearch.appendChild(li);
    }
    
  } else {
    let li = document.createElement("li");
    li.textContent = "No result";
    li.className = "suggestion-result";
    li.style.display = "block";
    suggestionSearch.appendChild(li);
  }
});

document.addEventListener('click',(e)=>{
    if(!e.target.classList.contains("suggestion-result")){
        suggestionSearch.innerHTML = ""
    }
})

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const items = document.querySelectorAll(".suggestion-result");
    if (items.length > 0 && items[0].textContent !== "No result") {
      searchInput.value = items[0].textContent; // 
      suggestionSearch.innerHTML = "";
    }
  }
});

