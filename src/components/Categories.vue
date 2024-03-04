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
.category {
  width: 300px;
  height: 500px;
  margin: 1rem;
}
.category a {
  width: 100%;
  height: 100%;
  padding: 1rem;
}
</style>
