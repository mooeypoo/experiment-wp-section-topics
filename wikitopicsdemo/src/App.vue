<template>
  <v-app>
    <v-app-bar v-if="isTopicSet"
      app
      color="primary"
      dark
      elevate-on-scroll
      scroll-target="#main-container"
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
      <!-- <v-spacer></v-spacer> -->
      <v-dialog
        v-model="dialog"
        scrollable
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="isTopicSet"
            class="ml-6"
            dark
            color="darkGrey"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>
              mdi-book-open-variant
            </v-icon>
            {{getCurrentTopic}}
          </v-btn>
        </template>

        <v-card>
          <v-card-title>
            Wikidata item: {{getCurrentTopic}}
          </v-card-title>
          <v-card-text>
            <iframe style="width: 100%; height: 50vh;" :src="wikidataUrl"></iframe>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main class="px-md-10 px-sm-4 px-xs-2">
      <v-container fill-height v-if="!isTopicSet" id="main-container">
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
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import TopicChoose from './components/TopicChoose'
import TopicDisplay from './components/TopicDisplay'
import Utils from './Utils'

export default {
  name: 'App',
  components: {
    TopicChoose,
    TopicDisplay
  },

  data: () => ({
    loading: true,
    dialog: false
  }),
  computed: {
    ...mapGetters([
      'isTopicSet',
      'getCurrentTopic'
    ]),
    wikidataUrl () {
      return `https://m.wikidata.org/wiki/${this.$store.getters.getCurrentTopic}`
    }
  },
  mounted () {
    this.loading = true
    try {
      this.$store.dispatch('load')
    } catch (e) {
      console.log('ERROR LOADING', e)
    } finally {
      this.loading = false
    }
  },
  watch: {
    getCurrentTopic (newVal, oldVal) {
      Utils.scrollToTop(1000)
    }
  }
}
</script>

<style lang="less">
#app {
  background-color: #37474F;
}
</style>
