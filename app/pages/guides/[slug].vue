<script setup lang="ts">
import { contentByPath } from '~/config/content.config'

const route = useRoute()
const page = contentByPath(`/guides/${route.params.slug}`)
if (!page || page.kind !== 'guide') {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found', fatal: true })
}
</script>

<template>
  <ContentArticle :key="page!.path" :page="page!" />
</template>
