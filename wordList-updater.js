// get original file from https://genshin-dictionary.com/ja/opendata before running on node.js
const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "words.json");
const addonFile = path.join(__dirname, "wordList-addon.json");
const outputFile = path.join(__dirname, "genshindict-parsed.json");

// ensure input
if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}. Download latest one from GenshinDict website.`);
    process.exit(1);
}
const input = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

// if no addon, use empty array instead
let addon;
if (fs.existsSync(addonFile)) {
    addon = JSON.parse(fs.readFileSync(addonFile, "utf-8"));
} else {
    addon = [];
}

const output = [];
input.forEach((entry) => {
    let { plain: ja, pronunciationJa: yomi } = entry;
    if (plain.includes("/")) return;

    if (!yomi) {
        // if no yomi and plain is non-kana, skip entry
        if (!/^[\u3040-\u3096\u30A1-\u30F6]+$/.test(plain)) return;
        yomi = plain;
    }

    if (yomi.includes("/")) {
        // if multiple pronunciations, take the first one
        yomi = yomi.split("/")[0];
    }

    // remove special characters
    yomi = yomi.replace(/\s|・|\?|!|、|。/g, "");

    // convert katakana to hiragana
    yomi = [...yomi]
        .map((char) => {
            const code = char.charCodeAt(0);
            if (code >= 0x30a1 && code <= 0x30f6) {
                return String.fromCharCode(code - 0x60);
            }
            return char;
        })
        .join("");

    output.push({
        plain,
        yomi,
    });
});

// append addon entries
output = output.concat(addon);

fs.writeFileSync(outputFile, JSON.stringify({ general: output }, null, 4), "utf-8");
console.log(`Parsed data written to ${outputFile}`);
