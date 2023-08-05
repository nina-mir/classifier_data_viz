<template>
  <div class="file-upload">
    <div class="input-group mb-3">
      <div class="custom-file">
        <input
          type="file"
          @change="onFileChange"
          class="custom-file-input"
          id="inputGroupFile02"
        />
        <label
          id="status1"
          class="custom-file-label text-left"
          for="inputGroupFile02"
          >Choose File</label
        >
      </div>
      <div class="input-group-append">
        <button
          type="button"
          @click="onUploadFile"
          class="btn btn-primary upload-button input-group-text"
          :disabled="!this.selectedFile"
        >
          Upload
        </button>
      </div>
    </div>
    <p>{{ $store.getters.num_data_files }} files detected</p>
  </div>
</template>
  
  <script>
import io from "socket.io-client";

export default {
  data() {
    return {
      selectedFile: "",
      socket: {},
      //   num_data_files: 0
    };
  },
  created() {
    this.socket = io("http://localhost:3005");
  },
  mounted: function () {
    this.socket.on("data_files", (data, callback) => {
      console.log(data);
      this.$store.commit("change_num_df", data.length);
      callback({
        status: "ok",
      });
    });
  },
  methods: {
    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
      document.getElementById("status1").innerHTML = selectedFile.name;
      this.read(console.log);
    },
    read(callback) {
      var file = this.selectedFile;
      var reader = new FileReader();

      reader.onload = function () {
        callback(reader.result);
      };
      reader.readAsText(file, "UTF-8");
    },
    onUploadFile() {
      document.getElementById("status1").innerHTML = "Choose File";
      //   var input_read = this.read(this.selectedFile);
      console.log("54");
      //   const formData = new FormData();
      //   formData.append("file", this.selectedFile);  // appending file

      var file = this.selectedFile;
      var reader = new FileReader();
      reader.onloadend = function () {
        this.socket = io("http://localhost:3005");
        this.socket.emit("file-upload", {
          name: file.name,
          data: reader.result,
        });
      };
      reader.readAsArrayBuffer(file);
    },
  },
};
</script>
<style scoped>
.label-x {
  padding: 0%;
  border: blue;
}

.file-upload {
  box-shadow: 2px 2px 9px 2px #ccc;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 1rem;
  width: 60%;
  margin: 0 auto;
}

input {
  font-size: 0.9rem;
}

input,
div,
button {
  margin-top: 2rem;
}

.upload-button {
  width: 7rem;
  padding: 0.5rem;
  background-color: #278be9;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 1rem;
}

.upload-button:disabled {
  background-color: #b3bcc4;
  cursor: no-drop;
}
</style>
