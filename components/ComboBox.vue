<template>
  <div class="combo-box">
    <input
      type="text"
      v-model="search"
      @input="filterOptions"
      placeholder="Select options"
    />
    <ul v-if="filteredOptions.length" class="options-list">
      <li
        v-for="option in filteredOptions"
        :key="option"
        @click="toggleOption(option)"
        :class="{ selected: isSelected(option) }"
      >
        {{ option }}
      </li>
    </ul>
    <div class="selected-options">
      <span v-for="option in selectedOptions" :key="option" class="selected-option">
        {{ option }}
        <button @click="removeOption(option)">×</button>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        search: '',
        filteredOptions: [],
        selectedOptions: [],
      };
    },
    props: {
      options: {
        type: Array,
        required: true,
      },
      multiselect: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      filterOptions() {
        this.filteredOptions = this.options.filter(option =>
          option.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      toggleOption(option) {
        if (this.multiselect) {
          if (this.selectedOptions.includes(option)) {
            this.removeOption(option);
          } else {
            this.addOption(option);
          }
        } else {
          this.selectedOptions = [option];
          this.search = option;
          this.filteredOptions = [];
          this.$emit('option-selected', option);
        }
      },
      addOption(option) {
        this.selectedOptions.push(option);
        this.search = '';
        this.filteredOptions = [];
        this.$emit('option-selected', this.selectedOptions);
      },
      removeOption(option) {
        this.selectedOptions = this.selectedOptions.filter(selected => selected !== option);
        this.$emit('option-selected', this.selectedOptions);
      },
      isSelected(option) {
        return this.selectedOptions.includes(option);
      },
    },
    mounted() {
      this.filteredOptions = this.options;
    },
  };
</script>

<style scoped>
  .combo-box {
    position: relative;
    width: 300px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .options-list {
    position: absolute;
    width: 100%;
    background: white;
    border: 1px solid var(--splitter-color);
    border-radius: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .options-list li {
    padding: 8px;
    cursor: pointer;
  }
  
  .options-list li.selected {
    background: var(--current-color-secondary);
  }
  
  .options-list li:hover {
    background: var(--current-color-tertiary);
  }
  
  .selected-options {
    margin-top: 10px;
    align-items: center;
  }
  
  .selected-option {
    display: inline-block;
    padding: 4px 10px;
    margin: 2px;
    border: 1px solid var(--splitter-color);
    border-radius: 4px;
  }
  
  .selected-option button {
    margin-left: 5px;
    cursor: pointer;
  }
</style>