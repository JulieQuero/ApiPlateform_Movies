<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Actors from "@/components/Actors.vue";
import {useRouter} from "vue-router";

const apiUrl = import.meta.env.VITE_API_URL;
const router = useRouter();

let response = ref('')
let actors = ref('')
let ListComplete = ref('')
let data = ref('')
let nationalities = ref('')
let actor = ref('')
let movies = ref('')
let movie = ref('')
let toto = ref('')

onMounted(async () => {
  getActors();
});

const getActors = async () => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }
    const response = await axios.get(apiUrl +'/actors', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    actors.value = response.data;
    ListComplete.value = response.data;

    const responseNationalities = await axios.get(apiUrl +'/nationalities', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    nationalities.value = responseNationalities.data;

    const responseMovies = await axios.get(apiUrl +'/movies', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    movies.value = responseMovies.data;

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

const addActor = async () => {
    try {
      console.log('addActor');
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

      const addActor = {
        firstName: firstName.value,
        lastName: lastName.value,
        nationality_id: nationality.value,
        movies: [movie.value]
      };

      await axios.post(apiUrl + `/actors`, addActor, {headers});

      getActors();
    } catch (error) {
      console.error('Erreur lors de la création l\'acteur :', error);
    }
};

var recherche = ref('')
function filter(){
  actors.value = ListComplete.value
  actors.value = actors.value.filter(actor => actor.lastName.includes(recherche.value))
}
</script>

<template>
  <h1>ActorsPage</h1>
  <div class="wrapper">
    <div class="search d-flex">
      <input class="form-control me-2" v-model.trim="recherche" placeholder="Search actor" @keyup="filter">
    </div>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Add Actor
    </button>
    <div class="actors">
      <div class="list">
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
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add an Actor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addActor">
              <div class="modal-body">
                <div class="form-group">
                  <label for="firstName">First Name : </label>
                  <input class="input-group-text" type="text" id="firstName" required>
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name : </label>
                  <input class="input-group-text" type="text" id="lastName" required>
                </div>
                <div class="form-group">
                  <label for="toto">Nationality : </label>
                  <select v-model="nationality" required>
                    <option v-for="nationality in nationalities" id="nationality" :key="nationality.id" :value="nationality.id">{{ nationality.nationality }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="movies">Movies : </label>
                  <select v-model="movie" required>
                    <option v-for="movie in movies" id="movie" :key="movie.id" :value="movie.id">{{ movie.title }}</option>
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
