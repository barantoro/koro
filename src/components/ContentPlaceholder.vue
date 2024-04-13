<template>
    <content-placeholders :rounded="true">
        <content-placeholders-heading :img="image" v-if="image" />
        <content-placeholders-heading v-for="line in headingLine" :key="line.$index" v-if="heading" />
        <content-placeholders-text :lines="textLine" />
    </content-placeholders>
</template>


<script setup> 
defineProps({
  image: {
      type: Boolean,
      default: false
  },
  heading: {
      type: Boolean,
      default: false
  },
  headingLine: {
    type: Number,
    default: 1,
  },
  textLine: {
    type: Number,
    default: 1,
  },
});
</script>


<style scoped>

</style>