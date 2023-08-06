<template>
  <div id="side-bar" class="side-panel p-3 mb-2 bg-dark text-white text-left">
    <h3>Circles</h3>
    <h6>Comparing Multi-class Classification Models</h6>
    <p style="text-align: justify">
      This is a prototype of a web app that allows ML analysts to visually
      compare the various machine learning metrics of interests in classifier
      models simultaneously. <br />
      <a href="https://github.com/nina-mir/classifier_data_viz">
        <img src="src/assets/github-mark-white.png" height="30" />

        <!-- <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            fill="#fff"
          />
        </svg> -->
      </a>
    </p>
    <hr />
    Choose an ML metric:
    <hr />
    <div id="model-graphs">
      <label for="one">
        <input
          type="radio"
          id="one"
          value="arcs"
          v-model="plot_type"
          v-on:click="update_store_val"
        />
        Arcs View
      </label>
      <br />
      <label for="two">
        <input
          type="radio"
          id="two"
          value="lines"
          v-model="plot_type"
          v-on:click="update_store_val"
          disabled
        />Lines View
      </label>
      <!-- <p>{{ plot_type }} is selected!</p> -->
      <hr />
      <label for="accuracy">
        <input
          type="radio"
          id="accuracy"
          value="accuracy"
          v-model="metric_type"
          v-on:click="update_store"
        />
        Accuracy
      </label>
      <br />
      <label for="precision">
        <input
          type="radio"
          id="precision"
          value="precision"
          v-model="metric_type"
          v-on:click="update_store"
        />Precision </label
      ><br />
      <label for="recall">
        <input
          type="radio"
          id="recall"
          value="recall"
          v-model="metric_type"
          v-on:click="update_store"
        />Recall </label
      ><br />
      <label for="f1-score">
        <input
          type="radio"
          id="f1-score"
          value="f1-score"
          v-model="metric_type"
          v-on:click="update_store"
        />F1-score </label
      ><br />
      <label for="specificity">
        <input
          type="radio"
          id="specificity"
          value="specificity"
          v-model="metric_type"
          v-on:click="update_store"
        />Specificity <br /><small>(True Negative Rate)</small> </label
      ><br />
      <label for="fpr">
        <input
          type="radio"
          id="fpr"
          value="fpr"
          v-model="metric_type"
          v-on:click="update_store"
        />False Positive Rate <br /><small>(Type I Error)</small> </label
      ><br />
      <label for="fnr">
        <input
          type="radio"
          id="fnr"
          value="fnr"
          v-model="metric_type"
          v-on:click="update_store"
        />False Negative Rate <br /><small>(Type II Error)</small> </label
      ><br />
    </div>
    <hr />
    <label for="slider"
      >Plot Spacing
      <input
        id="slider"
        class="bg-info"
        name="plot-spacing"
        type="range"
        min="1"
        max="10"
        v-model="plot_spacing"
        oninput="this.nextElementSibling.value = this.value"
        disabled
      />
    </label>
  </div>
</template>
  
  <script>
import io from "socket.io-client";

export default {
  name: "side-bar",
  data() {
    return {
      plot_type: this.$store.getters.plot_type,
      plot_spacing: 1,
      socket: {},
      metric_type: this.$store.getters.op_type,
    };
  },
  methods: {
    update_store: function (event) {
      console.log(event.target.value);
      this.$store.commit("change_op_type", event.target.value);
    },
    update_store_val: function (event) {
      // arcs or lines
      console.log(event.target.value);
      this.$store.commit("change_plot_type", event.target.value);
    },
  },
  created() {
    this.socket = io("http://localhost:3005");
  },
  mounted: function () {
    // this.socket.on("position", data => {
    //   this.high_arc_index = data;
    //   this.renderGraphs();
    // })
  },
};
</script>
  
  <style scoped>
.side-panel {
  border: black solid 1px;
  /* width: 20%; */
  /* margin-left: 1px; */
}

input[type="range"] {
  width: 80%;
  margin: 13.8px 0;
  background-color: transparent;
  -webkit-appearance: none;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 1.3px;
  width: 80%;
  height: 8.4px;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-thumb {
  margin-top: -14px;
  width: 16px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 3px;
  cursor: pointer;
  -webkit-appearance: none;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #367ebd;
}
input[type="range"]::-moz-range-track {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 1.3px;
  width: 80%;
  height: 8.4px;
  cursor: pointer;
}
input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 3px;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 14.8px 0;
  color: transparent;
  width: 80%;
  height: 8.4px;
  cursor: pointer;
}
input[type="range"]::-ms-fill-lower {
  background: #2a6495;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
}
input[type="range"]::-ms-fill-upper {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
}
input[type="range"]::-ms-thumb {
  width: 16px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
input[type="range"]:focus::-ms-fill-lower {
  background: #3071a9;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #367ebd;
}
/*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
  how to remove the virtical space around the range input in IE*/
@supports (-ms-ime-align: auto) {
  /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
  input[type="range"] {
    margin: 0;
    /*Edge starts the margin from the thumb, not the track as other browsers do*/
  }
}
</style>