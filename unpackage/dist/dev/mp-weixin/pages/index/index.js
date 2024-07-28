"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_home_head2 = common_vendor.resolveComponent("home-head");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_soup_tab_group2 = common_vendor.resolveComponent("soup-tab-group");
  const _easycom_soup_text_content2 = common_vendor.resolveComponent("soup-text-content");
  const _easycom_interactive_bar2 = common_vendor.resolveComponent("interactive-bar");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_share_posters2 = common_vendor.resolveComponent("share-posters");
  (_easycom_home_head2 + _easycom_uni_load_more2 + _easycom_soup_tab_group2 + _easycom_soup_text_content2 + _easycom_interactive_bar2 + _easycom_uni_popup2 + _easycom_share_posters2)();
}
const _easycom_home_head = () => "../../components/home-head/home-head.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_soup_tab_group = () => "../../components/soup-tab-group/soup-tab-group.js";
const _easycom_soup_text_content = () => "../../components/soup-text-content/soup-text-content.js";
const _easycom_interactive_bar = () => "../../components/interactive-bar/interactive-bar.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_share_posters = () => "../../components/share-posters/share-posters.js";
if (!Math) {
  (_easycom_home_head + _easycom_uni_load_more + _easycom_soup_tab_group + _easycom_soup_text_content + _easycom_interactive_bar + _easycom_uni_popup + _easycom_share_posters)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const listData = common_vendor.ref([]);
    const currentIndex = common_vendor.ref(0);
    const usePopup = common_vendor.ref(null);
    const db = common_vendor.Vs.database();
    const dbCmd = db.command;
    const $ = dbCmd.aggregate;
    const currentUser = common_vendor.Vs.getCurrentUserInfo().uid;
    const readNumber = common_vendor.ref(5);
    const shareRef = common_vendor.ref(null);
    const shareInfo = common_vendor.ref(null);
    common_vendor.onReady(() => {
      let useState = common_vendor.index.getStorageSync("useState") || false;
      if (!useState)
        usePopup.value.open();
    });
    common_vendor.index.$on("like", (e) => {
      console.log(e);
      let index = listData.value.findIndex((item) => item._id == e._id);
      listData.value[index] = {
        ...listData.value[index],
        ...e
      };
    });
    const swiperChange = (e) => {
      currentIndex.value = e.detail.current;
      if (listData.value[currentIndex.value] && !listData.value[currentIndex.value].is_read) {
        listData.value[currentIndex.value].is_read = true;
        db.collection("soup-today").where(`user_id==$cloudEnv_uid`).update({
          soup_list: listData.value
        });
      } else {
        console.log("重复操作");
      }
    };
    const clickShare = (index) => {
      shareInfo.value = listData.value[index];
      shareRef.value.handleShow();
    };
    const lineWidth = common_vendor.computed(() => currentIndex.value / listData.value.length * 100);
    const closeUsePopup = () => {
      usePopup.value.close();
      common_vendor.index.setStorageSync("useState", true);
    };
    const clickAdSoup = async () => {
      if (readNumber.value <= 0)
        return utils_common.showToast("今天的鸡汤已经没有了");
      readNumber.value--;
      await db.collection("soup-today").where(`user_id=="${currentUser}"`).update({
        number: readNumber.value
      });
      getSoup("ad");
    };
    const getSoup = async (type = "get") => {
      let { result: { data: todayData = [], errCode = -1 } = {} } = await db.collection("soup-today").where(`user_id==$cloudEnv_uid`).get();
      if (todayData.length && type == "get") {
        if (errCode != 0)
          return utils_common.showToast("信息错误，请重新刷新", "none");
        listData.value = [...listData.value, ...todayData[0].soup_list];
        readNumber.value = todayData[0].number;
      } else {
        let { result: { errCode: errCode2, data } } = await db.collection("soup-chicken").aggregate().lookup({
          from: "soup-user-read",
          let: { soupID: `$_id` },
          pipeline: $.pipeline().match(dbCmd.expr($.eq(["$user_id", currentUser]))).project({ soup_id: 1 }).done(),
          as: "readSoup"
        }).addFields({
          readSoup: $.map({ input: "$readSoup", in: "$$this.soup_id" })
        }).match({ status: 1, is_delete: dbCmd.neq(true) }).match(dbCmd.expr(
          $.cond({
            if: $.eq([type, "random"]),
            then: $.in(["$_id", "$readSoup"]),
            else: $.not($.in(["$_id", "$readSoup"]))
          })
        )).lookup({
          from: "uni-id-users",
          let: { uid: `$user_id` },
          pipeline: $.pipeline().match(dbCmd.expr($.eq([`$_id`, `$$uid`]))).project({ username: 1, avatar: 1 }).done(),
          as: "userInfo"
        }).sample({ size: 5 }).limit(5).project({
          collect_count: 1,
          comment_count: 1,
          content: 1,
          from: 1,
          like_count: 1,
          soup_type: 1,
          view_count: 1,
          userInfo: $.arrayElemAt(["$userInfo", 0])
        }).addFields({}).end();
        if (errCode2 != 0)
          return utils_common.showToast("信息错误，请重新刷新", "none");
        if (data.length == 0)
          return getSoup1("random");
        data[0].is_read = true;
        listData.value = [...listData.value, ...data];
        if (type == "ad") {
          db.collection("soup-today").where(`user_id=="${currentUser}"`).update({
            soup_list: listData.value
          });
        } else {
          db.collection("soup-today").add({ user_id: currentUser, soup_list: data });
        }
        console.log(data);
      }
    };
    getSoup();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !listData.value.length
      }, !listData.value.length ? {
        b: common_vendor.p({
          status: "loading",
          showText: false
        })
      } : {
        c: common_vendor.f(listData.value, (item, index, i0) => {
          return {
            a: "1cf27b2a-2-" + i0,
            b: common_vendor.p({
              type: item.soup_type
            }),
            c: "1cf27b2a-3-" + i0,
            d: common_vendor.p({
              item,
              maxline: "5"
            }),
            e: `/pages/detail/detail?id=${item._id}`,
            f: common_vendor.o(($event) => clickShare(index), index),
            g: "1cf27b2a-4-" + i0,
            h: common_vendor.p({
              item
            }),
            i: index
          };
        }),
        d: common_vendor.o(clickAdSoup),
        e: common_vendor.t(readNumber.value),
        f: common_vendor.o(swiperChange)
      }, {
        g: lineWidth.value + "%",
        h: common_assets._imports_0,
        i: common_vendor.o(closeUsePopup),
        j: common_vendor.sr(usePopup, "1cf27b2a-5", {
          "k": "usePopup"
        }),
        k: common_vendor.o(closeUsePopup),
        l: common_vendor.o(closeUsePopup),
        m: common_vendor.p({
          type: "center"
        }),
        n: common_vendor.sr(shareRef, "1cf27b2a-6", {
          "k": "shareRef"
        }),
        o: common_vendor.p({
          info: shareInfo.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
