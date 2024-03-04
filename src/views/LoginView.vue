<script setup>
import {ref} from 'vue';
import axios from 'axios';

const username = ref('');
const password = ref('');
const apiUrl = import.meta.env.VITE_API_URL;

const login = async () => {
  try {
    const response = await axios.post(apiUrl + '/login_check', {
      username: username.value,
      password: password.value
    });
    // Store the token in localStorage
    localStorage.setItem('user-token', response.data.token);
    // puis, rediriger vers la page d'accueil
    location.reload();
    location.href = '/';
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
</script>

<template>
  <section>
    <h2>Login</h2>
    <form class="login" @submit.prevent="login">
      <div class="form-group">
        <label>Username :</label>
        <input class="form-control" v-model="username" placeholder="Username" required/>
      </div>
      <div class="form-group">
        <label>Password :</label>
        <input class="form-control" v-model="password" type="password" placeholder="Password" required/>
      </div>
      <button class="btn btn-primary" type="submit">Login</button>
    </form>
  </section>
</template>

<style scoped>
 label{
   margin: 10px 0;
 }
</style>