const path = require('path');
const fs = require('fs');

const networkId = "137";

const dir = path.join(__dirname, "build", "contracts");
const targetDir = path.join(__dirname, "build", "diff", networkId);

const paths = fs.readdirSync(dir);

paths.forEach(p => {
    const full = path.join(dir, p);
    const tfull = path.join(targetDir, p);
    const content = JSON.parse(fs.readFileSync(full));
    const networkInfo = content['networks'][networkId];
    if (networkInfo) {
        fs.writeFileSync(tfull, Buffer.from(JSON.stringify(networkInfo)));
    }
});