import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
    plugins: [solid(), vanillaExtractPlugin()],
});
