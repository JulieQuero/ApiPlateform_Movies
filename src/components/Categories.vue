<script setup>
defineProps({
  id: {
    type: Number,
  },
  category: {
    type: String,
    default: 'Category'
  },
  movies: {
    type: Array,
    default: 'Movies'
  },

})
</script>

<template>
  <div class="category card">
    <button>Edit</button>
    <routerLink :to="'/category-detail/'+id">
    <h2>{{ category }}</h2>
    <ul>
      <li v-for="movie in movies" :key="movie.id">
        {{ movie.title }}
      </li>
    </ul>
    </routerLink>
  </div>
</template>

<style scoped>
.card {
  width: 15%;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
