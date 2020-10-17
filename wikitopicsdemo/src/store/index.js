import Vue from 'vue'
import Vuex from 'vuex'
import TopicMerger from './TopicMerger'
import Utils from '../Utils'
import sectionswithtopics1 from '../data/sectionswithtopics-science.json'
import sectionswithtopics2 from '../data/sectionswithtopics-nobel.json'
import sectionswithtopics3 from '../data/sectionswithtopics-philosophy.json'
import sectionswithtopics4 from '../data/sectionswithtopics-diversity.json'

const maxMainSections = 2
const maxMinorSections = 8
const maxTopicsPerSection = 5

const allTopicJsonFiles = [
  sectionswithtopics1,
  sectionswithtopics2,
  sectionswithtopics3,
  sectionswithtopics4
]
const tMerger = new TopicMerger({
  salienceThreshhold: 0.3,
  minSectionCount: 6,
  maxSectionCount: 40
})

Vue.use(Vuex)

const mapSectionDataForDisplay = (state, getters, sectionDataArr) => {
  return sectionDataArr.map(data => {
    return {
      salience: data.salience,
      page: data.page,
      title: data.sectionTitle,
      sectionId: data.section,
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
    settingsDialogShow: false,
    notice: null,
    current: {
      topic: null,
      sections: {
        main: [],
        minor: [],
        extra: []
      }
    },
    settings: {
      salienceThreshhold: 0,
      minSectionCount: 0,
      maxSectionCount: 0
    },
    topicSelectList: []
  },
  getters: {
    isSettingDialogShowing: state => state.settingsDialogShow,
    isTopicSet: state => !!state.current.topic,
    getNotice: state => state.notice,
    getSettings: state => state.settings,
    getSalienceThreshhold: state => state.settings.salienceThreshhold,
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
      return tMerger.getPerTopic()[state.current.topic].term
    },
    getCurrentTopic: state => {
      return state.current.topic
    },
    getAnyTopicTitle: state => (topic) => {
      return tMerger.getPerTopic()[topic].term
    },
    getTopicSelectList: state => {
      return state.topicSelectList
    },
    getSectionHTML: state => (page, sectionTitle) => {
      const pageSectionData = tMerger.getSectionMap()[page][sectionTitle]
      return pageSectionData.html || ''
    },
    getSectionRelevantTopics: state => (page, sectionTitle) => {
      const topics = tMerger.getSectionMap()[page][sectionTitle].topics || []
      const trimmed = topics.slice(0, maxTopicsPerSection).map((x) => x)
      return trimmed
    }
  },
  mutations: {
    setTopic (state, topic) {
      state.current.topic = topic
    },
    setSectionsForTopic (state, topic) {
      // Reset
      state.current.sections = {
        main: [],
        minor: [],
        extra: []
      }
      if (!topic) {
        return
      }
      const sections = tMerger.getPerTopic()[topic].sections.map(x => x)
      const actualMaxMinorSections = sections.length < 10
        ? 3 : maxMinorSections
      let sect = null

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
    updateSettings (state, config) {
      const newState = Object.assign(state.settings, config)
      state.settings = newState
      Utils.saveDefaultConfig(state.settings)
    },
    resetTopics (state) {
      tMerger.setConfig(state.settings)
      // Re-run the initialization process with the new config
      tMerger.initialize(allTopicJsonFiles)
    },
    loadTopicSelectList (state) {
      const perTopic = tMerger.getPerTopic()
      const topics = Object.keys(perTopic)
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

      state.topicSelectList = topics
    },
    setNotice (state, message) {
      state.notice = message
    },
    showSettingsDialog (state) {
      state.settingsDialogShow = true
    },
    hideSettingsDialog (state) {
      state.settingsDialogShow = false
    }
  },
  actions: {
    initialLoad (store) {
      // Load settings
      const config = Utils.loadDefaultConfig(tMerger.getCurrentConfigValues())
      store.commit('updateSettings', config)
    },
    setCurrentTopic (store, topic) {
      store.commit('setNotice', '')
      store.commit('setTopic', topic)
      store.commit('setSectionsForTopic', topic)
    },
    updateSettingValue (store, confObj) {
      store.commit('updateSettings', confObj)
    },
    resetTopics (store) {
      store.commit('resetTopics')
      store.commit('loadTopicSelectList')
      let topic = store.state.current.topic
      let dialogShow = false
      let notice = ''
      const weAreInLandingPage = !topic
      // After we refreshed everything, see if there are any topics
      // in the list at all. If not, we need to reset and let the user
      // know that there aren't any topics
      if (!store.state.topicSelectList.length) {
        topic = null
        notice = 'There are no available topics with the settings you\'ve chosen.'
        dialogShow = true
      } else if (!weAreInLandingPage) {
        // We are not in the landing page, which means we already have
        // a selected topic.
        // We need to check if the refreshed list still has the topic
        // that is currently selected
        if (
          !store.state.topicSelectList
            .filter(t => { return t.wikidata === topic }).length
        ) {
          // The topic we selected is no longer in the list.
          // Pick another topic from the list, and notify the user
          // So we don't send the user to the landing page
          // (nullifying the topic and sending the user to the
          // landing page seems more abrupt)
          topic = store.state.topicSelectList[0].wikidata
          notice = 'The topic you have selected is no longer available under the new configuration options. A new topic was selected instead.'
        }
      }

      // Whatever we did with our topic (kept the same or changed it)
      // Now reset the state matching the new sections
      store.commit('setTopic', topic)
      store.commit('setSectionsForTopic', topic)
      store.commit('setNotice', notice)

      if (dialogShow) {
        store.commit('showSettingsDialog')
      } else {
        store.commit('hideSettingsDialog')
      }
    },
    showSettingsDialog (store) {
      store.commit('showSettingsDialog')
    },
    hideSettingsDialog (store) {
      store.commit('hideSettingsDialog')
    }
  }
})
