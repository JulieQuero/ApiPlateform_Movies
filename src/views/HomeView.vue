<script setup>
//import data from 'http://localhost:8080/symfonyS5/public/index.php/api/movies';
import { onMounted, ref } from 'vue'
import axios from 'axios'


let response = ref('')
let movies = ref('')
onMounted(async () => {
  const response = await axios.get('http://localhost:8080/symfonyS5/public/index.php/api/movies');
  movies.value = response.data['hydra:member'];
  console.log(movies.value);
});

</script>

<template>
<h1>HomePage</h1>
  <div class="wrapper">
    <div class="movies">
      <div class="movie" v-for="movie in movies" :key="movie.id">
        <h2>{{ movie.title }}</h2>
        <p>{{ movie.description }}</p>
      </div>
    </div>
  </div>
</template>
