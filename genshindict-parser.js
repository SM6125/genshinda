// get original file from https://genshin-dictionary.com/ja/opendata before running on nodejs
const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "words.json");
const outputFile = path.join(__dirname, "genshindict-parsed.json");

const input = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
const output = [];

input.forEach((entry) => {
    const plain = entry.ja;
    if (plain.includes("/")) return; // skip entries with multiple words
    let yomi = entry.pronunciationJa;

    if (!yomi) {
        // if plain is kana, use it as yomi with conversion to hiragana
        if (!/^[\u3040-\u3096\u30A1-\u30F6]+$/.test(plain)) return;
        yomi = plain;
    }

    // remove spaces and punctuation from yomi
    yomi = yomi.replace(/\s|・|\?|!|、|。/g, "");

    // convert katakana to hiragana in yomi
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

fs.writeFileSync(outputFile, JSON.stringify({ general: output }, null, 4), "utf-8");
console.log(`Parsed data written to ${outputFile}`);
