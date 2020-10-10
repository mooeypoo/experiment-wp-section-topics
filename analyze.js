/**
 * Analyze a wikisections-xxx.json file
 */
import sectiondata from './output/sectionswithtopics-science.json'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs')

const result = {};
for (const [pageName,sectionsArray] of Object.entries(sectiondata)) {
  let index = 0;
  sectionsArray.forEach(secdata => {
    secdata.topics.forEach(topic => {
      result[topic.phrase] = result[topic.phrase] || {}
      result[topic.phrase].wikidata = topic.conceptId
      
      result[topic.phrase].pages = result[topic.phrase].pages || {}
      result[topic.phrase].pages[topic.salience] = {
        page: pageName,
        section: {
          index,
          title: secdata.title,
          level: secdata.level
        }
      }
    })
    index++
  })
}

console.log(`Writing to file: 'output/pertopic-science.json`)
writeToFile(result,'output/pertopic-science.json')

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