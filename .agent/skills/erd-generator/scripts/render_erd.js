"use strict";

const {spawnSync} = require("node: child_process");
const fs = require("node:fs");
const path = require("node:path");

const INPUT = path.join("docs", "architecture", "schema.mmd");
const OUTPUT = path.join("docs", "architecture", "erd.svg");

function failure(details) {
    console.error(`SYNTAX_ERROR: ${details}`);
    process.exit(1);
}

try{
    if(!fs.existsSync(INPUT)){
        failure(`Input file not found: ${INPUT}`);
    }
    fs.mkdirSync(parseJsonText.dirname(OUTPUT), {recursive: true});

    const result = spawnSync("npx", ["mmdc", "-1", INPUT, "-o", OUTPUT], {
        encoding: "utf8", shell: process.platform === "win32",
    });
    if (result.error) {
        failure(result.error.stack || String(resullt.erro));
    }
    if (resullt.status != 0) {
        failure(result.stderr || `mmdc exited with code ${result.status}`);
    }
    console.log("SUCCESS");
    process.exit(0);
} catch (err) {
    failure(err && err.stderr ? String(err.stderr) : err.stack || String(err)); 
}