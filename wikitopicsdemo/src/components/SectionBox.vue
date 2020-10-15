<template>
  <v-card class="sectionbox mt-4">
    <v-card-title>
      {{actualTitle}}
      <v-chip outlined small :class="chipClass">
        <v-icon small left color="blue-grey darken-2">mdi-scale</v-icon>
        {{fixedSalience}}
      </v-chip>
    </v-card-title>
    <v-card-subtitle v-if="!isIntro">{{page}}</v-card-subtitle>
    <v-card-text class="sectionbox-content" :class="contentClass"><slot name="content"></slot></v-card-text>
    <v-divider class="mt-2" v-if="hasTopics"></v-divider>
    <v-card-text v-if="hasTopics">
      <v-chip
        color="secondary"
        class="mx-1 my-1"
        small
        v-for="topic in topics"
        :key="topic.conceptId"
        @click="setTopic(topic.conceptId)"
      >{{topic.phrase}}</v-chip>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SectionBox',
  props: [
    'salience',
    'page',
    'title',
    'topics',
    'type'
  ],
  data () {
    return {
      isIntro: false,
      actualTitle: ''
    }
  },
  computed: {
    contentClass () {
      const c = this.type === 'main'
        ? 'main' : 'side'

      return ['sectionbox-content', `sectionbox-content-${c}`].join(' ')
    },
    chipClass () {
      const c = this.type === 'main'
        ? 'mx-5' : 'mx-1'

      return [c].join(' ')
    },
    getViewTitle () {
      return this.actualTitle
    },
    hasTopics () {
      return !!this.topics && !!this.topics.length
    },
    fixedSalience () {
      return (this.salience && this.salience.toFixed(2)) || 0
    }
  },
  methods: {
    setTopic (topicId) {
      this.$store.dispatch('setCurrentTopic', topicId)
    },
    checkIntroTitle () {
      this.isIntro = this.title === '__intro__'
      this.actualTitle = this.title === '__intro__' ? this.page : this.title
    }
  },
  mounted () {
    this.checkIntroTitle()
  }
}
</script>

<style lang="less">
.sectionbox-content {
  overflow-y: auto;
  overflow-x:hidden;

  &-main {
    max-height: 300px;
  }
  &-side {
    max-height: 250px;
  }
  &-below {
    max-height: 200px;
  }

  .infobox,
  .tright,
  figure {
    float: right;
  }

  figure {
    border: 1px solid #ccc;
    width: 200px;

    figcaption {
      font-size: 90%
    }
  }

  .thumb.tmulti {
    .thumbinner {
      width: 242px;
    }

    .trow {
      display: flex;
      flex-direction: row;
      clear: left;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;

      .tsingle {
        width: 120px;
      }
    }
  }

  section h3,
  section h2,
  section h4 {
    display: none;
  }
}
</style>
