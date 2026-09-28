<script setup lang="ts">
import { contentByPath } from '~/config/content.config'

const page = contentByPath('/ai-product-description-generator')!
</script>

<template>
  <ContentArticle :page="page" />
</template>
