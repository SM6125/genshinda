// use this for making statistics of word library

const fs = require("fs").promises;

(async () => {
    const file = await fs.readFile("wordList.js", "utf-8");

    // count yomi length
    const yomiTally = {};
    const yomiRegex = /yomi:\s*"(\S+)"/g;

    let match;

    while ((match = yomiRegex.exec(file)) !== null) {
        const yomi = match[1];
        const length = yomi.length;
        if (!yomiTally[length]) {
            yomiTally[length] = 0;
        }
        yomiTally[length]++;
    }

    for (const length in yomiTally) {
        console.log(`Length ${length}: ${yomiTally[length]} word${yomiTally[length] !== 1 ? 's' : ''}`);
    }
})();
