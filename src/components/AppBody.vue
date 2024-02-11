<template>
  <div>
    <div id="carousel" class="carousel slide" data-bs-interval="false">
      <div ref="carouselInner" class="carousel-inner">
        <div
          v-for="(page, pageIndex) in pages"
          :key="pageIndex"
          :class="{ 'carousel-item': true, active: pageIndex === currentPage }"
        >
          <div
            v-for="(comment, commentIndex) in page"
            :key="commentIndex"
            class="textContainer"
          >
            <textarea
              class="sticky-note paper-shadow"
              v-model="comment.content"
              :style="{ backgroundColor: comment.color }"
              @input="handleInput(pageIndex, commentIndex)"
            ></textarea>
            <button
              class="btn btn-dark rounded-circle send"
              data-toggle="tooltip"
              data-placement="bottom"
              title="save"
              v-show="
                comment.content.length <= 145 && comment.content.length > 0
              "
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
      currentPage: 0,
      pages: [[]],
      newPostItText: "",
      colors: ["#ffd699", "#ffcccc", "#ccffcc", "#ccccff", "#ffffcc"],
      isSizeBelowThreshold: true,
    };
  },

  methods: {
    loadComments() {
      const totalComments = 1000;
      const commentsPerPage = 40;

      const totalPages = Math.ceil(totalComments / commentsPerPage);

      const comments = [];

      for (let i = 0; i < totalComments; i++) {
        comments.push({
          id: i + 1,
          content: `Comment ${i + 1}`,
          color: this.colors[i % this.colors.length],
        });
      }

      this.pages = [];

      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * commentsPerPage;
        const endIndex = startIndex + commentsPerPage;
        this.pages.push(comments.slice(startIndex, endIndex));
      }
      this.currentPage = this.pages.length - 1;
    },
    jumpToLastCarousel() {
      console.log("Jumping to last carousel");

      const carouselItems = document.querySelectorAll(
        ".carousel-inner .carousel-item"
      );

      if (carouselItems.length > 0) {
        carouselItems.forEach((item) => {
          item.classList.remove("active");
        });
        carouselItems[carouselItems.length - 1].classList.add("active");
      }

      const lastCarouselItem = carouselItems[carouselItems.length - 1];
      if (lastCarouselItem) {
        lastCarouselItem.scrollIntoView({ behavior: "smooth" });
      }
    },
    handleInput(index) {
      if (this.postIts[index].content.length >= 145) {
        this.postIts[index].content = this.postIts[index].content.slice(0, 145);
      }
    },
  },

  mounted() {
    this.loadComments();
    this.emitter.on("createPost", () => {
      this.jumpToLastCarousel();

      const lastPage = this.pages.length - 1;

      if (this.pages[lastPage].length >= 40) {
        this.currentPage++;
        this.pages.push([
          { content: "This is a sticky note!", color: "#ffff99" },
        ]);
      } else {
        this.pages[lastPage].push({
          content: "This is a sticky note!",
          color: "#ffff99",
        });
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
