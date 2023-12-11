<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Actors from "@/components/Actors.vue";
import Movies from "@/components/Movies.vue";

let responseMovies = ref('')
let responseActors = ref('')
let movies = ref('')
let actors = ref('')

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

if(!token){
  location.href = '/login';
}

onMounted(async () => {
  const responseMovies = await axios.get(
      'http://localhost:8080/symfonyS5/public/index.php/api/movies?online=true&page=1',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
  )
  console.log(responseMovies)
  movies.value = responseMovies.data.reverse();
  movies.value = movies.value.slice(0,4);
  const responseActors = await axios.get(
      'http://localhost:8080/symfonyS5/public/index.php/api/actors?online=true&page=1',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
  )
  actors.value = responseActors.data.reverse();
  actors.value = actors.value.slice(0,4);
});

</script>

<template>
<h1>HomePage</h1>
  <div class="wrapper">
    <div class="movies">
      <h2>Last 4 movies</h2>
      <div class="last-four">
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
    <div class="actors">
      <h2>The last 4 actors</h2>
      <div class="last-four">
        <Actors v-for="actor in actors"
                :key="actor.id"
                :firstName="actor.firstName"
                :lastName="actor.lastName"
                :nationality="actor.nationality.nationality"
                :movies="actor.movies"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.last-four {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.card {
  width: 30%;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>