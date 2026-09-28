<script setup lang="ts">
import { contentByPath } from '~/config/content.config'

const page = contentByPath('/features')!
</script>

<template>
  <ContentArticle :page="page" />
</template>
