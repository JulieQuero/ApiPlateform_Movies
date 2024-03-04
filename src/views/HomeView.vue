<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Actors from "@/components/Actors.vue";
import Movies from "@/components/Movies.vue";
import {useRouter} from "vue-router";

const router = useRouter();

let responseMovies = ref('')
let responseActors = ref('')
let movies = ref('')
let actors = ref('')

const apiUrl = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const getMovies = async () => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }
    const responseMovies = await axios.get(apiUrl + '/movies', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    movies.value = responseMovies.data.reverse();
    movies.value = movies.value.slice(0,4);
  } catch (error) {
    console.error('Error', error);
    console.log(error.response?.data?.code);
    if (error.response?.data?.code === 401) {
      // Détruire le token
      localStorage.removeItem('token');
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
    }
  }
};

const getActors = async () => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }
    const responseActors = await axios.get(apiUrl +'/actors', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    actors.value = responseActors.data.reverse();
    actors.value = actors.value.slice(0,4);
  } catch (error) {
    console.error('Error', error);
    console.log(error.response?.data?.code);
    if (error.response?.data?.code === 401) {
      // Détruire le token
      localStorage.removeItem('token');
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
    }
  }
};

onMounted(() => {
  getMovies();
  getActors();
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
                :id="movie.id"
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
                :id="actor.id"
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
/*.movie {
  width: 300px;
  height: 500px;
  margin: 1rem;
}
.movie a {
  width: 100%;
  height: 100%;
  padding: 1rem;
}*/
</style>