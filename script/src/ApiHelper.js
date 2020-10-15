import axios from 'axios'
import Api from 'rosette-api';
import config from '../config.js'


class ApiHelper {
  constructor() {
    this.rosetteApi = new Api(config.rosette_key);

    this.queries = {
      parts: function (pageName) {
        return `{
          page(name: { authority: "simple.wikipedia.org", name: "${pageName}"} ) {
            name
            dateModified
            hasPart(offset: 0) {
              name
              unsafe
            }
          }
        }`;
      }
    }
  }

  async fetchFromWikipedia(pageName) {
    pageName = pageName.replace(/ /g, '_')
    pageName = encodeURIComponent(pageName)
    return axios
      .get(
        `https://en.wikipedia.org/api/rest_v1/page/html/${pageName}?redirect=true`
      )
      .then(res => {
        return res.data
      })
      .catch(e => {
        console.log(e)
      })
  }

  async fetchFromRosette(api_endpoint, content) {
    const deferred = new Deferred();
    this.rosetteApi.parameters.content = content;
    this.rosetteApi.rosette(api_endpoint, function(err, res){
      if(err){
        deferred.reject(err);
      } else {
        deferred.resolve(res);
      }
    });
    return deferred;
  }

  async sleep(delay = 1000) {
    console.log('Sleep: ', delay)
    return new Promise((resolve, reject) => {
      setTimeout( () => resolve(), delay);
    } );
  }
}

/**
 * Helper function faking a deferred promise
 */
function Deferred () {
  var res = null,
    rej = null,
    p = new Promise((a,b)=>(res = a, rej = b));
  p.resolve = res;
  p.reject = rej;
  return p;
}

export default ApiHelper;