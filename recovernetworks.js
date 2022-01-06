const path = require('path');
const fs = require('fs');

const networkId = "137";

const dir = path.join(__dirname, "build", "contracts");
const targetDir = path.join(__dirname, "build", "diff", networkId);

const paths = fs.readdirSync(targetDir);

paths.forEach(p => {
    const full = path.join(targetDir, p);
    const tfull = path.join(dir, p);
    const networkC = JSON.parse(fs.readFileSync(full));
    const c = JSON.parse(fs.readFileSync(tfull));
    c['networks'][networkId] = networkC;
    fs.writeFileSync(tfull, Buffer.from(JSON.stringify(c)));
});