<template>
  <v-app>
    <v-app-bar v-if="isTopicSet"
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Phoenix Logo"
          class="shrink mr-2"
          contain
          src="./assets/phoenix-white.png"
          transition="scale-transition"
          width="50"
        />
        <TopicChoose />
      </div>
    </v-app-bar>

    <v-main>
      <v-container fill-height v-if="!isTopicSet">
        <v-row align="center" justify="center">
          <v-img
            alt="Phoenix Logo"
            class="shrink mr-2"
            contain
            src="./assets/phoenix-white.png"
            transition="scale-transition"
            max-height="400"
          />
        </v-row>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols=12>
            <TopicChoose class="mb-4" />
          </v-col>
        </v-row>
      </v-container>

      <TopicDisplay v-if=" isTopicSet" />
    </v-main>
    <pre>{{$store.state}}</pre>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import TopicChoose from './components/TopicChoose'
import TopicDisplay from './components/TopicDisplay'

export default {
  name: 'App',
  components: {
    TopicChoose,
    TopicDisplay
  },

  data: () => ({
    //
  }),
  computed: {
    ...mapGetters([
      'isTopicSet'
    ])
  }
}
</script>

<style lang="less">
#app {
  background-color: #37474F;
}
</style>
