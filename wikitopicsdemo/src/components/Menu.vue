<template>
  <div>
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
        src="../assets/phoenix-white.png"
        transition="scale-transition"
        width="50"
      />
      <TopicChoose />
    </div>
    <!-- <v-spacer></v-spacer> -->
    <v-dialog
      v-model="dialog"
      scrollable
      v-if="isTopicSet && $vuetify.breakpoint.mdAndUp"
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
        <v-card-text class="wikidataDialog-text">
          <iframe :src="wikidataUrl"></iframe>
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

    <v-spacer></v-spacer>
      <v-btn
        v-if="$vuetify.breakpoint.mdAndUp"
        icon
        @click.stop="openSettingsDialog"
      >
        <v-icon color="white">mdi-cog</v-icon>
      </v-btn>

    <!-- MOBILE DRAWER -->
    <v-app-bar-nav-icon @click.stop="toggleNavbar" v-if="$vuetify.breakpoint.smAndDown"></v-app-bar-nav-icon>
  </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopicChoose from '../components/TopicChoose'

export default {
  name: 'Menu',
  components: {
    TopicChoose
  },
  data: () => ({
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
  methods: {
    toggleNavbar () {
      this.$store.dispatch('toggleNavigationBar')
    },
    openSettingsDialog () {
      this.$store.dispatch('showSettingsDialog')
    }
  }
}
</script>

<style lang="less">
</style>
