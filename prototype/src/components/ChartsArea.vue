<template>
  <div id="charts-area" class="main-panel">
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      {{ $store.getters.num_data_files }} models' results detected in
      "data_files" directory
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div id="model-graphs">
      <p>{{ picked }} is selected!</p>
      <p>{{ picked }} is the current store value !</p>
    </div>
    <input
      name="Number of Arcs"
      type="range"
      min="4"
      max="22"
      v-model="high_arc_index"
      v-on:change="test"
      oninput="this.nextElementSibling.value = this.value"
    />
    <output @change="changed">22</output>
    <div id="container" class="svg-container">
      <svg id="demo1">
        <!-- <g id="main" transform="translate(600, 600)"></g> -->
        <g id="main"></g>
      </svg>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import * as d3 from "d3";
import json from "../assets/json_1000.json";

export default {
  name: "charts-area",
  data() {
    return {
      socket: {},
      metric: "accuracy",
      myData: json,
      received_data: [],
      low_arc_index: 2,
      high_arc_index: 22,
      picked: this.$store.getters.op_type,
      p_data: {},
      r_data: {},
    };
  },
  created() {
    this.socket = io("http://localhost:3000");
    this.socket.emit("set-up-data", this.metric);
  },
  methods: {
    // Random number generator from MDN Mozilla tutorial on JS
    // URL : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    getRandomIntInclusive: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
      //The maximum is inclusive and the minimum is inclusive
    },
    angles_setup: function (num_classes) {
      var result = [];
      var delta = 6.28 / num_classes;
      var angle = 0.0;
      for (let step = 0; step < num_classes; step++) {
        result[step] = angle;
        angle = delta + angle;
      }
      return result;
    },
    svg_setup: function () {
      return d3
        .select("div#container")
        .select("#demo1")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1200 1200")
        .classed("svg-content", true);
    },
    renderGraphs: function () {
      // To Do add metric accuracy log here
      // if

      console.log("inside render shit!");
      var angles = Array(1000).fill(0);
      var delta = 6.28 / 1000;
      var angle = 0;
      for (let step = 0; step < 1000; step++) {
        angles[step] = angles.push(delta);
        angle = delta + angle;
      }
      // const zip = (a, b) => a.map((k, i) => [k, b[i]]);
      // console.log(zip(this.angles, this.received_data));
      // const zip = (a, b) => a.map((k, i) => [k, b[i]]);

      // console.log(zip([1,2,3], ["a","b","c"]));

      var loaded = this.myData;
      var svg = this.svg_setup();

      var my_data = svg.select("#main").datum(loaded);

      for (let i = this.low_arc_index; i < this.high_arc_index; i++) {
        // Create and append the multiple outer arcs
        my_data
          .append("g")
          .append("path")
          .style("fill", "none")
          .attr(
            "d",
            d3
              .lineRadial()
              .angle((d) => d.angle)
              .radius((d) => d.radius + (i - 5) * 20)
              .curve(d3.curveCatmullRom)
          )
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("transform", "translate(600, 600)");
      }
    },
    render_op_line: function (word) {
      console.log("line view " + String(word));
      this.socket = io("http://localhost:3000");
      this.socket.emit(word);
      var emit_name = `${word}_data_from_server`;
      this.socket.on(emit_name, function (data) {
        this.received_data = data;

        var model_names = Object.keys(this.received_data);
        var data_to_render = {};
        model_names.forEach((model_name) => {
          var temp_array = this.received_data[model_name];
          var temp_arr_2 = Object.values(temp_array);
          var map_1 = temp_arr_2.map((x) => x * 20.0);
          data_to_render[model_name] = map_1;
        });

        var svg = d3.select("div#container").select("#demo1").select("#main");
        svg.selectAll("*").remove();

        for (let i = 0; i < model_names.length; i++) {
          // Create and append the multiple outer arcs
          svg
            .append("g")
            .append("path")
            .style("fill", "none")
            .datum(data_to_render[model_names[i]])
            .attr(
              "d",
              d3
                .line()
                .x((d, ii) => ii * 1.15)
                .y((d) => d + i * 50)
                .curve(d3.curveBasis)
            )
            .attr("class", model_names[i])
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("transform", "translate(25, 600)");
        }
      });
    },
    test: function () {
      // this function re-draws the curves depending on any changes on the slider on the top of the charts webpage
      console.log("ChartsArea Line 201!");
      var svg = d3.select("div#container").select("#demo1").select("#main");
      svg.selectAll("*").remove();
      this.$store.commit("change", event.target.value);
      this.renderGraphs();
    },
    changed: function (event) {
      this.$store.commit("change", event.target.value);
    },
    get_accuracy: function () {},

    render_op: function (word) {
      console.log("inside " + String(word));
      this.socket = io("http://localhost:3000");
      this.socket.emit(word);
      var emit_name = `${word}_data_from_server`;
      this.socket.on(emit_name, function (data) {
        this.received_data = data;
        var angles = [];
        var delta = 6.28 / 1000.0;
        var angle = 0.0;
        for (let step = 0; step < 1000; step++) {
          angles[step] = angle;
          angle = delta + angle;
        }

        var model_names = Object.keys(this.received_data);
        var data_to_render = {};
        model_names.forEach((model_name) => {
          var temp_array = this.received_data[model_name];
          var temp_arr_2 = Object.values(temp_array);
          // var zip_array = zip(angles, temp_arr_2);
          // var map_1 = temp_arr_2.map(x => Math.floor(x*10.0)) ;
          var map_1 = temp_arr_2.map((x) => x * 10.0);
          data_to_render[model_name] = map_1;
        });
        // console.log(data_to_render);
        this.r_data = data_to_render;

        var svg = d3.select("div#container").select("#demo1").select("#main");
        svg.selectAll("*").remove();

        for (let i = 0; i < model_names.length; i++) {
          // APRIL-8 nina comented this line console.log(data_to_render[model_names[i]]);
          // Create and append the multiple outer arcs
          svg
            .append("path")
            .style("fill", "none")
            .datum(data_to_render[model_names[i]])
            .attr(
              "d",
              d3
                .lineRadial()
                .angle((d, ii) => angles[ii])
                .radius((d) => d + i * 20 + 200)
                .curve(d3.curveCatmullRom)
            )
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("transform", "translate(600, 600)");
        }
      });
    },
  },
  mounted: function () {
    this.socket.on("position", (data) => {
      this.high_arc_index = data;
      this.renderGraphs();
    });

    this.socket.on("ask for more", function () {
      console.log("maybe");
    });
    this.socket.emit(String(this.metric));
    //APRIL-8-22 nina commented this.socket.on("accuracy_data_from_server", function(data){
    //   console.log(data);
    // });
  },
  computed: {
    chosenOpType() {
      return this.$store.getters.op_type;
    },
    chosenPlotType() {
      return this.$store.getters.plot_type;
    },
    chosenOpTypePlotType() {
      return [this.$store.getters.op_type, this.$store.getters.plot_type];
    },
  },
  watch: {
    // chosenOpType(value) {
    //   console.log(`My store value for 'chosenOpType' changed to ${value}`);
    //   this.picked = value;
    //   this.render_op_line(value);
    //   return this.picked;
    // },
    // chosenPlotType(value) {
    //   console.log(`My store value for 'chosenPlotType' changed to ${value}`);
    //   // this.picked = value;
    //   // this.render_op_line(value);
    //   // return this.picked;
    // },
    chosenOpTypePlotType(value) {
      console.log(`VAL1 'chosenOpType' changed to ${value[0]}`);
      console.log(`VAL2 'chosenPlotType' changed to ${value[1]}`);
      if (value[1] === "lines") {
        this.render_op_line(value[0]);
      } else {
        this.render_op(value[0]);
      }
    },
  },
};
</script>

<style scoped>
.main-panel {
  color: red;
  border: black solid 1px;
  /* width: 77%; */
  margin-left: 1px;
  /* float: right; */
}
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  vertical-align: top;
  overflow: hidden;
}
.svg-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>