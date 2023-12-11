<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Movies from "@/components/Movies.vue";

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

let url = 'http://localhost:8080/symfonyS5/public/index.php';

let response = ref('')
let movies = ref('')
let ListComplete = ref('')
onMounted(async () => {
  const response = await axios.get(
      'http://localhost:8080/symfonyS5/public/index.php/api/movies?online=true&page=1',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
  )
  console.log(response)

  movies.value = response.data['hydra:member'];
  ListComplete.value = response.data;
});

var recherche = ref('')
function filter(){
  movies.value = ListComplete.value
  movies.value = movies.value.filter(movie => movie.title.includes(recherche.value))
}
</script>

<template>
  <h1>MoviesPage</h1>
  <div class="wrapper">
    <div class="search>">
      <input v-model.trim="recherche" placeholder="Search movie" @keyup="filter">
    </div>
    <div class="movies">
      <div class="list">
        <Movies v-for="movie in movies"
                :key="movie.id"
                :title="movie.title"
                :description="movie.description"
                :releaseDate="movie.releaseDate"
                :duration="movie.duration"
                :category="movie.category.name"
                :actors="movie.actor"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}
</style>
