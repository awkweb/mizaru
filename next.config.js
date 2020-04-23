const path = require('path')

module.exports = {
    webpack(config, options) {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.join(__dirname, '/'),
            '@types': path.join(__dirname, '/@types/'),
        }
        return config
    },
}
