"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_user = require("./stores/user.js");
const utils_common = require("./utils/common.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/self/self.js";
  "./pages/detail/detail.js";
  "./pages/detail/reply.js";
  "./pages/login/login.js";
  "./pages/login/auto_login/auto_login.js";
  "./pages_self/soup/edit.js";
  "./pages_self/soup/list.js";
  "./pages_self/user/edit.js";
  "./pages_self/reviewed/list.js";
  "./pages_self/score/list.js";
  "./pages_self/like/list.js";
  "./pages_self/soup-collection/soup-collection.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.Vs.importObject("uni-id-co");
    stores_user.useUserStore();
    common_vendor.onLaunch(() => {
    });
    common_vendor.onShow(() => {
      console.log("App Show");
    });
    common_vendor.onHide(() => {
      console.log("App Hide");
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.showToast = utils_common.showToast;
  app.use(common_vendor.createPinia());
  return {
    app,
    Pinia: common_vendor.Pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
