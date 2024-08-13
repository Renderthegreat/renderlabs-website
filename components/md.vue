<template>
  <div v-html="htmlContent"></div>
</template>

<script>
import { parseMarkdown } from '~/utils/markdown.js';

export default {
  props: {
    markdown: {
      type: String,
      required: true
    }
  },
  computed: {
    htmlContent() {
      return parseMarkdown(this.markdown);
    }
  }
}
</script>