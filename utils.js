function getEnvBuyNetwork(network) {
    let env = 'release';

    if (network == "test"
        || network == "mumbai"
        || network == "develop"
    ) {
        env = 'dev';
    }

    return env;
}

exports.getEnvBuyNetwork = getEnvBuyNetwork;