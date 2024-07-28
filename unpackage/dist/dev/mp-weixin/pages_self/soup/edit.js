"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
const utils_tools = require("../../utils/tools.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  _easycom_uni_notice_bar2();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
if (!Math) {
  _easycom_uni_notice_bar();
}
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const soupScore = common_vendor.Vs.importObject("soup-score");
    const userStore = stores_user.useUserStore();
    const useStateFormat = common_vendor.computed(() => utils_common.stateFormat(formData.value.status));
    const subscribemsg = common_vendor.Vs.importObject("subscribemsg");
    const db = common_vendor.Vs.database();
    const formData = common_vendor.ref({
      soup_type: 0,
      content: "",
      from: "",
      feedback: ""
    });
    const disabled = common_vendor.ref(false);
    const statusDisabled = common_vendor.ref(false);
    let id;
    common_vendor.onLoad((e) => {
      id = e.id;
      console.log(common_vendor.Vs.getCurrentUserInfo());
      if (id) {
        common_vendor.index.showLoading({
          title: "加载中...",
          mask: true
        });
        getDetail();
        common_vendor.index.setNavigationBarTitle({
          title: "编辑鸡汤"
        });
      }
    });
    const radioChange = (e) => {
      console.log(e);
      formData.value.soup_type = Number(e.detail.value);
      if (formData.value.status != 2) {
        formData.value.feedback = "";
      }
    };
    const statusChange = (e) => {
      formData.value.status = Number(e.detail.value);
    };
    const onSubmit = async () => {
      if (!utils_common.isAdminRole()) {
        await common_vendor.index.requestSubscribeMessage({
          tmplIds: ["Fct-1k8MQNi2XDWEq2q7QfsrCp3gDU4L5hCxshb_LGQ"]
          // 改成你的小程序订阅消息模板id	
        });
      }
      try {
        disabled.value = true;
        common_vendor.index.showLoading({
          title: "提交中"
        });
        formData.value.content = utils_tools.removeHtmlTags(formData.value.content);
        if (formData.value.content === "")
          return utils_common.showToast("鸡汤内容不能为空", "none", false);
        let errCode, res;
        let { soup_type, status, content, from, feedback } = formData.value;
        let _formData = { soup_type, status, content, from, feedback };
        if (id) {
          if (!utils_common.isAdminRole())
            _formData.status = 0;
          if (utils_common.isAdminRole())
            _formData.review_uid = userStore.userInfo._id;
          res = await db.collection("soup-chicken").doc(id).update(_formData);
        } else {
          if (utils_common.isAdminRole())
            formData.value.status = 1;
          res = await db.collection("soup-chicken").add(formData.value);
        }
        errCode = res.result.errCode;
        if (errCode === 0) {
          common_vendor.index.$emit("soupUpdate", { msg: "更新了" });
          utils_common.showToast("发表成功", "success");
          setTimeout(() => common_vendor.index.navigateBack(), 1e3);
          updataSuccess(res.result.id);
        }
      } catch (e) {
        console.log(e);
        utils_common.showToast(e.errMsg, "error");
      } finally {
        common_vendor.index.hideLoading();
        disabled.value = false;
      }
    };
    const updataSuccess = (soupID) => {
      if (id || utils_common.isAdminRole()) {
        if (formData.value.status === 1) {
          let { user_id: [{ _id: user_id = common_vendor.Vs.getCurrentUserInfo().uid } = {}] = [], _id: soup_id = soupID } = formData.value || {};
          soupScore.soupAdd({ user_id, soup_id }).then((res) => {
          });
        }
      }
      if (id && !utils_common.isAdminRole()) {
        subscribemsg.sendSubscribeMessage({
          user_id: formData.value.user_id[0]._id,
          thing1: useStateFormat.value.text,
          time4: utils_tools.formatDate(Date.now()),
          thing5: formData.value.feedback ? formData.value.feedback : "点击进入小程序查看"
        }).then((res) => {
          console.log(res);
        });
      }
    };
    const getDetail = async () => {
      let soupTemp = await db.collection("soup-chicken").where({ _id: id }).getTemp();
      let userTemp = await db.collection("uni-id-users").field("_id,username,avatar").getTemp();
      let { result: { errCode, data } } = await db.collection(soupTemp, userTemp).get();
      if (errCode === 0) {
        formData.value = data[0];
        if (formData.value.status !== 2 && !utils_common.isAdminRole())
          statusDisabled.value = true;
      }
      common_vendor.index.hideLoading();
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: formData.value.status != void 0 && !common_vendor.unref(utils_common.isAdminRole)()
      }, formData.value.status != void 0 && !common_vendor.unref(utils_common.isAdminRole)() ? {
        b: common_vendor.p({
          ["background-color"]: useStateFormat.value.bgColor,
          color: useStateFormat.value.color,
          showIcon: true,
          text: `通知：${useStateFormat.value.text}，${formData.value.status == 0 || formData.value.status == 1 ? "不允许再次编辑" : formData.value.feedback + "，修改后可再次提交"}。`
        })
      } : {}, {
        c: formData.value.user_id && common_vendor.unref(utils_common.isAdminRole)()
      }, formData.value.user_id && common_vendor.unref(utils_common.isAdminRole)() ? {
        d: ((_b = (_a = formData.value) == null ? void 0 : _a.user_id[0]) == null ? void 0 : _b.avatar) || "../../static/images/self.png",
        e: common_vendor.t(((_d = (_c = formData.value) == null ? void 0 : _c.user_id[0]) == null ? void 0 : _d.username) || "匿名")
      } : {}, {
        f: disabled.value || statusDisabled.value,
        g: formData.value.soup_type == 0,
        h: disabled.value || statusDisabled.value,
        i: formData.value.soup_type == 1,
        j: common_vendor.o(radioChange),
        k: disabled.value || statusDisabled.value,
        l: formData.value.content,
        m: common_vendor.o(($event) => formData.value.content = $event.detail.value),
        n: disabled.value || statusDisabled.value,
        o: formData.value.from,
        p: common_vendor.o(($event) => formData.value.from = $event.detail.value),
        q: common_vendor.unref(utils_common.isAdminRole)() && formData.value._id
      }, common_vendor.unref(utils_common.isAdminRole)() && formData.value._id ? common_vendor.e({
        r: common_vendor.f(common_vendor.unref(utils_common.stateLists), (item, k0, i0) => {
          return {
            a: item.value,
            b: item.color,
            c: item.value == formData.value.status,
            d: common_vendor.t(item.text),
            e: item.value
          };
        }),
        s: common_vendor.o(statusChange),
        t: formData.value.status == 2
      }, formData.value.status == 2 ? {
        v: disabled.value || statusDisabled.value,
        w: formData.value.feedback,
        x: common_vendor.o(($event) => formData.value.feedback = $event.detail.value)
      } : {}) : {}, {
        y: common_vendor.unref(utils_common.isAdminRole)()
      }, common_vendor.unref(utils_common.isAdminRole)() ? {
        z: common_vendor.o(onSubmit),
        A: statusDisabled.value
      } : {
        B: common_vendor.o(onSubmit),
        C: statusDisabled.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-10b94cb3"]]);
wx.createPage(MiniProgramPage);
