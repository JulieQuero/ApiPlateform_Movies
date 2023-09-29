<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Movies from "@/components/Movies.vue";

let response = ref('')
let movies = ref('')
onMounted(async () => {
  const response = await axios.get('http://localhost:8080/symfonyS5/public/index.php/api/movies');
  movies.value = response.data['hydra:member'];
});

</script>

<template>
  <h1>MoviesPage</h1>
  <div class="wrapper">
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
