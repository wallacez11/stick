<template>
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark navigation">
    <div class="container">
      <a class="navbar-brand" href="">Post It</a>
      <div class="navbar-text text-center">
        {{ currentPosition }} / {{ totalPages }}
      </div>
      <button
        type="button"
        @click="createPostIt()"
        data-toggle="tooltip"
        data-placement="bottom"
        title="create"
        class="btn btn-dark rounded-circle button"
        @input="handleInput(index)"
      >
        +
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppNavigation",
  props: {
    msg: String,
  },
  data() {
    return {
      createPostItClickCount: 0,
      currentPosition: 0,
      totalPages: 0,
      isFirstTime: true,
    };
  },
  methods: {
    handleInput(index) {
      if (this.postIts[index].content.length >= 160) {
        this.postIts[index].content = this.postIts[index].content.slice(0, 160);
      }
    },
    createPostIt() {
      this.createPostItClickCount++;
      if (this.isFirstTime || this.createPostItClickCount % 10 === 0) {
        this.emitter.emit("createPost", true);
      } else {
        this.emitter.emit("createPost", false);
      }
      this.isFirstTime = false;
    },
  },

  mounted() {
    this.emitter.on("controlValues", (evt) => {
      this.currentPosition = evt.current;
      this.totalPages = evt.total;
    });
  },
};
</script>
<style scoped>
a {
  color: black !important;
}

.navigation {
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.5);
  background-color: white;
  margin-bottom: 30px;
}
.button {
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.3);
  color: white;
  background-color: black;
  font-weight: bold !important;
  font-weight: 900;
}
.navbar-text {
  color: black;
  font-weight: bold;
  font-size: 18px;
}
</style>
