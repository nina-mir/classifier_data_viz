<template>
  <div id="side-bar" class="side-panel">
      side Panel stuff!
    <p>You chose <b style="color:black"> {{ $store.getters.selectedArcs }} </b> </p>
  </div>
</template>

<script>
export default {
    name: 'side-bar',
}
</script>

<style scoped>
    .side-panel {
        color: red;
        border: black solid 1px;
        /* width: 20%; */
        /* margin-left: 1px; */
    }

</style>