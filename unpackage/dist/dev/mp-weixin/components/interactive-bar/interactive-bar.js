"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "interactive-bar",
  props: {
    type: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  emits: ["comment", "share"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const newItem = common_vendor.ref(props.item);
    const emit = __emit;
    const current_id = common_vendor.Vs.getCurrentUserInfo().uid;
    const db = common_vendor.Vs.database();
    common_vendor.watch(() => props.item, (nv) => {
      newItem.value = nv;
    }, {
      deep: true,
      immediate: true
    });
    const clickLike = common_vendor.debounce(clickLikeFn, 1e3, { "leading": true, "trailing": false });
    async function clickLikeFn() {
      if (newItem.value.isLike) {
        newItem.value.like_count--;
        db.collection("soup-like").where({ soup_id: newItem.value._id, user_id: current_id, like_type: 0 }).remove();
      } else {
        newItem.value.like_count++;
        db.collection("soup-like").add({
          soup_id: newItem.value._id,
          like_type: 0
        });
      }
      newItem.value.isLike = !newItem.value.isLike;
      common_vendor.index.$emit("like", { _id: newItem.value._id, isLike: newItem.value.isLike, like_count: newItem.value.like_count });
    }
    const clickCollect = async () => {
      console.log(newItem.value);
      console.log("收藏");
      if (newItem.value.isCollection) {
        await db.collection("soup-collection").where({ soup_id: newItem.value._id, user_id: current_id, collection_type: 0 }).remove();
        newItem.value.isCollection = !newItem.value.isCollection;
      } else {
        await db.collection("soup-collection").add({
          soup_id: newItem.value._id,
          collection_type: 0
        });
        newItem.value.isCollection = !newItem.value.isCollection;
      }
    };
    const clickShare = () => {
      emit("share");
    };
    const clickCommentBtn = () => {
      console.log("交互子组件");
      emit("comment");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.type == 0
      }, __props.type == 0 ? {
        b: common_vendor.p({
          type: "redo",
          size: "28",
          color: "#999"
        }),
        c: common_vendor.o(clickShare)
      } : {}, {
        d: __props.type == 1
      }, __props.type == 1 ? {
        e: common_vendor.o(clickCommentBtn)
      } : {}, {
        f: !newItem.value.isLike
      }, !newItem.value.isLike ? {
        g: common_vendor.p({
          type: "heart",
          size: "28",
          color: "#999"
        })
      } : {
        h: common_vendor.p({
          type: "heart-filled",
          size: "28",
          color: "#dd524d"
        })
      }, {
        i: newItem.value.like_count
      }, newItem.value.like_count ? {
        j: common_vendor.t(newItem.value.like_count),
        k: newItem.value.isLike ? "#dd524d" : "#999"
      } : {}, {
        l: common_vendor.o((...args) => common_vendor.unref(clickLike) && common_vendor.unref(clickLike)(...args)),
        m: !newItem.value.isCollection && __props.type == 1
      }, !newItem.value.isCollection && __props.type == 1 ? {
        n: common_vendor.p({
          type: "star",
          size: "28",
          color: "#999"
        })
      } : {}, {
        o: newItem.value.isCollection && __props.type == 1
      }, newItem.value.isCollection && __props.type == 1 ? {
        p: common_vendor.p({
          type: "star-filled",
          size: "28",
          color: "#f0ad4e"
        })
      } : {}, {
        q: common_vendor.o(clickCollect),
        r: __props.type == 1
      }, __props.type == 1 ? common_vendor.e({
        s: common_vendor.p({
          type: "chatbubble",
          size: "28",
          color: "#999"
        }),
        t: newItem.value.comment_count
      }, newItem.value.comment_count ? {
        v: newItem.value.comment_count == 1 ? "#dd524d" : "#999"
      } : {}, {
        w: common_vendor.o(clickCommentBtn)
      }) : {}, {
        x: __props.type == 1
      }, __props.type == 1 ? {
        y: common_vendor.p({
          type: "redo",
          size: "28",
          color: "#999"
        }),
        z: common_vendor.o(clickShare)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6271c529"]]);
wx.createComponent(Component);
