<template>
  <v-app>
    <Menu v-if="isTopicSet" />
    <v-navigation-drawer
      v-model="navBar"
      app
      temporary
      dark
    >
      <v-dialog
        v-model="wikidataDialog"
        scrollable
        :fullscreen="$vuetify.breakpoint.smAndDown"
      >
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
              @click="wikidataDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-list three-line>
        <!-- <v-subheader>Microsite</v-subheader> -->
        <v-list-item @click.stop="wikidataDialog = true">
          <v-list-item-avatar>
            <v-icon
              class="blue darken-3"
              dark
            >
              mdi-book-open-variant
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{getCurrentTopic}}</v-list-item-title>
            <v-list-item-subtitle>Open the Wikidata entry for this topic</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click.stop="openSettingsDialog">
          <v-list-item-avatar>
            <v-icon
              class="blue darken-3"
              dark
            >
              mdi-cog
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
            <v-list-item-subtitle>Change the threshhold settings for topics</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <!-- <v-divider></v-divider>

        <v-list-item @click.stop="openAbout">
          <v-list-item-avatar>
            <v-icon
              class="blue darken-3"
              dark
            >
              mdi-cog
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
            <v-list-item-subtitle>About this project</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
    <v-main class="px-md-10 px-sm-4 px-xs-2">

      <SettingsDialog />

      <v-progress-circular
      v-if="loading"
      indeterminate
      color="white"
      ></v-progress-circular>
      <v-alert
        v-if="!!getNotice"
        border="bottom"
        colored-border
        type="warning"
        elevation="2"
      >
        {{getNotice}}
      </v-alert>
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
          <v-col class="text-center" cols=10>
            <TopicChoose class="mb-4" />
          </v-col>
          <v-col class="text-center" cols=2>
            <v-btn
              icon
              @click.stop="openSettingsDialog"
            >
              <v-icon color="white">mdi-cog</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container fill-height v-if="isTopicSet" id="main-container">
        <TopicDisplay v-if="isTopicSet" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import TopicChoose from './components/TopicChoose'
import TopicDisplay from './components/TopicDisplay'
import SettingsDialog from './components/SettingsDialog'
import Menu from './components/Menu'
import Utils from './Utils'

export default {
  name: 'App',
  components: {
    TopicChoose,
    TopicDisplay,
    SettingsDialog,
    Menu
  },

  data: () => ({
    loading: true,
    navBar: false,
    wikidataDialog: false
  }),
  computed: {
    ...mapGetters([
      'isTopicSet',
      'getCurrentTopic',
      'getNotice',
      'isNavigationBarShowing',
      'getCurrentTopic'
    ]),
    wikidataUrl () {
      return `https://m.wikidata.org/wiki/${this.getCurrentTopic}`
    }
  },
  methods: {
    openSettingsDialog () {
      this.$store.dispatch('showSettingsDialog')
    }
  },
  mounted () {
    this.loading = true
    this.navBar = this.isNavigationBarShowing
    this.$store.dispatch('initialLoad')
    this.$store.dispatch('resetTopics')
    this.loading = false
  },
  watch: {
    getCurrentTopic (newVal, oldVal) {
      Utils.scrollToTop(1000)
    },
    navBar (visible) {
      if (visible) {
        this.$store.dispatch('showNavigationBar')
      } else {
        this.$store.dispatch('hideNavigationBar')
      }
    },
    isNavigationBarShowing (visible) {
      this.navBar = visible
    }
  }
}
</script>

<style lang="less">
#app {
  background-color: #37474F;

  .wikidataDialog-text {
    overflow-y: hidden;
    iframe {
      width: 100%;
      height: calc(100vh - 10em);
    }
}
}
</style>
