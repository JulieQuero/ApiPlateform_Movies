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
const selectedCategoryId = ref(null);
const selectedCategory = ref(null);
const editedCategoryName = ref('');

let category = ref('')

const getCategory = async () => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }
    const response = await axios.get(apiUrl +'/categories/'+ id, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    category.value = response.data;
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
  getCategory();
});

const toggleDetails = (category) => {
  selectedCategoryId.value = category.id;
  selectedCategory.value = category;
  editedCategoryName.value = category.name;
};

const updateCategory = async () => {
  if (selectedCategory.value && editedCategoryName.value) {
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

     const updateCategory = {
        name: editedCategoryName.value,
      };

      console.log(updateCategory);

      await axios.patch(apiUrl + `/categories/${selectedCategory.value.id}`, updateCategory, {headers});

      selectedCategory.value = '';
      getCategory();
      selectedCategoryId.value = null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'acteur :', error);
    }

  }
};

const deleteCategory = async (category) => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }

    await axios.delete(apiUrl + `/categories/${category.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    router.push('/categories');
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie :', error);
  }
};

</script>

<template>
  <div class="cardView">
    <a class="btn btn-secondary" href="/categories">Back to categories</a>
    <div v-if="category">
      <h2>{{category.name}}</h2>
      <p>Movies :</p>
      <ul>
        <li v-for="movie in category.movies">{{movie.title}}</li>
      </ul>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Update Category</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateCategory">
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name : </label>
              <input class="input-group-text" type="text" id="name" v-model="editedCategoryName">
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
    <button @click="toggleDetails(category)" type="button" class="right btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Edit
    </button>
    <a class="btn btn-danger" @click="deleteCategory(category)">Delete</a>
  </div>
</template>
