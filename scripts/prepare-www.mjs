import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "www");
const files = ["index.html", "styles.css", "app.js", "manifest.json"];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const file of files) {
  await cp(join(root, file), join(out, file));
}

await cp(join(root, "assets"), join(out, "assets"), {
  recursive: true,
  filter: (source) => !source.includes(".git"),
});
