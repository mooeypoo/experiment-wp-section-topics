<template>
  <v-card class="sectionbox mt-4" :class="mainClass" :elevation="elevationValue">
    <v-card-title color="blue-grey darken-2" class="sectionbox-title">
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
    mainClass () {
      const c = this.type || 'main'

      return ['sectionbox', `sectionbox-${c}`].join(' ')
    },
    elevationValue () {
      return {
        main: 6,
        minor: 2,
        extra: 0
      }[this.type] || 0
    },
    contentClass () {
      const c = this.type || 'main'

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
.sectionbox {
  width: 100%;

  &-minor {
    .vertical-navbox,
    .infobox,
    .noprint {
      display: none;
    }
  }
  &-extra {
    .vertical-navbox,
    .infobox,
    .noprint {
      display: none;
    }
  }
}
div.sectionbox-title {
  word-break: break-word;
}

.sectionbox-content {
  overflow-y: auto;
  overflow-x:hidden;

  &-main {
    height: 300px;
  }
  &-minor {
    height: 200px;

    .vertical-navbox,
    .infobox,
    .noprint {
      display: none;
    }
  }
  &-extra {
    height: 150px;

    .vertical-navbox,
    .infobox,
    .noprint {
      display: none;
    }
  }

  &:not(.sectionbox-content-below) {
    .infobox,
    .tright,
    figure {
      float: right;
      clear: both;
    }
  }

  .hatnote {
    display: none;
  }

  figure {
    border: 1px solid #ccc;
    width: 180px;

    img {
      max-width: 150px;
      height: auto;
    }

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
