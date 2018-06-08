const ConfLab = require('conflab')
const objTemplate = require('obj-template')
const handlebars = require('handlebars');

const resolveTemplate = (obj) => objTemplate(obj, { templateFunc: handlebars.compile });

function loadConfig(configPath) {
  return new Promise((resolve, reject) => {
    const confLab = new ConfLab()
    confLab.load({ configPath }, (err, cfg) => {
      if (err) {
        return reject(err)
      }
      resolve(resolveTemplate(cfg))
    })
  })
}

module.exports = loadConfig
