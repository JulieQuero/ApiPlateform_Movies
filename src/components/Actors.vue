<script setup>
defineProps({
  firstName: {
    type: String,
    default: 'firstName'
  },
  lastName: {
    type: String,
    default: 'lastName'
  },
  nationality: {
    type: String,
    default: 'nationality'
  },

})
</script>

<template>
    <div class="actor card">
      <h2>{{ firstName }} {{ lastName }}</h2>
      <p>{{nationality}}</p>
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
