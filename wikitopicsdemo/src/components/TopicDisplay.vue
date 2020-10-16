<template>
  <div class="topic-display mt-4">
    <v-row class="justify-center">
      <h1>{{getCurrentTopicTitle}}</h1>
    </v-row>

    <v-container fluid>
      <masonry
        :cols="{default: 2, 1000: 1}"
        :gutter="20"
        >
        <SectionBox
          v-for="sect in getMainSectionsForDisplay"
          :key="sect.sectionId"
          :salience="sect.salience"
          :page="sect.page"
          :title="sect.title"
          :topics="sect.topics"
          type="main"
        >
          <div slot="content" v-html="sect.content"></div>
        </SectionBox>
      </masonry>
      <masonry
        :cols="{default: 3, 1000: 2, 600: 1}"
        :gutter="20"
        >
          <SectionBox
            v-for="sect in getMinorSectionsForDisplay"
            :key="sect.sectionId"
            :salience="sect.salience"
            :page="sect.page"
            :title="sect.title"
            :topics="sect.topics"
            type="minor"
          >
            <div slot="content" v-html="sect.content"></div>
          </SectionBox>
          <SectionBox
            v-for="sect in getExtraSectionsForDisplay"
            :key="sect.sectionId"
            :salience="sect.salience"
            :page="sect.page"
            :title="sect.title"
            :topics="sect.topics"
            type="extra"
          >
            <div slot="content" v-html="sect.content"></div>
          </SectionBox>
      </masonry>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SectionBox from './SectionBox.vue'
export default {
  name: 'TopicDisplay',
  data () {
    return {
      containerId: 'section-list'
    }
  },
  components: {
    SectionBox
  },
  computed: {
    ...mapGetters([
      'getCurrentTopicTitle',
      'getAllSectionsForDisplay',
      'getMainSectionsForDisplay',
      'getMinorSectionsForDisplay',
      'getExtraSectionsForDisplay'
    ])
  }
}
</script>

<style lang="less">
.topic-display h1 {
  color: white;
}
</style>
