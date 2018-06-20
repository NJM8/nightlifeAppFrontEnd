<template>
  <div class="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3  border rounded mt-4 bg-white">
    <form
      class="p-3"
      @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="username">User name</label>
        <input
          v-validate="'required|min:4'"
          id="username"
          v-model="username"
          :class="{error : errors.has('username'), success: checkSuccess('username')}"
          name="username"
          type="text"
          class="form-control"
          aria-describedby="username"
          placeholder="Enter name">
        <span
          v-if="errors.has('username')"
          class="errorText">{{ errors.first('username') }} </span>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-validate="'required|min:6'"
          id="password"
          v-model="password"
          :class="{error : errors.has('password'), success: checkSuccess('password')}"
          name="password"
          type="password"
          class="form-control"
          aria-describedby="password"
          placeholder="Password">
        <span
          v-if="errors.has('password')"
          class="errorText">{{ errors.first('password') }} </span>
      </div>
      <button
        type="submit"
        class="btn btn-primary">Submit</button>
      <span
        v-if="fixForm"
        class="errorText">Please fix form errors before submission</span>
      <span
        v-if="getInvalidCredentials"
        class="errorText">{{ getInvalidCredentials }}</span>
      <p v-if="getReturningUser">Welcome back, please log in again.</p>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      username: '',
      password: '',
      fixForm: false
    }
  },
  computed: {
    ...mapGetters([
      'getInvalidCredentials',
      'getReturningUser'
    ])
  },
  methods: {
    ...mapActions([
      'logIn'
    ]),
    onSubmit () {
      this.$validator.validateAll().then((valid) => {
        if (valid) {
          this.fixForm = false
          const formData = {
            username: this.username,
            password: this.password
          }
          this.logIn(formData)
        } else {
          this.fixForm = true
        }
      })
    },
    checkSuccess (field) {
      return !this.errors.has(`${field}`) && this[field].length > 0
    }
  }
}
</script>

<style>
.errorText {
  color: firebrick;
}

.error {
  border: 1px solid firebrick;
  box-shadow: 0 0 0 .125em rgba(255,56,96,.25);
}

.success {
  border: 1px solid #42b883;
  box-shadow: 0 0 0 .125em rgba(68, 238, 90, 0.479);
}
</style>
