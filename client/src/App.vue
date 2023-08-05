<script setup>
// import ChartsArea from "./components/ChartsArea_test.vue";
import ChartsArea from "./components/ChartsArea.vue";
import SideBar from "./components/SideBar.vue";
// import FileUpload from "./components/FileUpload.vue";
</script>

<template>
  <div class="container" id="app">
    <div class="row">
      <div class="col-lg-3">
        <!-- <FileUpload /> -->
        <SideBar />
      </div>
      <div class="col-lg-9">
        <ChartsArea />
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  } */
</style>
