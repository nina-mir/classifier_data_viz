<template>
  <div id="charts-area" class="main-panel">
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      {{ $store.getters.num_data_files }} models' results detected in "data_files" directory
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <input  name="Number of Arcs" type="range" min="4" max="22" v-model="high_arc_index" 
            v-on:change="test" oninput="this.nextElementSibling.value = this.value"
    />
    <output @change="changed">22</output>
    <div id="container" class="svg-container">
      <svg id="demo1"  >
        <g id="main" transform="translate(600, 600)"></g>
      </svg>  
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import * as d3 from "d3";
import json from '../assets/json_1000.json';

export default {
    name: 'charts-area',
    data(){
      return{
        socket: {},
        metric:"accuracy",
        myData: json,
        received_data: {},
        low_arc_index: 2,
        high_arc_index: 22
      }
    },
    created(){
      this.socket = io("http://localhost:3000");
      this.socket.emit("set-up-data", this.metric);
    },
    methods: {
      // Random number generator from MDN Mozilla tutorial on JS
      // URL : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random  
      getRandomIntInclusive: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); 
        //The maximum is inclusive and the minimum is inclusive 
      },
      svg_setup: function(){
        return d3.select("div#container").select("#demo1")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 1200 1200")
              .classed("svg-content", true);
      },
      renderGraphs: function() {
          // To Do add metric accuracy log here
          // if 

          var loaded = this.myData;
          var svg = this.svg_setup();

          var my_data = svg.select('#main').datum(loaded);
          
          for (let i = this.low_arc_index ; i < this.high_arc_index; i++) {
            // Create and append the multiple outer arcs
            my_data.append('g')
                .append('path')
                .style('fill', 'none')
                .attr('d', 
                d3.lineRadial()
                    .angle((d) => d.angle) 
                    .radius((d) => d.radius + (i-5)*20)
                    .curve(d3.curveCatmullRom)
                )
                .attr("fill", "none")
                .attr("stroke", "black");
                // .attr("opacity", this.getRandomIntInclusive(0, 100)/100); 
                // .attr("transform", "translate(600, 600)");        
          }         
      },
      test: function () {
        console.log("nina is great!");
        var svg = d3.select("div#container").select("#demo1").select('#main');
        svg.selectAll("*").remove();
        this.$store.commit('change', event.target.value);
        this.renderGraphs();
      },
      changed: function(event) {
          this.$store.commit('change', event.target.value)
      }, 
      get_accuracy: function() {

      }
    },  
    mounted: function() {
        this.socket.on("position", data => {
          this.high_arc_index = data;
          this.renderGraphs();
        })
        this.socket.on("ask for more", function(){
          console.log("maybe");
        })
        this.socket.emit(String(this.metric));
        this.socket.on("accuracy_data_from_server", function(data){
          console.log(data);
        })


    }
}
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