"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_comment_item2 = common_vendor.resolveComponent("comment-item");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  const _easycom_comment_reply2 = common_vendor.resolveComponent("comment-reply");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_comment_item2 + _easycom_uni_icons2 + _easycom_z_paging2 + _easycom_comment_reply2 + _easycom_uni_popup2)();
}
const _easycom_comment_item = () => "../../components/comment-item/comment-item.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _easycom_comment_reply = () => "../../components/comment-reply/comment-reply.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_comment_item + _easycom_uni_icons + _easycom_z_paging + _easycom_comment_reply + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "reply",
  setup(__props) {
    const currentReply = common_vendor.ref(common_vendor.index.getStorageSync("currentReply") || {});
    const commentPopup = common_vendor.ref(null);
    const paging = common_vendor.ref(null);
    const db = common_vendor.Vs.database();
    const dbCmd = db.command;
    const current_id = common_vendor.Vs.getCurrentUserInfo().uid;
    const $ = dbCmd.aggregate;
    const replyList = common_vendor.ref([]);
    const source = common_vendor.ref({
      soup_id: currentReply.value.soup_id,
      comment_type: 1,
      reply_parent_id: currentReply.value._id,
      reply_user_id: currentReply.value.userInfo._id,
      reply_comment_id: currentReply.value._id,
      reply_user_name: currentReply.value.userInfo.username
    });
    const commentRef = common_vendor.ref(null);
    const clickReply = () => {
      commentPopup.value.open();
      commentRef.value.focuFn();
    };
    common_vendor.index.$on("commentRemove", () => {
      common_vendor.nextTick$1(() => {
        paging.value.refresh();
      });
    });
    const clickComment = (e) => {
      clickReply();
      source.value = {
        ...source.value,
        reply_user_id: e.userInfo._id,
        reply_comment_id: e._id,
        reply_user_name: e.userInfo.username
      };
    };
    common_vendor.onUnload(() => {
      common_vendor.index.removeStorageSync("currentReply");
    });
    const queryList = (pageNo, pageSize) => {
      getReply(pageNo, pageSize);
    };
    const getReply = async (pageNo, pageSize) => {
      let skip = (pageNo - 1) * pageSize;
      let { result: { errCode, data } } = await db.collection("soup-comments").aggregate().match({ soup_id: currentReply.value.soup_id, comment_type: 1, reply_parent_id: currentReply.value._id }).lookup({
        from: "uni-id-users",
        let: {
          uid: "$user_id"
        },
        pipeline: $.pipeline().match(dbCmd.expr($.eq(["$_id", "$$uid"]))).project({
          username: 1,
          avatar: 1
        }).done(),
        as: "userInfo"
      }).lookup({
        from: "soup-comments",
        let: {
          reply_comment_id: "$reply_comment_id",
          reply_parent_id: "$reply_parent_id"
        },
        pipeline: $.pipeline().match(dbCmd.expr(
          $.and([
            $.neq(["$$reply_comment_id", "$$reply_parent_id"]),
            $.eq(["$_id", "$$reply_comment_id"])
          ])
        )).lookup({
          from: "uni-id-users",
          let: {
            uid: "$user_id"
          },
          pipeline: $.pipeline().match(dbCmd.expr($.eq(["$_id", "$$uid"]))).project({
            username: 1
          }).done(),
          as: "userInfo"
        }).project({
          comment_content: $.cond({
            if: $.eq(["$is_delete", true]),
            then: "已被删除",
            else: "$comment_content"
          }),
          userInfo: $.arrayElemAt(["$userInfo", 0])
        }).done(),
        as: "replyInfo"
      }).lookup({
        from: "soup-like",
        let: {
          commentID: "$_id"
        },
        pipeline: $.pipeline().match(
          dbCmd.expr(
            $.and([
              $.eq([currentReply.value.soup_id, "$soup_id"]),
              $.eq(["$$commentID", "$comment_id"]),
              $.eq(["$user_id", current_id])
            ])
          )
        ).count("length").done(),
        as: "likeState"
      }).sort({ comment_date: -1 }).skip(skip).limit(pageSize).project({
        is_delete: 1,
        like_count: 1,
        comment_count: 1,
        comment_type: 1,
        comment_content: $.cond({
          if: $.eq(["$is_delete", true]),
          then: "已被删除",
          else: "$comment_content"
        }),
        soup_id: 1,
        comment_date: 1,
        userInfo: $.arrayElemAt(["$userInfo", 0]),
        replyInfo: $.arrayElemAt(["$replyInfo", 0]),
        isLike: $.cond({
          if: $.gt([$.arrayElemAt(["$likeState.length", 0]), 0]),
          then: true,
          else: false
        })
      }).end();
      paging.value.complete(data);
    };
    const replySuccess = () => {
      utils_common.showToast("发布成功");
      commentPopup.value.close();
      paging.value.refresh();
      source.value = {
        ...source.value,
        reply_user_id: currentReply.value.userInfo._id,
        reply_comment_id: currentReply.value._id,
        reply_user_name: currentReply.value.userInfo.username
      };
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          item: currentReply.value,
          toplevel: true
        }),
        b: common_vendor.f(replyList.value, (item, k0, i0) => {
          return {
            a: common_vendor.o(clickComment, item._id),
            b: "4009e719-2-" + i0 + ",4009e719-0",
            c: common_vendor.p({
              item,
              reply: true
            }),
            d: item._id
          };
        }),
        c: common_vendor.p({
          type: "paperplane",
          size: "26",
          color: "#333"
        }),
        d: common_vendor.o(clickReply),
        e: common_vendor.sr(paging, "4009e719-0", {
          "k": "paging"
        }),
        f: common_vendor.o(queryList),
        g: common_vendor.o(($event) => replyList.value = $event),
        h: common_vendor.p({
          ["empty-view-text"]: "抢先回复",
          ["empty-view-img"]: "http://cdn.uviewui.com/uview/empty/comment.png",
          modelValue: replyList.value
        }),
        i: common_vendor.sr(commentRef, "4009e719-5,4009e719-4", {
          "k": "commentRef"
        }),
        j: common_vendor.o(replySuccess),
        k: common_vendor.p({
          source: source.value
        }),
        l: common_vendor.sr(commentPopup, "4009e719-4", {
          "k": "commentPopup"
        }),
        m: common_vendor.p({
          type: "bottom"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4009e719"]]);
wx.createPage(MiniProgramPage);
