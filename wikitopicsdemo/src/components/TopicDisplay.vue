<template>
  <div class="topic-display mt-4">
    <v-row class="justify-center">
      <h1>{{getCurrentTopicTitle}}</h1>
    </v-row>

    <v-container fluid>
      <v-row>
        <v-col class="col-9">
          <SectionBox
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
        </v-col>
        <v-col class="col-3">
          <SectionBox
            v-for="sect in getMinorSectionsForDisplay"
            :key="sect.salience"
            :salience="sect.salience"
            :page="sect.page"
            :title="sect.title"
            :topics="sect.topics"
            style="overflow: hidden"
          >
            <div slot="content" v-html="sect.content"></div>
          </SectionBox>
        </v-col>
      </v-row>
      <v-row>
        <!-- <v-col class="text-center col-3">BAR</v-col> -->
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
      'getMinorSectionsForDisplay'
    ])
  }
}
</script>

<style lang="less">
.topic-display h1 {
  color: white;
}
</style>
