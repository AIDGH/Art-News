import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

class UploadRequest {
  static latest;
  upload = {};
  constructor() { UploadRequest.latest = this; }
  open(method, url) { this.method = method; this.url = url; }
  send(body) { this.body = body; }
}
async function load(relative, globals = {}) {
  const source = await readFile(new URL(relative, import.meta.url), "utf8");
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, ...globals });
  return exports;
}
const { adminUpload } = await load("../src/lib/admin-api.ts", { XMLHttpRequest: UploadRequest });
const progress = [];
const body = {};
const result = adminUpload("/editorial/media", body, p => progress.push(p));
const request = UploadRequest.latest;
assert.equal(request.method, "POST");
assert.equal(request.url, "/api/v1/editorial/media");
assert.equal(request.withCredentials, true);
assert.equal(request.body, body);
request.upload.onprogress({ lengthComputable: true, loaded: 42, total: 100 });
assert.deepEqual(progress, [42]);
request.status = 201;
request.responseText = JSON.stringify({ data: { id: "uploaded" } });
request.onload();
assert.equal((await result).data.id, "uploaded");
for (const [status, responseText, message] of [[413, "<html>Too large</html>", /۳۰/], [401, '{"message":"ابتدا وارد پنل شوید"}', /وارد/], [500, '{"message":["first","second"]}', /first، second/]]) {
  const pending = adminUpload("/editorial/media", body, () => {});
  const request = UploadRequest.latest;
  request.status = status;
  request.responseText = responseText;
  request.onload();
  await assert.rejects(pending, message);
}
const lost = adminUpload("/editorial/media", body, () => {});
UploadRequest.latest.onerror();
await assert.rejects(lost, /ارتباط/);
const timed = adminUpload("/editorial/media", body, () => {});
UploadRequest.latest.ontimeout();
await assert.rejects(timed, /مهلت/);
const { mediaFileType } = await load("../src/lib/media-file.ts");
for (const type of ["", "application/octet-stream", "video/mp4", "application/mp4"]) assert.equal(mediaFileType({ name: "CLIP.MP4", type }), "video/mp4");
assert.equal(mediaFileType({ name: "clip.m4v", type: "video/x-m4v" }), "video/mp4");
assert.equal(mediaFileType({ name: "clip.mov", type: "video/quicktime" }), undefined);
assert.equal(mediaFileType({ name: "evil.mp4", type: "text/html" }), undefined);
console.log("Upload progress, authenticated request, errors and mobile MIME normalization: OK");
