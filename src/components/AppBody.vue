<template>
  <div>
    <div
      class="modal fade"
      ref="exampleModal"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              We don't like bots, are you a bot?
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="modal.hide()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <vue-recaptcha
              ref="recaptcha"
              @verify="onRecaptchaVerified"
              :sitekey="recaptchaSiteKey"
            ></vue-recaptcha>
          </div>
        </div>
      </div>
    </div>
    <div
      id="carousel"
      class="carousel slide sticky-notes-container"
      data-bs-interval="false"
    >
      <div ref="carouselInner" class="carousel-inner container">
        <div
          v-for="(page, pageIndex) in pages"
          :position="page"
          :key="pageIndex"
          :class="{ 'carousel-item': true, active: pageIndex === currentPage }"
          class=""
        >
          <div class="textContainer">
            <div
              v-for="(comment, commentIndex) in page"
              :key="commentIndex"
              class="sticky-note paper-shadow"
            >
              <textarea
                v-model="comment.content"
                :style="{ backgroundColor: comment.color }"
                :readonly="comment.readonly"
                :maxlength="maxlength"
              ></textarea>
              <button
                class="btn-sm btn-dark rounded-circle send"
                data-toggle="tooltip"
                data-placement="bottom"
                title="save"
                v-show="
                  comment.content.length <= maxlength &&
                  comment.content.length > 0 &&
                  !comment.readonly
                "
              >
                ✓
              </button>
            </div>
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
import { VueRecaptcha } from "vue-recaptcha";
import { Modal } from "bootstrap";

export default {
  name: "AppBody",
  components: {
    VueRecaptcha,
  },
  data() {
    return {
      counter: 0,
      modal: null,
      successfullCaptcha: false,
      position: 0,
      commentsPerPage: 40,
      maxlength: 110,
      editable: true,
      currentPage: 0,
      pages: [[]],
      newPostItText: "",
      colors: ["#ffd699", "#ffcccc", "#ccffcc", "#ccccff", "#ffffcc"],
      recaptchaSiteKey: process.env.VUE_APP_CAPTCHA_SITE,
    };
  },

  methods: {
    handleCarouselSlide() {
      const activeItem = document.querySelector(
        ".carousel-inner .carousel-item.active"
      );
      const carouselItems = Array.from(
        document.querySelectorAll(".carousel-inner .carousel-item")
      );
      const currentIndex = carouselItems.indexOf(activeItem);
      console.log(this.pages.length);

      this.emitter.emit("controlValues", {
        current: currentIndex + 1,
        total: this.pages.length,
      });
    },
    loadComments() {
      const totalComments = 1000;

      const totalPages = Math.ceil(totalComments / this.commentsPerPage);

      const comments = [];

      for (let i = 0; i < totalComments; i++) {
        comments.push({
          id: i + 1,
          content: `Comment ${i + 1}`,
          color: this.colors[i % this.colors.length],
          readonly: true,
        });
      }

      this.pages = [];

      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * this.commentsPerPage;
        const endIndex = startIndex + this.commentsPerPage;
        this.pages.push(comments.slice(startIndex, endIndex));
      }
      this.currentPage = 0;
    },
    onRecaptchaVerified(response) {
      if (response) {
        this.successfullCaptcha = true;
        this.modal.hide();
      } else {
        this.successfullCaptcha = false;
      }
    },
    jumpToLastCarousel() {
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
    carouselListener() {
      const carousel = document.getElementById("carousel");
      carousel.addEventListener("slid.bs.carousel", this.handleCarouselSlide);
    },
    handleCaptchaVerification(value) {
      if (value || !this.successfullCaptcha) {
        this.$refs.recaptcha.reset();
        this.modal.show();
      }
    },
  },
  beforeUnmount() {
    const carousel = document.getElementById("carousel");
    carousel.removeEventListener("slid.bs.carousel", this.handleCarouselSlide);
  },
  mounted() {
    console.log("teste", process.env.VUE_APP_CAPTCHA_SITE);
    this.modal = new Modal(this.$refs.exampleModal);
    this.carouselListener();
    this.loadComments();
    this.jumpToLastCarousel();
    this.handleCarouselSlide();
    this.emitter.on("createPost", (value) => {
      this.handleCaptchaVerification(value);
      this.jumpToLastCarousel();
      this.handleCarouselSlide();
      const lastPage = this.pages.length - 1;
      if (this.successfullCaptcha) {
        if (this.pages[lastPage].length >= this.commentsPerPage) {
          this.currentPage++;
          this.pages.push([
            {
              content: "This is a sticky note!",
              color: "#ffff99",
              readonly: false,
            },
          ]);
        } else {
          this.pages[lastPage].push({
            content: "This is a sticky note!",
            color: "#ffff99",
            readonly: false,
          });
        }
      }

      this.$nextTick(() => {
        this.jumpToLastCarousel();
        this.handleCarouselSlide();
      });
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
  bottom: 5%;
  left: 80%;
  color: white;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.3);
  background-color: black;
}
.textContainer {
  display: flex;
  flex-wrap: wrap;
}

textarea {
  border: none !important;
  background-color: transparent !important;
  resize: none !important;
  outline: none !important;
  overflow: hidden;
  width: 100%; /* Adjust width to fill the available space, considering padding */
  height: 100%; /* Adjust height to fill the available space, considering padding */
  margin: 0;
}
.paper-shadow {
  position: relative;
  background: #fff;
  width: 300px;
  height: 200px;
  margin: 10px; /* Add margin between sticky notes */
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3); /* Enhance sticky note shadow */
  flex: 0 0 auto; /* Prevent sticky notes from growing */
}

.paper-shadow:before {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  justify-content: center; /* Center horizontally */
  margin-top: 50px; /* Add margin-top */
  width: 10px;
  height: 95%;
  top: 5px;
  right: 18px;
  transform: rotate(10deg);
  box-shadow: 22px 0px 35px 0px rgba(0, 0, 0, 0.5);
}

.paper-shadow:after {
  width: 90%;
  height: 10px;
  top: 30px;
  transform: rotate(-3deg);
  box-shadow: 0px -25px 35px 0px rgba(0, 0, 0, 0.5);
}

.sticky-note {
  background-color: #ffc500 !important;
  padding: 20px;

  flex: 0 0 calc(20% - 20px); /* Adjust width here */
  margin: 10px; /* Add margin between sticky notes */
  height: 200px; /* Adjust height as needed */
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .sticky-note {
    flex: 0 0 calc(50% - 20px); /* Adjust width for smaller screens */
  }
}
</style>
