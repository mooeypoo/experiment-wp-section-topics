# Experiment: Wikipedia section topics =

Experimental script to divide wikipedia articles into sections and pass them through Rosette.com so they're tagged with wikipedia items.

## Use

1. Clone the repo
2. Sign up for a dev access in [rosette.com](https://www.rosette.com/)
3. rename `config.sample.js` to `config.js` and add your Rosette API ID to the config
4. run `npm install`
5. Edit `fetch.js` and add the group of pages you'd like to analyze in `pagelist`
6. Run `node fetch.js` for the files from the APIs
7. Run `node analyze.js` for the analysis into topics