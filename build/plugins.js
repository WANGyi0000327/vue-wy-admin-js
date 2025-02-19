import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { themePreprocessorPlugin } from "@pureadmin/theme";
import legacyPlugin from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { codeInspectorPlugin } from "code-inspector-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import UnoCSS from "unocss/vite";
import { vitePluginFakeServer } from "vite-plugin-fake-server";
import removeConsole from "vite-plugin-remove-console";
import removeNoMatch from "vite-plugin-router-warn";
import svgLoader from "vite-svg-loader";
import { genScssMultipleScopeVars } from "../src/layout/theme";
import { cdn } from "./cdn";
import { configCompressPlugin } from "./compress";
import { viteBuildInfo } from "./info";
import { pathResolve } from "./utils";

export function getPluginsList(VITE_CDN, VITE_COMPRESSION) {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    legacyPlugin({
      targets: ["defaults", "ie >= 11", "chrome 52"], //需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      renderLegacyChunks: true,
      modernPolyfills: true,
      polyfills: [
        "es.symbol",
        "es.array.filter",
        "es.promise",
        "es.promise.finally",
        "es/map",
        "es/set",
        "es.array.for-each",
        "es.array.flat",
        "es.object.define-properties",
        "es.object.define-property",
        "es.object.get-own-property-descriptor",
        "es.object.get-own-property-descriptors",
        "es.object.keys",
        "es.object.entries",
        "es.object.from-entries",
        "es.object.to-string",
        "web.dom-collections.for-each",
        "esnext.global-this",
        "esnext.string.match-all"
      ]
    }),
    UnoCSS(),
    // jsx、tsx语法支持
    vueJsx(),
    VueI18nPlugin({
      include: [pathResolve("../locales/**")]
    }),
    // checker({
    //   typescript: true,
    //   vueTsc: true,
    //   eslint: {
    //     lintCommand: `eslint ${pathResolve("../{src,mock,build}/**/*.{vue,js,ts,tsx}")}`,
    //     useFlatConfig: true
    //   },
    //   terminal: false,
    //   enableBuild: false
    // }),
    /**
     * 在页面上按住组合键时，鼠标在checker页面移动即会在 DOM 上出现遮罩层并显示相关信息，点击一下将自动打开 IDE 并将光标定位到元素对应的代码位置
     * Mac 默认组合键 Option + Shift
     * Windows 默认组合键 Alt + Shift
     * 更多用法看 https://inspector.fe-dev.cn/guide/start.html
     */
    codeInspectorPlugin({
      bundler: "vite",
      hideConsole: true
    }),
    viteBuildInfo(),
    /**
     * 开发环境下移除非必要的vue-router动态路由警告No match found for location with path
     * 非必要具体看 https://github.com/vuejs/router/issues/521 和 https://github.com/vuejs/router/issues/359
     * vite-plugin-router-warn只在开发环境下启用，只处理vue-router文件并且只在服务启动或重启时运行一次，性能消耗可忽略不计
     */
    removeNoMatch(),
    // mock支持
    vitePluginFakeServer({
      logger: false,
      include: "mock",
      infixName: false,
      enableProd: true
    }),
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        extract: true
      }
    }),
    // svg组件化支持
    svgLoader(),
    VITE_CDN ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
    // 线上环境删除console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    // 打包分析
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : null
  ];
}
