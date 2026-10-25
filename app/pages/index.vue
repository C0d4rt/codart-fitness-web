<script setup lang="ts">
import { brand } from '~/brand'

useSeoMeta({ title: brand.name, description: brand.tagline })
</script>

<template>
  <main>
    <h1>{{ brand.name }}</h1>
    <p>{{ brand.tagline }}</p>
  </main>
</template>
