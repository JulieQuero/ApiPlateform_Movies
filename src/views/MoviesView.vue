<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import Movies from "@/components/Movies.vue";
import {useRouter} from 'vue-router';

const apiUrl = import.meta.env.VITE_API_URL;
const router = useRouter();

let response = ref('')
let movies = ref('')
let actors = ref('')
let categories = ref('')
let nationalities = ref('')
let ListComplete = ref('')
const selectedMovieId = ref(null);
const selectedMovie = ref(null);
const editedMovieTitle = ref('');

let title = ref('')
let description = ref('')
let releaseDate = ref('')
let duration = ref('')
let category = ref('')
let actor = ref('')
let movie = ref('')
let currentPage = 1

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
    const response = await axios.get(apiUrl + '/movies?page='+ currentPage +'&pagination=true', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    movies.value = response.data;
    ListComplete.value = response.data;

    const reponseActors = await axios.get(apiUrl + '/actors', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    actors.value = reponseActors.data;

    const reponseCategories = await axios.get(apiUrl + '/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    categories.value = reponseCategories.data;
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

const addMovie = async () => {
  try {
    console.log('addMovie');
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/ld+json',
    };

    console.log(title.value);
    console.log(description.value);
    console.log(releaseDate.value);
    console.log(category.value);
    console.log(actor.value);

    const addMovies = {
      title: title.value,
      description: description.value,
      releaseDate: releaseDate.value,
      duration: duration.value,
      category_id: category.value,
      actor_id: actor.value,
    };

    await axios.post(apiUrl + `/movies`, addMovies, {headers});

    getMovies();
  } catch (error) {
    console.error('Erreur lors de la création du film :', error);
  }
};

var recherche = ref('')

function filter() {
  movies.value = ListComplete.value
  movies.value = movies.value.filter(movie => movie.title.includes(recherche.value))
}

const nextPage = () => {
  if (currentPage < 4) {
    currentPage++;
    getMovies();
  }
}
const previousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies();
  }
}
</script>

<template>
  <h1>MoviesPage</h1>
  <div class="wrapper">
    <div class="search d-flex">
      <input class="form-control me-2" v-model.trim="recherche" placeholder="Search movie" @keyup="filter">
    </div>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Add Movie
  </button>
    <div class="pagination">
      <button type="button" class="btn btn-secondary" @click="previousPage()" :disabled="currentPage === 1">Previous</button>
      <button type="button" class="btn btn-secondary" @click="nextPage()" :disabled="currentPage ===4">Next</button>
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
      <div class="pagination">
        <button type="button" class="btn btn-secondary" @click="previousPage()" :disabled="currentPage === 1">Previous</button>
        <button type="button" class="btn btn-secondary" @click="nextPage()" :disabled="currentPage ===4">Next</button>
      </div>
    </div>
  </div>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add an Actor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addMovie">
            <div class="modal-body">
              <div class="form-group">
                <label for="title">Titre du film :</label>
                <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="title"
                />
              </div>
              <div class="form-group">
                <label for="description">Description :</label>
                <input
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="description"
                />
              </div>
              <div class="form-group">
                <label for="releaseDate">Date de sortie :</label>
                <input
                    type="date"
                    class="form-control"
                    id="releaseDate"
                    v-model="releaseDate"
                />
              </div>
              <div class="form-group">
                <label for="duration">Durée :</label>
                <input
                    type="text"
                    class="form-control"
                    id="duration"
                    v-model="duration"
                />
              </div>
              <div class="form-group">
                <label for="categories">Category : </label>
                <select v-model="category" required>
                  <option v-for="category in categories" id="movie" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="actor">Actors : </label>
                <select v-model="actor" required>
                  <option v-for="actor in actors" id="movie" :key="actor.id" :value="actor.id">{{ actor.firstName }} {{ actor.lastName }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
            </div>
          </form>
        </div>
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
