const path = require("path")
// const consola = require("consola")

const grammarPath = path.resolve(__dirname, "../../packages/herotext/src/herotext.js")
module.exports = function override(config, env) {
    delete config.module.rules[1].oneOf[3].include
    config.module.rules[1].oneOf[3].exclude = [grammarPath]
    // console.log(JSON.stringify(config, null, "  "))
    return config
}
