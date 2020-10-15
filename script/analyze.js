/**
 * Analyze a wikisections-xxx.json file
 */
const name = 'nobel'
import sectiondata from './output/sectionswithtopics-nobel.json'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs')

const salienceThreshhold = 0.20

const result = {};
for (const [pageName,sectionsArray] of Object.entries(sectiondata)) {
  let index = 0;
  sectionsArray.forEach(secdata => {
    if ( !secdata.topics || secdata.topics.length === 0 ) {
      return
    }
    secdata.topics.forEach(topic => {
      result[topic.conceptId] = result[topic.conceptId] || {}
      result[topic.conceptId].item = topic.phrase
      
      result[topic.conceptId].pages = result[topic.conceptId].pages || []
      result[topic.conceptId].pages.push({
        salience: topic.salience,
        page: pageName,
        section: {
          index,
          title: secdata.title,
          level: secdata.level
        }
      })
    })
    index++
  })
}

// Now that the object is build, sort each topic per salience, and remove salience under threshhold:
for (const topic of Object.keys(result)) {
  // If there are pages, sort and filter
  result[topic].pages = result[topic].pages
    .filter(data => {
      return Number( data.salience ) > salienceThreshhold
    })
    .sort((a, b) => {
      // Sort by salience, descending
      if (a.salience < b.salience) {
        return 1;
      } else if (a.salience > b.salience) {
        return -1;
      }
      return 0;
    });
  
  // Verify that there are still pages after filtering
  // If not, delete the object
  if (result[topic].pages.length === 0) {
    delete result[topic]
  }
}
console.log(`Writing to file: 'output/pertopic-${name}.json`)
writeToFile(result,`output/pertopic-${name}.json`)

// Now get the biggest topics
const topics = Object.keys(result)
  .sort((a, b) => {
    // Sort by salience, descending
    if (result[a].pages.length < result[b].pages.length) {
      return 1;
    } else if (result[a].pages.length > result[b].pages.length) {
      return -1;
    }
    return 0;
});

console.table(
  topics
    .filter(t => { return result[t].pages.length > 5 })
    .map(t => { return { section_count: result[t].pages.length, topic: t, topic_name: result[t].item }})
)
console.log(`Total topics: ${Object.keys(result).length}`)
console.log(`Total topics that have more than 2 sections: ${topics.filter(t => { return result[t].pages.length > 2 }).length}`)



/**
 * Write a JSON object into a file.
 *
 * @param {Object} content Object to write 
 * @param {string} path File path
 */
function writeToFile(content, path) {
  try {
    fs.writeFileSync(path, JSON.stringify(content, null, 2))
  } catch (e) {
    console.log(`Error writing to file at ${path}`, e)
  }
}