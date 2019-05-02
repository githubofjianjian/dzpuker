var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by taojiang on 16/9/29.
 */
var playcards;
(function (playcards) {
    var PlayGoldTreeBtnComp = (function (_super) {
        __extends(PlayGoldTreeBtnComp, _super);
        function PlayGoldTreeBtnComp() {
            var _this = _super.call(this) || this;
            _this.timeDownID = 0;
            return _this;
        }
        PlayGoldTreeBtnComp.prototype.createComplete = function (event) {
            _super.prototype.createComplete.call(this, event);
            this.timeBar.visible = false;
            // this.tipBox.visible = false;
            this.addDragonBones();
        };
        PlayGoldTreeBtnComp.prototype.initData = function () {
            var missions = mission.getProxy().getclvMissionInfos(mission.MissionType.godTree, mission.MissionSubType.god_tree);
            if (missions && missions.length > 0) {
                this.missionInfo = missions[0];
            }
            if (this.missionInfo != null) {
                this.updateMission(this.missionInfo);
            }
            mission.getProxy().getServerList(AppConst.GAME_ID_FREE);
            // this.checkChengzhang();
        };
        PlayGoldTreeBtnComp.prototype.updateMission = function (missionData) {
            this.missionInfo = missionData;
            if (this.timeDownID > 0) {
                egret.clearInterval(this.timeDownID);
                this.timeDownID = 0;
            }
            if (missionData.subtype == mission.MissionSubType.god_tree) {
                if (missionData.status == mission.MissionState.done) {
                    if (missionData.level > 1) {
                        var t = app.SystemTimer.getServerTime() / 1000;
                        var t1 = missionData.time;
                        var td = Math.max(t1 - t, 0);
                        if (td > 0) {
                            this.timeBar.visible = true;
                            this.playDragonBones(false);
                            this.timeDownID = egret.setInterval(this.timeDonwHandler, this, 1000);
                        }
                        else {
                            this.timeBar.visible = false;
                            this.playDragonBones(true);
                            egret.clearInterval(this.timeDownID);
                        }
                        this.updateData(td);
                    }
                    else {
                        this.timeBar.visible = false;
                        this.playDragonBones(true);
                    }
                }
                else if (missionData.status == mission.MissionState.obtaining) {
                    this.timeBar.visible = false;
                    this.playDragonBones(false);
                }
            }
        };
        PlayGoldTreeBtnComp.prototype.timeDonwHandler = function () {
            var t = app.SystemTimer.getServerTime() / 1000;
            var t1 = this.missionInfo.time;
            var td = Math.max(t1 - t, 0);
            if (td <= 0) {
                egret.clearInterval(this.timeDownID);
                this.timeDownID = 0;
                this.playDragonBones(true);
                this.timeBar.visible = false;
            }
            this.updateData(td);
        };
        PlayGoldTreeBtnComp.prototype.addDragonBones = function () {
            var boneFactory = gameabc.addAssetsToBonesFactory(AppReg.APP_MAIL, "yaoqianshu_json", "yaoqianshu_texture_png", "yaoqianshu_texture_json");
            this.goldtreeAnimation = boneFactory.buildFastArmature("MovieClip");
            this.goldtreeAnimation.display.touchEnabled = false;
            this.goldtreeAnimation.display.y = 38;
            this.goldtreeAnimation.display.x = 38;
            dragonBones.WorldClock.clock.add(this.goldtreeAnimation);
            this.addChildAt(this.goldtreeAnimation.display, 0);
            // this.playDragonBones(true);
        };
        PlayGoldTreeBtnComp.prototype.playDragonBones = function (isPlay) {
            if (isPlay)
                this.goldtreeAnimation.animation.play(null, -1);
            else
                this.goldtreeAnimation.animation.gotoAndStop("yaoqianshu");
        };
        PlayGoldTreeBtnComp.prototype.updateData = function (dt) {
            // var str_time:string = DateUtils.formatTime7(dt * 1000,[":",""],true);
            var str_time = DateUtils.dateFormat(dt * 1000, "mm:ss");
            this.txtTime.text = str_time;
        };
        // /**有成长可以领取 */
        // cangetChengzhang: boolean;
        // /**检查是否有成长可领 */
        // checkChengzhang(): void{
        //     this.cangetChengzhang= false;//当前是否可领取
        //     var json = RES.getRes("chengzhang_json");
        //      var myuser = user.getProxy().playInfoVO;
        //     if (json&&myuser) {
        //          var data = json.data;
        //         var totalget: number = 0;//已经获得积分          
        //         for (var i: number = 0, len: number = data.length; i < len; i++){
        //             totalget += Math.min(Number(myuser[data[i].num]),Number(data[i].maxnum))* Number(data[i].mark);
        //         }
        //         var gift = json.gift;//可领奖积分列表 可能不是顺序
        //         var giftItem = json.giftItem;//可领奖物品列表
        //         var getgift:string[] =myuser.rewardrecord;
        //         var max: number = 0;//积分上限
        //         var giftindex: number = gift.length-1;//当前显示
        //         var canget: boolean = false;//当前是否可领取
        //         for (var i: number = 0, len: number = gift.length; i < len; i++){
        //             var g: number = Number(gift[i]);
        //             max = Math.max(g, max);
        //             if (totalget >= g) {
        //                 var nohas: boolean = getgift.indexOf(i+"") == -1;
        //                 if (nohas) {//满足 没领过
        //                     giftindex = i;
        //                     this.cangetChengzhang = true;
        //                     break;
        //                 }
        //             } else if (!canget && i < giftindex) {
        //                 giftindex = i;
        //             }
        //         }
        //     }
        //     if (this.cangetChengzhang) {
        //         if (!this.tipBox.visible) {
        //            this.tipBox.visible = true;
        //            this.tipBox.alpha = 0;
        //            this.tipBox.x = 0;
        //             egret.Tween.removeTweens(this.tipBox);
        //             egret.Tween.get(this.tipBox)
        //             .to({alpha:1,x:-266},300,egret.Ease.sineOut)
        //             .wait(3000)
        //             .set({visible:false});
        //             }
        //     } else {
        //         this.tipBox.visible = false;
        //    }
        // }
        PlayGoldTreeBtnComp.prototype.removeDragonBones = function () {
            dragonBones.WorldClock.clock.remove(this.goldtreeAnimation);
            gameabc.destoryFactory(AppReg.APP_MAIL);
        };
        PlayGoldTreeBtnComp.prototype.dispose = function () {
            this.removeDragonBones();
            _super.prototype.dispose.call(this);
        };
        return PlayGoldTreeBtnComp;
    }(gameabc.UICustomComponent));
    playcards.PlayGoldTreeBtnComp = PlayGoldTreeBtnComp;
    __reflect(PlayGoldTreeBtnComp.prototype, "playcards.PlayGoldTreeBtnComp");
})(playcards || (playcards = {}));
//# sourceMappingURL=PlayGoldTreeBtnComp.js.map