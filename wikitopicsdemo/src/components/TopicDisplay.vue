<template>
  <div class="topic-display mt-4">
    <v-row class="justify-center">
      <h1>{{getCurrentTopicTitle}}</h1>
    </v-row>

    <v-container fluid>
      <v-row>
        <v-col md9 s12>
        <!-- <v-col class="col-9"> -->
          <v-row>
            <SectionBox
              class="ml-2"
              v-for="sect in getMainSectionsForDisplay"
              :key="sect.salience"
              :salience="sect.salience"
              :page="sect.page"
              :title="sect.title"
              :topics="sect.topics"
              type="main"
            >
              <div slot="content" v-html="sect.content"></div>
            </SectionBox>
          </v-row>
          <v-row v-for="(row, index) in extraSectionsByRow" :key="index">
            <v-col v-for="sect in row" :key="sect.salience" class="col-6">
              <SectionBox
                :salience="sect.salience"
                :page="sect.page"
                :title="sect.title"
                :topics="sect.topics"
                style="overflow: hidden"
                type="below"
              >
                <div slot="content" v-html="sect.content"></div>
              </SectionBox>
            </v-col>
          </v-row>
        </v-col>

        <!-- <v-col class="col-3"> -->
        <v-col md3 s12>
          <SectionBox
            v-for="sect in getMinorSectionsForDisplay"
            :key="sect.salience"
            :salience="sect.salience"
            :page="sect.page"
            :title="sect.title"
            :topics="sect.topics"
            style="overflow: hidden"
            type="side"
          >
            <div slot="content" v-html="sect.content"></div>
          </SectionBox>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SectionBox from './SectionBox.vue'
export default {
  name: 'TopicDisplay',
  components: {
    SectionBox
  },
  computed: {
    ...mapGetters([
      'getCurrentTopicTitle',
      'getMainSectionsForDisplay',
      'getMinorSectionsForDisplay',
      'getExtraSectionsForDisplay'
    ]),
    extraSectionsByRow () {
      const sections = this.$store.getters.getExtraSectionsForDisplay.map(x => x)
      const limitInRow = 2
      const byrows = []
      let counter = 0
      let rowNum = 0
      sections.forEach(s => {
        if (counter % limitInRow === 0) {
          rowNum++
        }
        byrows[rowNum] = byrows[rowNum] || []
        byrows[rowNum].push(s)
        counter++
      })
      return byrows
    }
  }
}
</script>

<style lang="less">
.topic-display h1 {
  color: white;
}
</style>
