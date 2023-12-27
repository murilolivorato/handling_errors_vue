<template>
  <div class="container">
    <form method="POST"  @submit.prevent="storeForm">
      <fieldset>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">Name</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                 <input class="form-control ipone" name="name"  type="text"  v-model="form.name" >
                  <p class="error-msg" v-if="errors.has('form.name')" v-text="errors.get('form.name')"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">E-mail</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="form-control ipone" name="email"  type="text"  v-model="form.email" >
                <p class="error-msg" v-if="errors.has('form.email')" v-text="errors.get('form.email')"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">Password</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="form-control ipone" name="password"  type="password"  v-model="form.password" >
                <p class="error-msg" v-if="errors.has('form.password')" v-text="errors.get('form.password')"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">Password Confirmation</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="form-control ipone" name="password"  type="password"  v-model="form.password_confirmation" >
                <p class="error-msg" v-if="errors.has('form.password_confirmation')" v-text="errors.get('form.password_confirmation')"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-small">
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <submit-btn :processloading="processingForm"
                            faiconposition="left"
                            stylebutton="btn_cl_left btn-green-md1"
                            textbutton="Register" ></submit-btn>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import useErrors from '@/core/Errors'
import SubmitBtn from '@/components/SubmitBtn.vue'
import Swal from 'sweetalert2'
const processingForm = ref(false)

import { useRegisterUserStore } from '@/stores/registerUser'
const storeRegisterUser = useRegisterUserStore()

const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })
const errors = useErrors()
const storeForm = () => {
  // PROCESSING
  processingForm.value = true

  storeRegisterUser.store(form).then(() => {
    // PROCESSING
    processingForm.value = false
    // SUCCESS MESSAGE
    new Swal({
      icon: 'success',
      title: 'The User Was Registered',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {})
  }).catch(error => {
    console.log('errorrr --->')
    console.log(error.errors)
    // PROCESSING
    processingForm.value = false

    errors.record(error.errors, 'form')
    console.log('foi errorrrr')
    console.log(errors.errors.value)
  })
}
</script>
<style scoped>
div.container {
  padding-top: 400px;
  width: 100%;
}
</style>
