<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router"

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const route = useRoute()
const id = route.params.id

let movie = ref('')

onMounted(async () => {
  const responseMovies = await axios.get(
      'http://localhost:8080/symfonyS5/public/index.php/api/movies/'+ id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
  )
  movie.value = responseMovies.data
})
</script>

<template>
  <div>
    <div v-if="movie">
      <h2>{{movie.title}}</h2>
      <p>Description : {{movie.description}}</p>
      <p>Release Date : {{movie.releaseDate}}</p>
      <p>Duration : {{movie.duration}} minutes</p>
      <p>Category : {{movie.category.name}}</p>
      Actors :
      <ul>
        <li v-for="actor in movie.actor">{{actor.firstName}} {{actor.lastName}}</li>
      </ul>
    </div>
  </div>
</template>

