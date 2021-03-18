<template>
    <div class="side-panel">
        
        <label class="file-select">
            <div class="select-button">
            <span v-if="value">Selected File: {{value.name}}</span>
            <span v-else>Select File</span>
            </div>
            <input type="file" @change="handleFileChange"/>
        </label>
    </div>
</template>

<script>
export default {
  props: {
    value: File
  },

  methods: {
    handleFileChange(e) {
      this.$emit('input', e.target.files[0])
    }
  }
}
</script>

<style scoped>
.side-panel {
        color: red;
        border: black solid 1px;
        /* width: 20%; */
        /* margin-  left: 1px; */
        margin-bottom: 1px;
}

.file-select > .select-button {
  padding: 1rem;

  color: white;
  background-color: #2EA169;

  border-radius: .3rem;

  text-align: center;
  font-weight: bold;
}

.file-select > input[type="file"] {
  display: none;
}
</style>