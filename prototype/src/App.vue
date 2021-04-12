<template>
  <div class="container" id="app">
    <div class="row">
      <div class="col-lg-3">
            <!-- <file-select v-model="file"></file-select>
            <p v-if="file">{{file.name}}</p> -->
            <file-upload />

            <side-bar/>
      </div>
      <div class="col-lg-9">
            <charts-area/>
      </div>
    </div>
  </div>
</template>

<script>
// import FileSelect from '@/components/FileSelect.vue'
import FileUpload from '@/components/FileUpload.vue'
import SideBar from '@/components/SideBar.vue'
import ChartsArea from '@/components/ChartsArea.vue'


export default {
  name: 'App',
  components: {
    SideBar,
    // FileSelect,
    ChartsArea,
    FileUpload
  },
  data() {
    return {
      file: null
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
