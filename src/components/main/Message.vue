<template>
  <transition name="modal">
    <div
      v-show="getMessage"
      class="modal-mask text-center">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <p>{{ getMessage }}</p>
            <button
              class="btn btn-info"
              @click="closeModal">Ok</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      modalTimer: null
    }
  },
  computed: {
    ...mapGetters([
      'getMessage'
    ])
  },
  watch: {
    getMessage: function () {
      clearTimeout(this.modalTimer)
      this.modalTimer = setTimeout(() => {
        this.setUserMessage(null)
      }, 1400)
    }
  },
  methods: {
    ...mapActions([
      'setUserMessage'
    ]),
    closeModal () {
      clearTimeout(this.modalTimer)
      this.setUserMessage(null)
    }
  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  display: table;
  transition: opacity .5s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .5s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-body {
  margin: 20px 0;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
