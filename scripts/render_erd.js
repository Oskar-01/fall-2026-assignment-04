import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function findRepoRoot() {
  let curr = process.cwd();
  while (curr !== path.dirname(curr)) {
    if (fs.existsSync(path.join(curr, "package.json"))) {
      return curr;
    }
    curr = path.dirname(curr);
  }
  return process.cwd();
}

const repoRoot = findRepoRoot();

const rawInput = process.argv[2] || "docs/architecture/schema.mmd";
const rawOutput = process.argv[3] || "docs/architecture/erd.svg";

let inputPath = path.isAbsolute(rawInput) ? rawInput : path.resolve(process.cwd(), rawInput);
if (!fs.existsSync(inputPath) && !path.isAbsolute(rawInput)) {
  const fallback = path.resolve(repoRoot, rawInput);
  if (fs.existsSync(fallback)) {
    inputPath = fallback;
  }
}

let outputPath = path.isAbsolute(rawOutput) ? rawOutput : path.resolve(process.cwd(), rawOutput);
if (!path.isAbsolute(rawOutput) && !fs.existsSync(path.dirname(outputPath))) {
  outputPath = path.resolve(repoRoot, rawOutput);
}

function failure(details) {
  console.error(`SYNTAX_ERROR: ${details}`);
  process.exit(1);
}

try {
  if (!fs.existsSync(inputPath)) {
    failure(`Input file not found: ${inputPath}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const extraLibPath = "/home/oskar/.local/lib";
  const ldLibraryPath = process.env.LD_LIBRARY_PATH
    ? `${extraLibPath}:${process.env.LD_LIBRARY_PATH}`
    : extraLibPath;

  const env = {
    ...process.env,
    LD_LIBRARY_PATH: ldLibraryPath,
  };

  const result = spawnSync("npx", ["mmdc", "-i", inputPath, "-o", outputPath], {
    encoding: "utf8",
    shell: process.platform === "win32",
    env,
  });

  if (result.error) {
    failure(result.error.stack || String(result.error));
  }
  if (result.status !== 0) {
    failure(result.stderr || result.stdout || `mmdc exited with code ${result.status}`);
  }

  console.log("SUCCESS");
  process.exit(0);
} catch (err) {
  failure(err && err.stderr ? String(err.stderr) : err.stack || String(err));
}