const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {test} = require('node:test');
const {getAssetData} = require('metro/src/Assets');

const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
    'base64',
);

test('Metro reads image dimensions and preserves asset scales', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'share-menu-assets-'));
    try {
        const assetPath = path.join(directory, 'pixel@2x.png');
        fs.writeFileSync(assetPath, png);
        const asset = await getAssetData(assetPath, 'pixel@2x.png', [], null, '/assets');
        assert.equal(asset.width, 0.5);
        assert.equal(asset.height, 0.5);
        assert.deepEqual(asset.scales, [2]);
        assert.deepEqual(asset.files, [assetPath]);
    } finally {
        fs.rmSync(directory, {recursive: true, force: true});
    }
});

test('Metro reads image buffers inside .zip directories', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'share-menu-assets-'));
    try {
        const zipDirectory = path.join(directory, 'assets.zip');
        fs.mkdirSync(zipDirectory);
        const assetPath = path.join(zipDirectory, 'pixel.png');
        fs.writeFileSync(assetPath, png);
        const asset = await getAssetData(assetPath, 'pixel.png', [], null, '/assets');
        assert.equal(asset.width, 1);
        assert.equal(asset.height, 1);
    } finally {
        fs.rmSync(directory, {recursive: true, force: true});
    }
});

test('Metro leaves non-image asset dimensions unset', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'share-menu-assets-'));
    try {
        const assetPath = path.join(directory, 'sample.txt');
        fs.writeFileSync(assetPath, 'sample');
        const asset = await getAssetData(assetPath, 'sample.txt', [], null, '/assets');
        assert.equal(asset.width, undefined);
        assert.equal(asset.height, undefined);
    } finally {
        fs.rmSync(directory, {recursive: true, force: true});
    }
});

test('image-size rejects a zero-length ICNS entry without hanging', () => {
    const result = spawnSync(process.execPath, ['-e', `
        const assert = require('node:assert/strict');
        const {imageSize} = require('image-size');
        const image = Buffer.alloc(16);
        image.write('icns');
        image.writeUInt32BE(16, 4);
        image.write('ic07', 8);
        assert.throws(() => imageSize(image));
    `], {cwd: path.join(__dirname, '..'), timeout: 5000, encoding: 'utf8'});
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
});
