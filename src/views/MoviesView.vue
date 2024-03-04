<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import Movies from "@/components/Movies.vue";
import {useRouter} from 'vue-router';

const apiUrl = import.meta.env.VITE_API_URL;
const router = useRouter();

let response = ref('')
let movies = ref('')
let ListComplete = ref('')
const selectedMovieId = ref(null);
const selectedMovie = ref(null);
const editedMovieTitle = ref('');

onMounted(() => {
  getMovies();
});

const getMovies = async () => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }
    const response = await axios.get(apiUrl + '/movies', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    movies.value = response.data;
    ListComplete.value = response.data;
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

var recherche = ref('')

function filter() {
  movies.value = ListComplete.value
  movies.value = movies.value.filter(movie => movie.title.includes(recherche.value))
}
</script>

<template>
  <h1>MoviesPage</h1>
  <div class="wrapper">
    <div class="search d-flex">
      <input class="form-control me-2" v-model.trim="recherche" placeholder="Search movie" @keyup="filter">
    </div>
    <div class="movies">
      <div class="list">
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
  </div>
  <!--  <div :class="['col-md-3', { 'd-none': !selectedMovieId }]">
      <h2 v-if="selectedMovie">{{ selectedMovie.title }}</h2>
      <form @submit.prevent="updateMovieTitle">
        <div class="form-group">
          <label for="editMovieTitle">Titre du film :</label>
          <input
              type="text"
              class="form-control"
              id="editMovieTitle"
              v-if="selectedMovie"
              v-model="editedMovieTitle"
          />
        </div>
        <button type="submit" class="btn btn-primary">Modifier</button>
      </form>
    </div>-->
</template>

<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}
</style>
