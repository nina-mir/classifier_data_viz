<template>
  <div id="side-bar" class="side-panel p-3 mb-2 bg-dark text-white text-left">
    <h3>Circles</h3>
    <h6>Comparing Multi-class Classification Models</h6>
    <p style="text-align: justify">
      This is a prototype of a web app that allows ML analysts to visually
      compare the various machine learning metrics of interests in classifier
      models simultaneously.
      <a href="https://github.com/nina-mir/Classifier-Visualization/"
        >GitHub link</a
      >
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