"use strict";
const common_vendor = require("../common/vendor.js");
common_vendor.Vs.importObject("uni-id-co");
const db = common_vendor.Vs.database();
const usersTable = db.collection("uni-id-users");
const useUserStore = common_vendor.defineStore("user", () => {
  let hostUserInfo = common_vendor.index.getStorageSync("uni-id-pages-userInfo") || {};
  const userInfo = common_vendor.ref(hostUserInfo);
  const hasLogin = common_vendor.ref(Object.keys(hostUserInfo).length != 0);
  async function updateUserInfo(data = false) {
    if (data) {
      usersTable.where("_id==$env.uid").update(data).then((e) => {
        if (e.result.updated) {
          common_vendor.index.showToast({
            title: "更新成功",
            icon: "none",
            duration: 3e3
          });
          setUserInfo(data);
        } else {
          common_vendor.index.showToast({
            title: "没有改变",
            icon: "none",
            duration: 3e3
          });
        }
      });
    } else {
      const uniIdCo = common_vendor.Vs.importObject("uni-id-co", {
        customUI: true
      });
      try {
        let res = await usersTable.where("'_id' == $cloudEnv_uid").field("mobile,nickname,username,email,avatar,wx_openid.mp as openid,register_date").get();
        const realNameRes = await uniIdCo.getRealNameInfo();
        setUserInfo({
          ...res.result.data[0],
          realNameAuth: realNameRes
        });
      } catch (e) {
        setUserInfo({}, { cover: true });
        console.error(e.message, e.errCode);
      }
    }
  }
  async function setUserInfo(data, { cover } = { cover: false }) {
    let _userInfo = cover ? data : Object.assign(userInfo.value, data);
    userInfo.value = Object.assign({}, _userInfo);
    hasLogin.value = Object.keys(userInfo.value).length != 0;
    common_vendor.index.setStorageSync("uni-id-pages-userInfo", userInfo.value);
    return data;
  }
  function loginSuccess(e = {}) {
    const {
      showToast = true,
      toastText = "登录成功",
      autoBack = true,
      uniIdRedirectUrl = "",
      passwordConfirmed
    } = e;
    if (showToast) {
      common_vendor.index.showToast({
        title: toastText,
        icon: "none",
        duration: 3e3
      });
    }
    updateUserInfo();
    common_vendor.index.$emit("uni-id-pages-login-success");
    if (autoBack) {
      loginBack(uniIdRedirectUrl);
    }
  }
  function loginBack(e = {}) {
    const { uniIdRedirectUrl = "" } = e;
    let delta = 0;
    let pages = getCurrentPages();
    pages.forEach((page, index) => {
      if (pages[pages.length - index - 1].route.split("/")[3] == "login") {
        delta++;
      }
    });
    if (uniIdRedirectUrl) {
      return common_vendor.index.redirectTo({
        url: uniIdRedirectUrl,
        fail: (err1) => {
          common_vendor.index.switchTab({
            url: uniIdRedirectUrl,
            fail: (err2) => {
              console.log(err1, err2);
            }
          });
        }
      });
    }
    if (delta) {
      const page = pagesJson.pages[0];
      return common_vendor.index.reLaunch({
        url: `/${page.path}`
      });
    }
    common_vendor.index.navigateBack({
      delta
    });
  }
  return { userInfo, hasLogin, loginSuccess, updateUserInfo };
});
exports.useUserStore = useUserStore;
