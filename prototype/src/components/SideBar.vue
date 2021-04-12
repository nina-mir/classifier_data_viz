<template>
  <div id="side-bar" class="side-panel p-3 mb-2 bg-dark text-white">
      side Panel stuff!
    <p>You chose <b> {{ $store.getters.selectedArcs }} </b> </p>
    <hr>
    <!-- <div class="row">
      <div class="col">
        <p-radio class="p-curve" color="info-o" name="radio" value="Arcs" v-model="radio">
          Arcs
        </p-radio> 
      </div>
      <div class="col">
        <p-radio name="radio" color="warning" v-model="radio" value="Lines" >Lines</p-radio> 
      </div>
    </div>
    <p>Message is: {{ radio }}</p> -->

    <div id="model-graphs">
      <label for="one">
        <input type="radio" id="one" value="arcs" v-model="picked"> Arcs View
      </label> <br>
      <label for="two">
            <input type="radio" id="two" value="lines" v-model="picked">Lines View
      </label>
      <p>{{ picked }} is selected!</p>
    </div>
    <hr>
    <label for="slider">Plot Spacing
      <input id="slider" class="bg-info" name="plot-spacing" type="range" min="1" max="10" v-model="plot_spacing" 
          oninput="this.nextElementSibling.value = this.value"/> 
      <!-- <output @change="changed">1</output> -->
    </label>

  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: 'side-bar',
  data(){
    return {
      picked:"",
      plot_spacing: 1,
      socket:{}
    }
  },
  created(){
    this.socket = io("http://localhost:3000");
  },
  mounted: function() {
    // this.socket.on("position", data => {
    //   this.high_arc_index = data;
    //   this.renderGraphs();
    // })
  }
}
</script>

<style scoped>
  .side-panel {
      border: black solid 1px;
      /* width: 20%; */
      /* margin-left: 1px; */
  }

input[type=range] {
  width: 80%;
  margin: 13.8px 0;
  background-color: transparent;
  -webkit-appearance: none;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 1.3px;
  width: 80%;
  height: 8.4px;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  margin-top: -14px;
  width: 16px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 3px;
  cursor: pointer;
  -webkit-appearance: none;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #367ebd;
}
input[type=range]::-moz-range-track {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 1.3px;
  width: 80%;
  height: 8.4px;
  cursor: pointer;
}
input[type=range]::-moz-range-thumb {
  width: 16px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 3px;
  cursor: pointer;
}
input[type=range]::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 14.8px 0;
  color: transparent;
  width: 80%;
  height: 8.4px;
  cursor: pointer;
}
input[type=range]::-ms-fill-lower {
  background: #2a6495;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
}
input[type=range]::-ms-fill-upper {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
}
input[type=range]::-ms-thumb {
  width: 16px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
input[type=range]:focus::-ms-fill-lower {
  background: #3071a9;
}
input[type=range]:focus::-ms-fill-upper {
  background: #367ebd;
}
/*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
how to remove the virtical space around the range input in IE*/
@supports (-ms-ime-align:auto) {
  /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
  input[type=range] {
    margin: 0;
    /*Edge starts the margin from the thumb, not the track as other browsers do*/
  }
}


</style>