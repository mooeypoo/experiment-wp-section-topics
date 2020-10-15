<template>
  <div class="topic-choose">
    <v-select dark
      v-model="topic"
      :items="getTopicSelectList"
      item-text="name"
      item-value="wikidata"
      label="Select topic"
      persistent-hint
      return-object
      single-line
    ></v-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopicChoose',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'isTopicSet',
      'getTopicSelectList'
    ]),
    topic: {
      get () {
        return this.$store.state.current.topic
      },
      set (topic) {
        this.$store.dispatch('setCurrentTopic', topic.wikidata)
      }
    }
  }
}
</script>
