/**
 * Fetch data about given pages from given page list
 * and save as json files.
 */
import ApiHelper from './src/ApiHelper.js'
import htmlparser from 'node-html-parser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs')

const { parse } = htmlparser
const api = new ApiHelper()
const pagelists = {
  science: ['Albert Einstein','Niels Bohr'],
  football: [
    'Football',
    'American football',
    'American_football_in_the_United_States',
    'USA Football',
    'National Football League',
    'Major professional sports leagues in the United States and Canada',
    'History of the National Football League championship',
    'NFL_regular_season',
    'Women%27s_American_football',
    'Women%27s_Football_Alliance',
    'United_States_Women%27s_Football_League',
    'Legends_Football_League',
    'Women%27s_Arena_Football_League',
    'Utah Girls Football League'
  ]
}

let rosetteCounter = 0; 

run('football', pagelists.football);


async function run(name, pageList) {
  // Remove duplicates, just in case
  pageList = Array.from(new Set(pageList));

  // Grab from wikipedia
  console.log(`Grabbing data from Wikipedia.`)
  try {
    const sectionObj = await fetchWikipedia(pageList)

    let count = 0;
    for (const [pageName,sectionsArray] of Object.entries(sectionObj)) {
      sectionObj[pageName] = sectionObj[pageName]
        .filter(sec => {
          const root = parse(sec.content.html)
          const sections = root.querySelectorAll('section')
          return sections.length === 1 && // Remove <sections> that have other <sections> inside them
            sec.content.text.length < 50000 // Remove sections that are over the 50000 char limit
        })
      count += sectionObj[pageName].length
    }
    console.log(`Number of sections: ${count}`)
    console.log(`Writing to file: 'output/wikisections-${name}.json'`)
    writeToFile(sectionObj, `output/wikisections-${name}.json`)

    // Pass through Rosette
    const completeResult = await fetchRosette(sectionObj)

    console.log(`Total requests to Rosette: ${rosetteCounter}`)
    console.log(`Writing to file: 'output/sectionswithtopics-${name}.json'`)
    writeToFile(completeResult, `output/sectionswithtopics-${name}.json`)

  } catch (e) {
    console.log('ERROR from Wikipedia', e)
    return;
  }

}

async function fetchRosette(sectionObj) {
  const completeResult = {}
  // Go over the result
  for (const [pageName,sectionsArray] of Object.entries(sectionObj)) {
    completeResult[pageName] = completeResult[pageName] || [];

    // Per page, per section
    for (const sectionData of sectionsArray) {
      // Send section text to rosette
      const wait = await api.sleep(1000);
      try {
        rosetteCounter++
        console.log(`Fetching from Rosette: ${pageName} -> ${sectionData.title} (level ${sectionData.level})`)
        const topics = await api.fetchFromRosette('topics', sectionData.content.text);
        const concepts = topics.concepts
          .filter(c => {
            // Only use wikidata concepts
            // Only take topics that are 0.10 salience and up
            return c.conceptId.indexOf('Q') === 0 && c.salience >= 0.10
          })
          .sort((a, b) => {
            // Sort by count, descending
            if (a.salience < b.salience) {
              return 1;
            } else if (a.salience > b.salience) {
              return -1;
            }
            return 0;
          });

        sectionData.topics = concepts;
        console.log(`${pageName} -> ${sectionData.title} (level ${sectionData.level}) -- Topics fetched: ${concepts.length}`)
      } catch (e) {
        console.log(`Error: Rosette API (${pageName})`, (e.message || e))
      }

      completeResult[pageName].push(sectionData)
    }
  }
  return completeResult;
}

/**
 * Fetch pages from English Wikipedia and break them apart by <section>
 * Store in an array of objects per page
 *
 * @param {string[]} list List of pages to fetch and break apart
 * @return {Promise} A promise that is resolved once all page request promises have been resolved.
 *  The resolved value is an object where the keys are page names, and values are an array of objects
 *  representing the sections with some metadata and their content
 */
async function fetchWikipedia(list) {
  const promises = []
  let p
  for (let pageName of list ) {
    p = api.fetchFromWikipedia(pageName)
      .then(res => {
        const results = {}
        const root = parse(res)
        const sections = root.querySelectorAll('section')
        results[pageName] = [];

        for (let section of sections ) {

          const sectionID = section.getAttribute('data-mw-section-id')
          const sectionFirstChild = section.firstChild
          const sectionTag = sectionFirstChild.rawTagName
          if ( sectionID !== '0' && [ 'h2', 'h3', 'h4', 'h5', 'h6', 'h7' ].indexOf(sectionTag) === -1 ) {
            // Skip <sections> that aren't actual wiki sections
            // This is a naive check that will probably not work all the time, but likely work enough for this test
            continue;
          }
          const sectionLevel = sectionID === '0' ? 0 : Number( sectionTag.substring(1) ) - 1
          const sectionHeading = sectionID === '0' ? '__intro__' : sectionFirstChild.text
          const sectionContent = section.outerHTML
          if ( sectionHeading === 'References' || sectionHeading === 'External links' || sectionHeading === 'Further reading' || sectionHeading === 'See also' ) {
            // Skip references, external reading and further reading
            continue;
          }

          results[pageName].push({
            page: pageName,
            title: sectionHeading,
            level: sectionLevel,
            content: {
              text: section.text,
              html: sectionContent
            } 
          })
          console.log(`${pageName} -> ${sectionHeading} (level ${sectionLevel}) length: ${sectionContent.length}`)
        }

        return results
      })
    promises.push(p)
  }
  return Promise.all(promises)
    .then(promiseValues => {
      // Combine all individual objects into one
      const fullResult = {}
      promiseValues.forEach(v => {
        Object.assign(fullResult, v)
      })
      return fullResult
    })

}

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