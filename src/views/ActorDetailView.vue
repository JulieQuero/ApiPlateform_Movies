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

const selectedActorId = ref(null);
const selectedActor = ref(null);
const editedActorFirstName = ref('');
const editedActorLastName = ref('');
const editedActorNationality = ref('');

let actor = ref('')

onMounted(async () => {
  getActor();
});

const getActor = async () => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }
    const response = await axios.get(apiUrl + '/actors/' + id, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    actor.value = response.data;
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

const toggleDetails = (actor) => {
  selectedActorId.value = actor.id;
  selectedActor.value = actor;
  editedActorFirstName.value = actor.firstName;
  editedActorLastName.value = actor.lastName;
  editedActorNationality.value = actor.nationality.nationality;
};

const updateActor = async () => {
  if (selectedActor.value && editedActorFirstName.value) {
    try {
      const token = localStorage.getItem('user-token');
      if (!token) {
        // Rediriger l'utilisateur vers la page de connexion
        router.push('/login');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
      };

      const updateActor = {
        firstName: editedActorFirstName.value ? editedActorFirstName.value : selectedActor.value.firstName,
        lastName: editedActorLastName.value ? editedActorLastName.value : selectedActor.value.lastName,
      };

      await axios.patch(apiUrl + `/actors/${selectedActor.value.id}`, updateActor, {headers});

      selectedActor.value = '';
      getActor();
      selectedActorId.value = null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'acteur :', error);
    }

  }
};
</script>

<template>
  <div class="cardView">
    <a class="btn btn-secondary" href="/actors">Back to actors</a>
    <div v-if="actor">
      <h2>{{ actor.firstName }} {{ actor.lastName }}</h2>
      <p>Nationality : {{ actor.nationality.nationality }}</p>
      <p>Movies :</p>
      <ul>
        <li v-for="movie in actor.movies">{{ movie.title }}</li>
      </ul>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Update Actor</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="updateActor">
            <div class="modal-body">
              <div class="form-group">
                <label for="firstName">First Name : </label>
                <input class="input-group-text" type="text" id="firstName" v-model="editedActorFirstName">
              </div>
              <div class="form-group">
                <label for="lastName">Last Name : </label>
                <input class="input-group-text" type="text" id="lastName" v-model="editedActorLastName">
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="buttons">
    <button @click="toggleDetails(actor)" type="button" class="right btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Edit
    </button>
    <a class="btn btn-danger" @click="deleteActor(actor)">Delete</a>
  </div>
</template>

