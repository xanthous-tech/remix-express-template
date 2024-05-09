import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/main.ts"],
  platform: "node",
  target: "esnext",
  format: ["esm"],
  external: ["lightningcss"],
  cjsInterop: true,
  legacyOutput: false,
  splitting: false,
  sourcemap: true,
});
