import Vue from 'vue'
import Vuex from 'vuex'
import sectionspertopic from '../data/pertopic-football.json'
import sectionswithtopics from '../data/sectionswithtopics-football.json'

const maxMainSections = 2
const maxMinorSections = 4
const maxTopicsPerSection = 5
const relevantTopics = Object.keys(sectionspertopic)
  .filter(t => {
    return sectionspertopic[t].pages.length > 5
  })

// Create a map for page->section->data for easier access
const sectionMap = {}
Object.keys(sectionswithtopics).forEach(pageName => {
  sectionswithtopics[pageName].forEach(sectionData => {
    const topics = sectionData.topics || []
    sectionMap[pageName] = sectionMap[pageName] || {}
    sectionMap[pageName][sectionData.title] = {
      topics: topics.filter(t => {
        return relevantTopics.indexOf(t.conceptId) > -1
      }),
      html: sectionData.content.html
    }
  })
})
const mapSectionDataForDisplay = (getters, sectionDataArr) => {
  return sectionDataArr.map(data => {
    return {
      salience: data.salience,
      page: data.page,
      title: data.section.title,
      content: getters.getSectionHTML(data.page, data.section.title),
      topics: getters.getSectionRelevantTopics(data.page, data.section.title)
    }
  })
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current: {
      topic: null,
      sections: {
        main: [],
        minor: [],
        extra: []
      }
    }
  },
  getters: {
    isTopicSet: state => !!state.current.topic,
    getMainSectionsForDisplay: (state, getters) => {
      return mapSectionDataForDisplay(getters, state.current.sections.main)
    },
    getMinorSectionsForDisplay: (state, getters) => {
      return mapSectionDataForDisplay(getters, state.current.sections.minor)
    },
    getExtraSectionsForDisplay: (state, getters) => {
      return mapSectionDataForDisplay(getters, state.current.sections.extra)
    },
    getCurrentTopicTitle: state => {
      return sectionspertopic[state.current.topic].item
    },
    getAnyTopicTitle: state => (topic) => {
      return sectionspertopic[topic].item
    },
    getAllTopicsForSelect: state => {
      return relevantTopics.map(topic => {
        const count = sectionspertopic[topic].pages.length
        return {
          wikidata: topic,
          name: `${sectionspertopic[topic].item} (${count})`,
          count
        }
      })
    },
    getAllTopics: state => {
      return relevantTopics.map(topic => {
        const count = sectionspertopic[topic].pages.length
        return {
          wikidata: topic,
          name: sectionspertopic[topic].item,
          count
        }
      })
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
      const blob = sectionspertopic[topic]
      // Reset
      state.current.sections = {
        main: [],
        minor: [],
        extra: []
      }

      for (let i = 0; i < maxMainSections; i++) {
        state.current.sections.main.push(blob.pages.shift())
      }
      for (let i = 0; i < maxMinorSections; i++) {
        state.current.sections.minor.push(blob.pages.shift())
      }
      state.current.sections.extra = blob.pages
    }
  },
  actions: {
    setCurrentTopic (state, topic) {
      state.commit('setTopic', topic)
      state.commit('setSectionsForTopic', topic)
    }
  }
})
