const { CoverageProvider } = require('@0xproject/sol-cov');

module.exports = {
    networks: {
        development: {
            provider: new CoverageProvider(
                'build/contracts',
                'contracts',
                50,
                '0x5409ed021d9299bf6814279a6a1411a7e866a631',
                'https://ropsten.infura.io/',
            ),
            network_id: 50,
        },
    },
};
