<template>
  <q-item
    clickable
    tag="router-link"
    :to="props.url"
    exact
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },

  icon: {
    type: String,
    default: ''
  },

  url: {
    type: String,
    required: true
  }
})
</script>
