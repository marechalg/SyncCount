import { execSync } from 'child_process';
import { readFileSync } from 'fs';

function run(cmd: string) {
    console.log(`\n> ${cmd}\n`);
    execSync(cmd, { stdio: 'inherit' });
}

const TYPE: string = process.argv[2];
const ALIAS: Record<string, string> = {
    p: 'patch', patch: 'patch',
    m: 'minor', minor: 'minor',
    M: 'major', major: 'major'
}

if (!TYPE || !ALIAS[TYPE]) {
    console.error('Usage : npm run release -- [patch|p|minor|m|major|M]');
    process.exit(1);
}

const MESSAGE: string = process.argv[3];

console.log('Bumping...');
run('git add -A');
run(`git commit -m "temp"`);
run(`npm version ${ALIAS[TYPE]} --no-git-tag-version`);
run('npm install --package-lock-only');

const VERSION: string = JSON.parse(readFileSync('package.json', 'utf-8')).version;
console.info(`Bumped to V${VERSION}`);

run('git add package.json');
run(`git commit --amend -m "${MESSAGE ?? `Release ${ALIAS[TYPE]}: ${VERSION}`}"`);
run(`git tag -a ${VERSION} -m "${VERSION}"`);

console.log(`Releasing ${ALIAS[TYPE]} V${VERSION}...`);
run('git push origin main --follow-tags');

const changelog = readFileSync('CHANGELOG.md', 'utf-8');
const isUpToDate = changelog.includes(`syncCount ${VERSION}`);

if (isUpToDate) {
    run(`gh release create ${VERSION} --notes-file CHANGELOG.md`);
    console.info(`🚀 Successfully Released V${VERSION} with given CHANGELOG.md`);
} else {
    run(`gh release create ${VERSION} --generate-notes --draft`);
    console.info(`🚀 Successfully drafted V${VERSION} with a generated changelog`);
}