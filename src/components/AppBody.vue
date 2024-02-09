<template>
  <div>
    <div id="carousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div
          v-for="(page, pageIndex) in pages"
          :key="pageIndex"
          ref="carrousel"
          :class="{ 'carousel-item': true, active: pageIndex === 0 }"
        >
          <div
            v-for="(note, noteIndex) in page"
            :key="noteIndex"
            class="textContainer"
          >
            <textarea
              class="sticky-note paper-shadow"
              v-model="note.content"
              :style="{ backgroundColor: note.color }"
              @input="handleInput(pageIndex, noteIndex)"
            ></textarea>
            <button
              class="btn btn-dark rounded-circle send"
              data-toggle="tooltip"
              data-placement="bottom"
              title="save"
              v-show="note.content.length <= 145 && note.content.length > 0"
            >
              ✓
            </button>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppBody",

  data() {
    return {
      height: 0,
      width: 0,
      pages: [[]],
      newPostItText: "",
      colors: ["#ffd699", "#ffcccc", "#ccffcc", "#ccccff", "#ffffcc"],
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleInput(index) {
      if (this.postIts[index].content.length >= 145) {
        this.postIts[index].content = this.postIts[index].content.slice(0, 145);
      }
    },
    reachBottom() {
      console.log(this.$refs?.carrousel);
      if (this.$refs?.carrousel) {
        let containerHeight = this.$refs?.carrousel?.clientHeight;
        let screenHeight =
          window?.innerHeight || document?.documentElement.clientHeight;
        let threshold = 0.8;
        return console.log(containerHeight > screenHeight * threshold);
      }
      return false;
    },
  },
  mounted() {
    this.emitter.on("createPost", () => {
      const lastPage = this.pages.length - 1;
      console.log(this.reachBottom());
      if (!this.reachBottom()) {
        // Max 9 notes per page
        this.pages[lastPage].push({
          content: "This is a sticky note!",
          color: "#ffff99",
        });
      } else {
        this.pages.push([
          {
            content: "This is a sticky note!",
            color: "#ffff99",
          },
        ]);
      }
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
}

.carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E") !important;
}
.carousel-control-prev,
.carousel-control-next {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
}

.carousel-control-prev {
  left: 0;
}

.carousel-control-next {
  right: 0;
}
.send {
  position: absolute;
  bottom: 12%;
  left: 80%;
  color: white;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.3);
  background-color: black;
}
.textContainer {
  display: inline-block;

  position: relative !important;
  box-sizing: border-box !important;
}
.postContainer {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  max-width: 100%;
  overflow-x: hidden;
}
textarea {
  border: none !important;
  background-color: transparent !important;
  resize: none !important;
  outline: none !important;
  overflow: hidden;
}
.paper-shadow {
  position: relative;
  background: #fff;
  width: 300px;
  /* Adjust the width of the sticky note */
  height: 200px;
  /* Adjust the height of the sticky note */
  margin: 10px; /* Add margin between sticky notes */
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3); /* Enhance sticky note shadow */
  border-radius: 10px;
  flex: 0 0 auto; /* Prevent sticky notes from growing */
}

.paper-shadow:after,
.paper-shadow:before {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  justify-content: center; /* Center horizontally */
  margin-top: 50px; /* Add margin-top */
}

.paper-shadow:after {
  width: 90%;
  height: 10px;
  top: 30px;
  right: 8px;
  transform: rotate(-3deg);
  box-shadow: 0px -25px 35px 0px rgba(0, 0, 0, 0.5);
}

.paper-shadow:before {
  width: 10px;
  height: 95%;
  top: 5px;
  right: 18px;
  transform: rotate(10deg);
  box-shadow: 22px 0px 35px 0px rgba(0, 0, 0, 0.5);
}

.sticky-note {
  background-color: #ffc500 !important;
  padding: 20px;
  border-radius: 5px;
  cursor: move;
}
</style>
