const deployTarget = process.env.DEPLOY_TARGET || 'firebase'
const publicPath = deployTarget === 'github' ? '/HTF/' : '/'

module.exports = {
    publicPath: publicPath
  }