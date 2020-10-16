import Vue from 'vue'
import Vuex from 'vuex'
import TopicMerger from './TopicMerger'
import sectionswithtopics1 from '../data/sectionswithtopics-science.json'
import sectionswithtopics2 from '../data/sectionswithtopics-nobel.json'
import sectionswithtopics3 from '../data/sectionswithtopics-philosophy.json'
import sectionswithtopics4 from '../data/sectionswithtopics-diversity.json'

const maxMainSections = 2
const maxMinorSections = 8
const maxTopicsPerSection = 5

const tMerger = new TopicMerger({
  salienceThreshhold: 0.3,
  minSectionCount: 6,
  maxSectionCount: 20
})
tMerger.initialize([
  sectionswithtopics1,
  sectionswithtopics2,
  sectionswithtopics3,
  sectionswithtopics4
])
const sectionspertopic = tMerger.getPerTopic()
const sectionMap = tMerger.getSectionMap()

Vue.use(Vuex)

const mapSectionDataForDisplay = (state, getters, sectionDataArr) => {
  return sectionDataArr.map(data => {
    return {
      salience: data.salience,
      page: data.page,
      title: data.sectionTitle,
      content: getters.getSectionHTML(data.page, data.section),
      topics: getters.getSectionRelevantTopics(data.page, data.section)
        .filter(t => {
          return t.conceptId !== state.current.topic
        })
    }
  })
}

export default new Vuex.Store({
  state: {
    current: {
      topic: null,
      sections: {
        main: [],
        minor: [],
        extra: []
      }
    },
    topicSelectList: []
  },
  getters: {
    isTopicSet: state => !!state.current.topic,
    getCurrentSectionCount: state => {
      return state.current.sections.main.length +
        state.current.sections.minor.length +
        state.current.sections.extra.length
    },
    getMainSectionsForDisplay: (state, getters) => {
      return mapSectionDataForDisplay(state, getters, state.current.sections.main)
    },
    getMinorSectionsForDisplay: (state, getters) => {
      return mapSectionDataForDisplay(state, getters, state.current.sections.minor)
    },
    getExtraSectionsForDisplay: (state, getters) => {
      return mapSectionDataForDisplay(state, getters, state.current.sections.extra)
    },
    getCurrentTopicTitle: state => {
      return sectionspertopic[state.current.topic].term
    },
    getCurrentTopic: state => {
      return state.current.topic
    },
    getAnyTopicTitle: state => (topic) => {
      return sectionspertopic[topic].term
    },
    getTopicSelectList: state => {
      return state.topicSelectList
    },
    getSectionHTML: state => (page, sectionTitle) => {
      const pageSectionData = sectionMap[page][sectionTitle]
      return pageSectionData.html || ''
    },
    getSectionRelevantTopics: state => (page, sectionTitle) => {
      const topics = sectionMap[page][sectionTitle].topics || []
      const trimmed = topics.slice(0, maxTopicsPerSection).map((x) => x)
      return trimmed
    }
  },
  mutations: {
    setTopic (state, topic) {
      state.current.topic = topic
    },
    setSectionsForTopic (state, topic) {
      const sections = sectionspertopic[topic].sections.map(x => x)
      const actualMaxMinorSections = sections.length < 10
        ? 3 : maxMinorSections
      let sect = null
      // Reset
      state.current.sections = {
        main: [],
        minor: [],
        extra: []
      }

      for (let i = 0; i < maxMainSections; i++) {
        sect = sections.shift()
        if (sect) {
          state.current.sections.main.push(sect)
        }
      }
      for (let i = 0; i < actualMaxMinorSections; i++) {
        sect = sections.shift()
        if (sect) {
          state.current.sections.minor.push(sect)
        }
      }
      state.current.sections.extra = sections || []
    },
    loadTopicSelectList (state, topics) {
      state.topicSelectList = topics
    }
  },
  actions: {
    load (state) {
      // eslint-disable-next-line no-unused-vars
      const perTopic = tMerger.getPerTopic()
      state.commit(
        'loadTopicSelectList',
        Object.keys(perTopic)
          // Map to what the SELECT expects
          .map(topic => {
            const count = perTopic[topic].sections.length
            return {
              wikidata: topic,
              name: `${perTopic[topic].term} (${count})`,
              count
            }
          })
          .sort((a, b) => {
            // Sort by salience, descending
            if (a.count < b.count) {
              return 1
            } else if (a.count > b.count) {
              return -1
            }
            return 0
          })
      )
    },
    setCurrentTopic (state, topic) {
      state.commit('setTopic', topic)
      state.commit('setSectionsForTopic', topic)
    }
  }
})
