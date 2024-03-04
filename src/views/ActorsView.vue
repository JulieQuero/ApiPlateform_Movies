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
