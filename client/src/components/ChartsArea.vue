<template>
  <div id="charts-area" class="main-panel">
    <div class="MultiRangeSliderContainer">
      <div
        style="
          display: flex;
          justify-content: space-between;
          text-align: center;
          font-family: Roboto, sans-serif;
          color: black;
        "
      >
        <span
          style="
            display: inline-block;
            padding: 10px;
            border: solid 1px;
            border-radius: 5px;
            width: 100px;
            margin: 3px;
            font-family: Roboto, sans-serif;
            background-color: black;
            color: white;
          "
        >
          From {{ barMinValue }}</span
        >
        <span
          style="
            font-family: Roboto, sans-serif;
            font-weight: bold;
            color: black;
            margin-top: 10px;
          "
        >
          Choose A Range of Classes
        </span>
        <span
          style="
            display: inline-block;
            padding: 10px;
            border: solid 1px;
            border-radius: 5px;
            width: 100px;
            margin: 3px;
            font-family: Roboto, sans-serif;
            background-color: black;
            color: white;
          "
          >To {{ barMaxValue }}</span
        >
      </div>

      <MultiRangeSlider
        :min="1"
        :max="1000"
        :step="1"
        :ruler="false"
        :label="true"
        :minValue="barMinValue"
        :maxValue="barMaxValue"
        @input="UpdateValues"
      />
    </div>
    <hr />
    <div id="container" class="svg-container">
      <!-- <h3>selected type is: {{ this.$store.getters.op_type }}</h3> -->
      <svg id="svg-element">
        <g id="main"></g>
      </svg>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import * as d3 from "d3";
import json from "../assets/json_1000.json";
import MultiRangeSlider from "multi-range-slider-vue";

export default {
  name: "ChartsArea",
  components: {
    MultiRangeSlider,
  },
  data() {
    return {
      socket: {},
      metric: "accuracy",
      user_choice: this.$store.getters.op_type,
      myData: json,
      received_data: [],
      low_arc_index: 2,
      high_arc_index: 22,
      p_data: {},
      barMin: 1,
      barMax: 1000,
      barMinValue: 1,
      barMaxValue: 1000,
      min: 1,
      max: 1000,
      range: [1, 1000],
    };
  },
  methods: {
    // MultiRangeSlider method source: https://github.com/developergovindgupta/multi-range-slider-vue-demo
    UpdateValues(e) {
      this.barMinValue = e.minValue;
      this.barMaxValue = e.maxValue;
      this.render_arcs(this.user_choice, this.barMinValue, this.barMaxValue);
    },
    svg_setup: function () {
      return d3
        .select("div#container")
        .select("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1400 1000")
        .classed("svg-content", true);
    },
    horizontal_bar_chart: function (container_div_id, data, source_calss_id) {
      // TO DO Calculate the margin values depending on the Cx and Cy values

      // set the dimensions and margins of the graph
      var margin = { top: 30, right: 30, bottom: 40, left: 60 },
        width = 260 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

      var target_id = "#" + container_div_id;

      // append the svg object to the body of the page
      var svg = d3
        .select(target_id)
        .append("svg")
        .attr("id", "tipSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Create TITLE label

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Class id: " + source_calss_id);

      //Create X axis label
      var curr_activity = this.user_choice.toString().toLowerCase();
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + 0.9 * margin.top)
        .style("text-anchor", "middle")
        .text(
          "Values of " +
            curr_activity.charAt(0).toUpperCase() +
            curr_activity.slice(1) +
            " Metric"
        )
        .append("tspan")
        .attr("x", width / 2)
        .attr("y", height + 1.32 * margin.top)
        .style("font-style", "italic")
        .text("note: model-0 is the innermost arc.");

      // Add X axis
      var x = d3.scaleLinear().domain([0, 10]).range([0, width]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      var y_labels = [];
      data.each(function (d, i) {
        var div = d3.select(this);
        y_labels[i] = div.attr("id");
      });

      // Y axis
      var y = d3.scaleBand().range([0, height]).domain(y_labels).padding(0.1);
      svg.append("g").call(d3.axisLeft(y));

      var pure_data = data.data();
      //Bars
      svg
        .selectAll("myRect")
        .data(pure_data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", function (d, i) {
          return y(y_labels[i]);
        })
        .attr("width", function (d) {
          return x(d);
        })
        .attr("height", y.bandwidth())
        .attr("fill", "gray");
    },
    create_tooltip_element: function () {
      // remove any existing tooltip-container div
      d3.select("#tooltip-container").remove();

      //append a tooltip div tooltip-container
      return d3
        .select("#container")
        .append("div")
        .attr("id", "tooltip-container")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("background", "lightgreen")
        .style("opacity", "0.95")
        .style("width", "280px")
        .style("height", "220px")
        .style("font", "12px sans-serif")
        .html("<div id='tipDiv'> </div >");
    },
    create_circular_grid: function (grid_size) {
      var grid = [];
      // 6.28 = 2*PI
      var delta = 6.28 / grid_size;
      var angle = 0.0;
      for (let step = 0; step < grid_size; step++) {
        grid[step] = angle;
        angle = delta + angle;
      }
      return grid;
    },
    // function to include class range as input
    render_arcs: function (word, lowerClassIndex, upperClassIndex) {
      console.log("Render-Arcs   :", word);
      var ref = this;
      this.socket.emit(word);
      var emit_from_server = `${word}_data_from_server`;
      var tooltip = this.create_tooltip_element(); //append a tooltip div tooltip-container
      const angles = this.create_circular_grid(1000); //create a circular grid of size 1000
      this.socket.on(emit_from_server, function (data) {
        //Get data from the server
        // console.log("received data from SERVER!");
        this.received_data = data;
        var model_names = Object.keys(this.received_data);
        var data_to_render = {};
        model_names.forEach((model_name) => {
          var temp_arr = Object.values(this.received_data[model_name]);
          var map_model_data = temp_arr.map((x) => x * 10.0);
          data_to_render[model_name] = map_model_data;
        });
        var svg_temp = ref.svg_setup();
        var svg = ref.svg_setup().select("#main"); // set up the svg and select group element w/id main
        svg.selectAll("*").remove();

        for (let i = 0; i < model_names.length; i++) {
          // Create and append the multiple outer arcs
          //TODO data_to_render needs tyo be sliced up
          // TO BE USED lowerClassIndex, upperClassIndex -- min class index is 1 NOT 0
          var slice = [],
            colors = [],
            angles_sections = [],
            strokeWidth = ["1px", "2px", "1px"];

          var model_data = data_to_render[model_names[i]];
          slice[0] = model_data.slice(0, lowerClassIndex);
          angles_sections[0] = angles.slice(0, lowerClassIndex);
          colors[0] = "gray";
          slice[1] = model_data.slice(lowerClassIndex - 1, upperClassIndex);
          angles_sections[1] = angles.slice(
            lowerClassIndex - 1,
            upperClassIndex
          );
          colors[1] = "black";
          slice[2] = model_data.slice(upperClassIndex - 1, model_data.length);
          angles_sections[2] = angles.slice(
            upperClassIndex - 1,
            model_data.length
          );
          colors[2] = "gray";
          for (let s = 0; s < slice.length; ++s) {
            svg
              .append("path")
              .style("fill", "none")
              .datum(slice[s])
              .attr(
                "d",
                d3
                  .lineRadial()
                  .angle((d, ii) => angles_sections[s][ii])
                  .radius((d) => d + i * 20 + 200)
                  .curve(d3.curveCatmullRom)
              )
              .attr("fill", "none")
              .attr("stroke", colors[s])
              .attr("stroke-width", strokeWidth[s])
              .attr("transform", "translate(700, 500)");
            // create the tooltip behavior and dummy, invisible points
            svg
              .selectAll("dummy-points")
              .data(slice[s])
              .enter()
              .append("circle")
              .attr("id", "model-" + i)
              .attr("class", function (d, counter) {
                return "circle" + " slice-" + s + " elem-" + counter;
              })
              .style("fill", "none")
              .style("stroke", "none")
              .style("pointer-events", "all")
              .attr("cx", function (d, ii) {
                return (
                  (d + i * 20 + 200) *
                  Math.cos(angles_sections[s][ii] - Math.PI / 2)
                );
              })
              .attr("cy", function (d, ii) {
                return (
                  (d + i * 20 + 200) *
                  Math.sin(angles_sections[s][ii] - Math.PI / 2)
                );
              })
              .attr("r", 3)
              .on("mouseover", function (event) {
                var tooltip_source_elem = d3.select(this);
                tooltip_source_elem.style("fill", "red");
                var source_id = tooltip_source_elem.attr("id");
                var source_class = tooltip_source_elem.attr("class");
                let classes = source_class.split(" ");
                var elem_list = d3.selectAll(
                  "." + classes[0] + "." + classes[1] + "." + classes[2]
                );
                elem_list.each(function () {
                  var div = d3.select(this);
                  if (div.attr("id") == source_id) {
                    div.style("stroke", "black");
                  } else {
                    div.style("stroke", "blue").style("fill", "blue");
                  }
                });
                ref.horizontal_bar_chart("tipDiv", elem_list, classes[2]);
                const element = document.getElementById("svg-element");
                const rect = element.getBoundingClientRect();
                var xy = d3.pointer(event, d3.select("#container"));
                // var container_width = rect.width;
                // var container_height = rect.height;
                var left, top;
                var elem_number = parseInt(classes[2].slice(5));
                if (elem_number < 250) {
                  left = 150;
                  top = 100;
                } else if (elem_number >= 250 && elem_number < 500) {
                  left = 300;
                  top = 100;
                } else if (elem_number >= 500) {
                  left = 500;
                  top = 300;
                }
                tooltip.style("left", left + "px").style("top", top + "px");
                return tooltip.style("visibility", "visible");
              })
              .on("mouseout", function () {
                var tooltip_source_elem = d3.select(this);
                tooltip_source_elem
                  .style("fill", "none")
                  .style("stroke", "none");
                var source_class = tooltip_source_elem.attr("class");
                let classes = source_class.split(" ");
                d3.selectAll(
                  "." + classes[0] + "." + classes[1] + "." + classes[2]
                )
                  .style("fill", "none")
                  .style("stroke", "none");
                d3.select("#tipSVG").remove();
                return tooltip.style("visibility", "hidden");
              })
              .attr("transform", "translate(700, 500)");
          }
        }
      });
    },
  },
  created: function () {
    // this hook occurs first
    console.log("created baby");
    this.socket = io("http://localhost:3005");
    this.socket.emit("set-up-data", this.metric);
  },
  mounted: function () {
    // this hook occures after created
    console.log("mounted baby");
    this.render_arcs(this.metric, this.barMinValue, this.barMaxValue);
  },
  computed: {
    chosenOpTypePlotType() {
      // example: ['accurcy' , 'lines'] or ['recall', 'arcs']
      return [this.$store.getters.op_type, this.$store.getters.plot_type];
    },
  },
  watch: {
    chosenOpTypePlotType(value) {
      console.log(`VAL1 'chosen ML Metrics' is now ${value[0]}`);
      console.log(`VAL2 'chosen Plot Type' is now ${value[1]}`);

      if (value[1] === "lines") {
        this.render_op_line(value[0]);
      } else {
        this.render_arcs(value[0], this.barMinValue, this.barMaxValue);
      }
    },
  },
};
</script>

<style scoped>
.main-panel {
  color: black;
  /* border: black solid 1px; */
  /* width: 77%; */
  margin-left: 1px;
  /* float: right; */
}
.svg-container {
  /* border: black solid 1px; */
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  vertical-align: top;
  overflow: hidden;
}

.MultiRangeSliderContainer {
  margin: auto;
  width: 50%;
}
</style>


