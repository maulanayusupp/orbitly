<script setup lang="ts">
import { contentByPath } from '~/config/content.config'

const page = contentByPath('/use-cases')!
</script>

<template>
  <ContentArticle :page="page" />
</template>
