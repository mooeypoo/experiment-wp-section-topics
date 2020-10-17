<template>
  <v-dialog
    v-model="settingsDialog"
    max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        class="ml-6"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon color="white">mdi-cog</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Micro site settings</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="10">
              <v-slider
                v-model="dialogSettingsValues.salienceThreshhold"
                label="Salience threshhold"
                hint="Sets the minimum salience (relevance score) that sections can have in order to appear in the microsite."
                step="0.05"
                max="1"
                min="0.05"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              {{dialogSettingsValues.salienceThreshhold}}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-slider
                v-model="dialogSettingsValues.minSectionCount"
                label="Minimum sections"
                hint="Only show topics that have this value as a minimum of topics"
                step="1"
                max="100"
                min="1"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              {{dialogSettingsValues.minSectionCount}}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-slider
                v-model="dialogSettingsValues.maxSectionCount"
                label="Sections cap"
                hint="Maximum amount of sections taht will render on the page. NOTE: More sections means a slower rendering time per topic microsite."
                step="1"
                max="100"
                min="1"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              {{dialogSettingsValues.maxSectionCount}}
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          text
          @click="hideDialog"
        >
          Close
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="applySettings"
        >
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SettingsDialog',
  data () {
    return {
      settingsDialog: false,
      dialogSettingsValues: {}
    }
  },
  computed: {
    ...mapGetters([
      'getSettings',
      'isSettingDialogShowing'
    ])
  },
  methods: {
    applySettings () {
      this.$store.dispatch('updateSettingValue', this.dialogSettingsValues)
      this.$store.dispatch('resetTopics')
    },
    hideDialog () {
      this.$store.dispatch('hideSettingsDialog')
    }
  },
  mounted () {
    this.settingsDialog = this.isSettingDialogShowing
  },
  watch: {
    settingsDialog (visible) {
      if (visible) {
        this.$store.dispatch('showSettingsDialog')
        this.dialogSettingsValues = Object.assign({}, this.$store.getters.getSettings)
      } else {
        this.$store.dispatch('hideSettingsDialog')
      }
    },
    isSettingDialogShowing (visible) {
      this.settingsDialog = visible
    }
  }
}
</script>
