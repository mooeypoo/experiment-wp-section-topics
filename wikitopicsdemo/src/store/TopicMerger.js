class TopicMerger {
  constructor (config = {}) {
    this.setConfig(config)
  }

  setConfig (config) {
    this.config = this.config || {}
    this.config.salienceThreshhold = config.salienceThreshhold || this.getValueWithFallback(this.config.salienceThreshhold, 0.2)
    this.config.minSectionCount = config.minSectionCount || this.getValueWithFallback(this.config.minSectionCount, 10)
    this.config.maxSectionCount = config.maxSectionCount || this.getValueWithFallback(this.config.maxSectionCount, 20)
  }

  getCurrentConfigValues () {
    return {
      salienceThreshhold: this.config.salienceThreshhold,
      minSectionCount: this.config.minSectionCount,
      maxSectionCount: this.config.maxSectionCount
    }
  }

  getConfigVal (key) {
    return this.config[key]
  }

  getValueWithFallback (currValue, fallback) {
    return currValue !== undefined
      ? currValue : fallback
  }

  initialize (allSectionsJsonArr = []) {
    this.sectionMap = this.processAllSections(allSectionsJsonArr)
    this.perTopic = this.breakSectionsPerTopic(this.sectionMap)
  }

  getPerTopic () {
    return this.perTopic || {}
  }

  getSectionMap () {
    return this.sectionMap || {}
  }

  processAllSections (jsonArr) {
    const sectionMap = {}
    let allSections = {}

    // Read and merge from all files
    for (const data of jsonArr) {
      // Merge
      allSections = Object.assign(allSections, data)
    }

    // Rarrange for easier fetching
    Object.keys(allSections).forEach(pageName => {
      allSections[pageName].forEach(sectionData => {
        const sectionId = sectionData.sectionId || '-1'
        sectionMap[pageName] = sectionMap[pageName] || {}

        sectionMap[pageName][`${sectionId}|${pageName}|${sectionData.title}`] = {
          title: sectionData.title,
          topics: sectionData.topics || [],
          html: sectionData.content.html
        }
      })
    })

    return sectionMap
  }

  breakSectionsPerTopic (sectionMap) {
    const perTopic = {}
    // Read all sections
    for (const [pageName, sections] of Object.entries(sectionMap)) {
      for (const [sectionId, sectionData] of Object.entries(sections)) {
        sectionData.topics.forEach(t => {
          perTopic[t.conceptId] = perTopic[t.conceptId] || { term: t.phrase, sections: [] }
          // Add to sections
          perTopic[t.conceptId].sections.push({
            page: pageName,
            section: sectionId,
            sectionTitle: sectionData.title,
            salience: t.salience
          })
        })
      }
    }

    // Now that we have all topics and sections,
    // Order topics by salience
    for (const topicId of Object.keys(perTopic)) {
      perTopic[topicId].sections = perTopic[topicId].sections
        .filter(data => {
          return data.salience >= this.config.salienceThreshhold
        })
        .sort((a, b) => {
          // Sort by salience, descending
          if (a.salience < b.salience) {
            return 1
          } else if (a.salience > b.salience) {
            return -1
          }
          return 0
        })

      // Verify that there are still pages after filtering
      // If not, delete the object
      if (perTopic[topicId].sections.length < this.config.minSectionCount) {
        delete perTopic[topicId]
      } else if (perTopic[topicId].sections.length > this.config.maxSectionCount) {
        // TRIM sections from topics now
        perTopic[topicId].sections = perTopic[topicId].sections.slice(0, this.config.maxSectionCount)
      }
    }

    // Now that we have all valid topics, we need to make sure that
    // sections in the sectionMap have their topics trimmed by this list
    const finalValidTopics = Object.keys(perTopic)
    for (const sections of Object.values(sectionMap)) {
      for (const sectionData of Object.values(sections)) {
        sectionData.topics = sectionData.topics.filter(t => {
          return finalValidTopics.indexOf(t.conceptId) > -1
        })
      }
    }

    return perTopic
  }
}

export default TopicMerger
