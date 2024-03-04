<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router"

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const route = useRoute()
const router = useRouter();

const id = route.params.id
const apiUrl = import.meta.env.VITE_API_URL;
const selectedMovieId = ref(null);
const selectedMovie = ref(null);
const editedMovieTitle = ref('');
const editedMovieDescription = ref('');
const editedMovieReleaseDate = ref('');
const editedMovieDuration = ref('');

let movie = ref('')

onMounted(() => {
  getMovie();
});


const getMovie = async () => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }
    const response = await axios.get(apiUrl + '/movies/' + id, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    movie.value = response.data;
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

const updateMovie = async () => {
  if (selectedMovie.value && editedMovieTitle.value) {
    try {
      const token = localStorage.getItem('user-token');
      if (!token) {
        router.push('/login');
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
      };
      const updatedMovie = {
        title: editedMovieTitle.value ? editedMovieTitle.value : selectedMovie.value.title,
        description: editedMovieDescription.value ? editedMovieDescription.value : selectedMovie.value.description,
        releaseDate: editedMovieReleaseDate.value ? editedMovieReleaseDate.value : selectedMovie.value.releaseDate,
        duration: editedMovieDuration.value ? editedMovieDuration.value : selectedMovie.value.duration,
      };

      await axios.patch(apiUrl + `/movies/${selectedMovie.value.id}`, updatedMovie, {headers});

      editedMovie.value = '';
      getMovie();
      selectedMovieId.value = null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du titre du film :', error);
    }
  }
};

const toggleDetails = (movie) => {
  selectedMovieId.value = movie.id;
  selectedMovie.value = movie;
  editedMovieTitle.value = movie.title;
  editedMovieDescription.value = movie.description;
  editedMovieReleaseDate.value = movie.releaseDate;
  editedMovieDuration.value = movie.duration;
};

const deleteMovie = async (movie) => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      router.push('/login');
      return;
    }
    await axios.delete(apiUrl + `/movies/${movie.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push('/movies');
  } catch (error) {
    console.error('Erreur lors de la suppression du film :', error);
  }
};

</script>

<template>
  <div class="cardView">
    <a class="btn btn-secondary" href="/movies">Back to movies</a>
    <div v-if="movie">
      <h2>{{ movie.title }}</h2>
      <p>Description : {{ movie.description }}</p>
      <p>Release Date : {{ movie.releaseDate }}</p>
      <p>Duration : {{ movie.duration }} minutes</p>
      <p>Category : {{ movie.category.name }}</p>
      Actors :
      <ul>
        <li v-for="actor in movie.actor">{{ actor.firstName }} {{ actor.lastName }}</li>
      </ul>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Update Actor</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateMovie">
          <div class="modal-body">
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
            <div class="form-group">
              <label for="editedMovieDescription">Description :</label>
              <input
                  type="text"
                  class="form-control"
                  id="editMovieTitle"
                  v-if="selectedMovie"
                  v-model="editedMovieDescription"
              />
            </div>
            <div class="form-group">
              <label for="editMovieReleaseDate">Date de sortie :</label>
              <input
                  type="text"
                  class="form-control"
                  id="editMovieReleaseDate"
                  v-if="selectedMovie"
                  v-model="editedMovieReleaseDate"
              />
            </div>
            <div class="form-group">
              <label for="editMovieDuration">Durée :</label>
              <input
                  type="text"
                  class="form-control"
                  id="editMovieDuration"
                  v-if="selectedMovie"
                  v-model="editedMovieDuration"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="buttons">
    <button @click="toggleDetails(movie)" type="button" class="right btn btn-primary" data-bs-toggle="modal"
            data-bs-target="#exampleModal">
      Edit
    </button>
    <a class="btn btn-danger" @click="deleteMovie(movie)">Delete</a>
  </div>
</template>
