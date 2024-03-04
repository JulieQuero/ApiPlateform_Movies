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
  <div>
    <a href="/categories">Back to categories</a>
    <div v-if="category">
      <a @click="toggleDetails(category)">Edit</a>
      <h2>{{category.name}}</h2>
      <p>Movies :</p>
      <ul>
        <li v-for="movie in category.movies">{{movie.title}}</li>
      </ul>
    </div>
  </div>
  <div :class="['col-md-3']">
    <form @submit.prevent="updateCategory">
      <div class="form-group">
        <label for="name">Name : </label>
        <input type="text" id="name" v-model="editedCategoryName">
      </div>
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
  <div>
    <a @click="deleteCategory(category)">Delete</a>
  </div>
</template>
