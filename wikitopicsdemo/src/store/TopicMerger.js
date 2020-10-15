class TopicMerger {
  constructor (config = {}) {
    this.salienceThreshhold = config.salienceThreshhold || 0.2
    this.minSectionCount = config.minSectionCount || 10
    this.maxSectionCount = config.maxSectionCount || 20
  }

  initialize (allSectionsJsonArr = []) {
    this.sectionMap = this.processAllSections(allSectionsJsonArr)
    this.perTopic = this.breakSectionsPerTopic()
  }

  getPerTopic () {
    return this.perTopic
  }

  getSectionMap () {
    return this.sectionMap
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
        sectionMap[pageName] = sectionMap[pageName] || {}

        sectionMap[pageName][sectionData.title] = {
          topics: sectionData.topics || [],
          html: sectionData.content.html
        }
      })
    })

    return sectionMap
  }

  breakSectionsPerTopic () {
    const perTopic = {}
    // Read all sections
    for (const [pageName, sections] of Object.entries(this.sectionMap)) {
      for (const [sectionTitle, sectionData] of Object.entries(sections)) {
        sectionData.topics.forEach(t => {
          perTopic[t.conceptId] = perTopic[t.conceptId] || { term: t.phrase, sections: [] }
          // Add to sections
          perTopic[t.conceptId].sections.push({
            page: pageName,
            section: sectionTitle,
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
          return Number(data.salience) > this.salienceThreshhold
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
      if (perTopic[topicId].sections.length < this.minSectionCount) {
        delete perTopic[topicId]
      } else if (perTopic[topicId].sections.length > this.maxSectionCount) {
        // TRIM sections from topics now
        perTopic[topicId].sections = perTopic[topicId].sections.slice(0, this.maxSectionCount)
      }
    }

    return perTopic
  }
}

export default TopicMerger
