import { debounce } from "./utils";


class AutocompleteConfig {
  constructor({fetchData, renderOption, onOptionSelect}) {
    this.fetchData = fetchData;
    this.renderOption = renderOption;
    this.onOptionSelect = onOptionSelect;
  }

  async onInput({target}) {
    if(target.value.trim().length !== 0) {
      const cities = await this.fetchData(target.value);
      if(!cities.data) {
        this.dropdown.classList.remove("is-active");
        return;
      } 

      this.results.innerHTML = "";
      this.dropdown.classList.add("is-active");
      for(let city of cities.data) {
        const item = document.createElement("a");
        item.classList.add("autocomplete_item");
        item.innerHTML = this.renderOption(city); 
        item.addEventListener("click", () => {
          this.input.value = city.LocalizedName;
          this.dropdown.classList.remove("is-active");
          this.onOptionSelect(city.Key); 
        });
        this.results.append(item);
      }
    }
  }
}

export default class Autocomplete extends AutocompleteConfig {
  constructor({root, fetchData, renderOption, onOptionSelect}) {
    super({fetchData, renderOption, onOptionSelect});
    this.root = root;

    this.root.innerHTML = `
      <div class="autocomplete_container">
        <input type="text" class="autocomplete_input">
        <label class="autocomplete_label">
          <span class="autocomplete_placeholder">Search for a city</span>
        </label>
      </div>
      <div class="autocomplete_dropdown">
        <div class="autocomplete_results"></div>
      </div>`;

    this.dropdown = this.root.querySelector(".autocomplete_dropdown");
    this.results = this.root.querySelector(".autocomplete_results");
    this.input = this.root.querySelector(".autocomplete_input");
    this.input.addEventListener("input", debounce(this.onInput.bind(this), 500));

    // listener to prevent unnecessary backforward animation when input is not empty
    this.input.addEventListener("blur", ({target}) => {
      const value = target.value.trim();
      value ? 
      this.input.classList.add("autocomplete_input-fixed") : 
      this.input.classList.remove("autocomplete_input-fixed")
    });

    document.addEventListener("click", ({target}) => {
      if(!this.root.contains(target))
        this.dropdown.classList.remove("is-active");
    });
  }
}

