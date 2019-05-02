module login {

    //返回 1 第方平台登录，返回2 茶苑登录，返回 3 web回放不进游戏 返回0 等待玩家操作登录输入
    export enum LOGIN_ACTION {
        Normal = 0,                 //等待玩家手动输入登录
        QQLogin = 1,                //QQ平台自动登录
        GTlogin = 2,                //茶苑平台自动登录
        WebBackPlay = 3,            //牌局回播不进行游戏
        DJ_AUTO_LOGON = 4           //单机自动登录了
    }

    export class LoginMoudle extends app.base.BaseSceneUIMoudleComponent {
        loginbtn: eui.Button;
        fastregbtn: eui.Button;
        cancelbtn: eui.Button;
        nameTextInput:eui.TextInput;
        passTextInput:eui.TextInput;
        automess:eui.Label;
        loginGroup1: eui.Group;
        loginGroup2: eui.Group;
        loginGroup3: eui.Group;
        // autoLoginGroup: eui.Group;
        loGroup0: eui.Group;
        loGroup1: eui.Group;
        loGroup2: eui.Group;

        loginPanel: eui.Group;
        phoneGroup:eui.Group;

        loginGroup4:eui.Group;

        qqbtn:eui.Image;
        weixinbtn:eui.Image;
        bfidbtn:eui.Image;
        gameteabtn:eui.Image;
        bfgamebtn:eui.Image;
        qqbtn2:eui.Image;
        weixinbtn2: eui.Image;
        // changebtn: eui.Image;
        btnChannelLogin:eui.Image;

        loginType: number;

        private serverlist:eui.List;
        private iptext:eui.Label;
        private loginSelectGroup: eui.Group;

        autoGame:appvos.RoomVO;

        loginTitle: eui.Image;
        autoLoginValue: number;

        animationImage: eui.Group;
        animationLabel: eui.Label;
        animationCount: number = 0;
        timeintervalValue: number = 0;
        testLoginLabel: eui.Label;

        public constructor() {
            super();
            this.skinName = "LoginSkin";
        }

        public createComplete(event:egret.Event):void {
            super.createComplete(event);
            mc2sdk.event(mc2sdk.EVENT_TYPE.ON_LOIGN_STEP_2);
            this.registerMediator(LoginUIMediator);
            this.uiInitConfig();
            app.mvc.AppFacade.getInstance().removeCommand(app.NetAction.SRS_CLOSE);
            if(this.versionCheck()) {
                 this.loginPanelInit();
            }
        }
        
        /**
         * 平台切换账号后重新登录
         */
        reGamelogin():void {
            if(this.versionCheck()) {
                 this.loginPanelInit();
            }
        }

        /**
         * 登录界面准备完成,可以执行登录交互了
         */
        loginPanelInit():void {
            var loginAction:number = this.autoLogin();
                if(loginAction != LOGIN_ACTION.DJ_AUTO_LOGON) {
                    this.channelCheck();
            }
        }

        uiInitConfig():void {
            //渠道登录界面
            this.loginGroup4.visible = false;
            this.addDebugTouch();
            gameabc.UIPreloadManager.UI_ASSETS_NAME = "uiTextureAtlas";
            if (RELEASE) {
                RES.loadGroup("uiTextureAtlas", 0);
            }

            this.serverlist.itemRenderer = login.LoginServerListItem;
            this.serverlist.dataProvider = new eui.ArrayCollection(cy.getChrooseSrsList());
            this.serverlist.selectedIndex = 0;
            this.iptext.text = this.serverlist.selectedItem.label;
            this.serverlist.visible = false;
            this.bindButton(this.iptext);
            this.serverlist.addEventListener(egret.Event.CHANGE, this.onSeverList, this);

            this.bindButton(this.loginbtn);
            this.bindButton(this.fastregbtn);
            this.bindButton(this.cancelbtn);
            this.bindButton(this.qqbtn, false);
            this.bindButton(this.qqbtn2, false);
            this.bindButton(this.weixinbtn, false);
            this.bindButton(this.weixinbtn2, false);
            this.bindButton(this.bfidbtn, false);
            this.bindButton(this.gameteabtn, false);
            this.bindButton(this.bfgamebtn, false);
            // this.bindButton(this.changebtn, false);
            
            this.cacheDate();
            this.checkBoxDate();

            if(this.isNativeDebug()) {
                AppConst.setServer(cy.getChrooseSrsList()[0]);
            }
            else {
                 AppConst.setServer(cy.getChrooseSrsList()[0]);
            }
        }


        /**
         * 游戏进入登录界面之后的处理
         *  返回 1 第方平台登录，返回2 茶苑登录，返回 3 web回放不进游戏 返回0 等待玩家操作登录输入
         */
        autoLogin():number {
            console.log("in to autoLogin")
            /**
             * url传入的参数
             */
            var obj = utils.NativeUtils.getURLObj();
            AppConst.LOGING_CAN_BOOL = false;
           
            /**
             * web回放端，不是游戏登录
             */
            if (obj["videoid"] != null || obj["feedbackid"] != null) {
                this.loginGroup1.visible = false;
                this.loginGroup2.visible = false;
                this.loginGroup3.visible = false;
                this.automess.visible = true;
                this.automess.text = "正在加载牌局数据..";
                if (obj["videoid"] != null) {
                    __SEND_NOTIFICATION(app.NetAction.DZ_RECODE_GETVO, obj["videoid"]);
                } else {
                     __SEND_NOTIFICATION(app.NetAction.DZ_FEEDBACK_GETVO, obj["feedbackid"]);
                } 
                return LOGIN_ACTION.WebBackPlay;
            }

            /**
             * 单机渠道自动登录。。
             */
            if(platform.isDangji()) {
                this.loginPanel.visible = false;
                this.loginGroup4.visible = false;
                this.loginGroup1.visible = false;
                console.log("单机自动注册登录。。。。。。。。");
                if(cy.lastConnectWasError) {
                    this.loginGroup4.visible = true;
                }
                else {
                    this.quickLogin();
                    return LOGIN_ACTION.DJ_AUTO_LOGON;
                }
            }

            /**
             * 第三方平台h5登录
             */
            if(obj.hasOwnProperty("loginType")) {
                var loginType = obj["loginType"];
                if(loginType == "qqloginweb") {
                    var params_str:string = gameabc.StringUtils.formatHttpParams(obj);
                    console.log("h5第三方平台登录" + params_str);
                    tip.popSysTopTip("h5第三方平台登录");
                     __SEND_NOTIFICATION(app.constant.AppMediatorConst.LOGIN_SUCESS_TOHER,obj);
                }
                return LOGIN_ACTION.QQLogin;
            }

            /**
             * 边锋茶苑pc登录
             */
            if (obj["userid"] != null) {
                console.log("url param:" + location.search);
                this.loginGroup1.visible = false;
                this.loginGroup2.visible = false;
                this.loginGroup3.visible = false;
                this.automess.visible = true;
                user.getProxy().loginName = URI.decode(obj["userid"]);
                if (obj["srs"] != null) {
                    this.serverlist.selectedIndex = this.searchSrsInList(obj["srs"]);
                } else {
                    this.serverlist.selectedIndex = 0; //通过URL登录，强制切换到正式环境
                }
                if (obj["pass"] != null) {
                    user.getProxy().loginUserType = user.LOGIN_TYPE.GAMETEA;
                    user.getProxy().loginPass = obj["pass"];
                } else if (obj["sessionid"] != null) {
                    user.getProxy().loginUserType = user.LOGIN_TYPE.SESSION;
                    user.getProxy().loginPass = obj["sessionid"];
                    user.getProxy().svrSession = obj["sessionid"];
                }
                if (obj["hdid"] != null) {
                    user.getProxy().hardwareId = obj["hdid"];
                }
                this.loginEvent(false);
                AppConst.LOGING_CAN_BOOL = true;
                // __SEND_PARAMVO(app.NetAction.GAME_CONFIG, [], [], [__SET_INT64(Number(platform.CHANNE_ID))]);
                return LOGIN_ACTION.GTlogin;
            } 
            else {
                this.dzGameEvent();
            }

            utils.SoundUtils.loadSound();
            // __SEND_PARAMVO(app.NetAction.GAME_CONFIG, [], [], [__SET_INT64(Number(platform.CHANNE_ID))]);
            return LOGIN_ACTION.Normal;
        }

        /**
         * 版本检查
         */
        versionCheck():boolean {
            if(platform.CHANNE_ID == platform.CHANNE_IDS.OLD_CHANNEL.toString()) {
                tip.Alert.show("你的游戏客户端版本比较低,为了你能正常的快乐游戏，建议您去官网下载最新的终端","提示",tip.CONFIRM,(yesOrNo:number,params:any)=>{
                    if(yesOrNo == tip.YES) {
                        platform.updateDownload();
                        this.loginPanelInit();
                         // utils.NativeUtils.nativeCall(utils.NATIVE_CMD.OPEN_URL,"http://www.gametea.com/games/bfdzan.html");
                    }
                    else {
                        this.loginPanelInit();
                    }              
                },null,this)
                return false;
            }
            else {
                return true;
            }         
        }

        /**
         * 各种渠道功能检测处理
         */
        channelCheck() {    
            /**
             * 其它渠道 native 登录 
             */
            if(egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                 if(!platform.isBfdzpkdrChannel()){
                    this.loginPanel.visible = false;
                    this.loginGroup4.visible = false;
                    this.loginGroup1.visible = false;
                    this.bindButton(this.btnChannelLogin);
                    console.log("这里调登录了。。。。。。。。");
                    platform.login();
                } 
            }

            if (platform.isGTChannel()) {
                this.bfgamebtn.removeFromParent(true);
            } 
            else if (platform.isBFChannel()) {
                this.gameteabtn.removeFromParent(true);
            } 
            else if (parseInt(platform.CHANNE_ID) == platform.CHANNE_IDS.H5) {
                
                this.weixinbtn.removeFromParent(true);
                this.bfgamebtn.removeFromParent(true);
                if (!egret.Capabilities.isMobile) {//移动端 pc打开 不显示登陆
                    this.phoneGroup.visible = true;
                    this.loginPanel.visible = false;
                }
            }

            if(platform.isUnitedNotTencent()) {
                this.qqbtn.removeFromParent(true);
                this.weixinbtn.removeFromParent(true);
            }
        }

        loginTypeCheck(): boolean {
            if (!platform.isGTChannel() && !platform.isBFChannel() && parseInt(platform.CHANNE_ID) != platform.CHANNE_IDS.DEBUG) return true;
            if (this.loginType == user.LOGIN_TYPE.PLATMENT) return true;
            if (this.loginType == user.LOGIN_TYPE.PTGAME && platform.isGTChannel()) return true;
            if (this.loginType == user.LOGIN_TYPE.GAMETEA && platform.isBFChannel()) return true;
            return false;
        }

        searchSrsInList(info:string):number {
            var i = this.serverlist.dataProvider.length;
            while (--i > -1) {
                var data:cy.SrsIp = this.serverlist.dataProvider.getItemAt(i);
                if (data.ip.lastIndexOf("." + info) != -1) {
                    return i;
                }
            }
            return i;
        }

        dzGameEvent():void {
        this.automess.visible = false;
        if (this.loginType == null || this.loginTypeCheck()) {
                this.showLoginGroup1();
            } else {
                this.showLoginGroup2();
            }
        }

        private showSrsSelector():boolean {
            return platform.CHANNE_ID == platform.CHANNE_IDS.DEBUG.toString();
        }

        private isNativeDebug():boolean {
            return this.showSrsSelector() && egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        }

        private checkBoxDate():void {
            if (this.showSrsSelector()) {
                //只有渠道号为10000，测试情况下，显示服务器列表
                this.loginSelectGroup.visible = true;
                this.iptext.visible = true;
                this.testLoginLabel.visible = true;
            } else {
                this.loginSelectGroup.visible = false;
                this.iptext.visible = false;
                this.serverlist.visible = false;
                this.testLoginLabel.visible = false;
            }
        }

        cacheDate():void {
            var loginType = gameabc.LocalSO.getItem(AppConst.SETTING_TYPE.GAME_LOGIN_TYPE);
            if (loginType != null) this.loginType = parseInt(loginType);
        }

        getCacheData() {
            this.nameTextInput.text = gameabc.LocalSO.getItem("LOGINNAME" + this.loginType);
            this.passTextInput.text = gameabc.LocalSO.getItem("LOGINNAME_PASS" + this.loginType);
            var selectedIndex = gameabc.LocalSO.getItem("LOGINNAME_INDEX" + this.loginType);
            this.serverlist.selectedIndex = selectedIndex? parseInt(selectedIndex): 0;
            this.iptext.text = this.serverlist.selectedItem.label;
        }

        setCacheDate() {
            if(!this.notCanCacheID$PD) {
                gameabc.LocalSO.setItem(AppConst.SETTING_TYPE.GAME_LOGIN_TYPE, this.loginType);
                gameabc.LocalSO.setItem("LOGINNAME" + this.loginType, user.getProxy().loginName);
                gameabc.LocalSO.setItem("LOGINNAME_PASS" + this.loginType, user.getProxy().loginPass);
                gameabc.LocalSO.setItem("LOGINNAME_INDEX" + this.loginType, this.serverlist.selectedIndex);
            }
            this.notCanCacheID$PD = false;
            user.getProxy().isAutoLogin = false;
        }

        showLoginGroup1() {
            this.loginGroup2.visible = false;
            this.loginGroup3.visible = false;
            this.loginGroup1.visible = true;
        }

        showLoginGroup2() {
            if (this.loginType == user.LOGIN_TYPE.GAMETEA) this.loginTitle.source = "iw_chayuanyonghudenglu_1001_png";
            else if (this.loginType == user.LOGIN_TYPE.PTID) this.loginTitle.source = "iw_bianfengtongxingzheng_login_png";
            else if (this.loginType == user.LOGIN_TYPE.PTGAME) this.loginTitle.source = "iw_bianfengyouxiyonghudenglu_login_png";
            this.getCacheData();
            this.TweenMovement([this.loGroup0, this.loGroup1, this.loGroup2]);
            this.loginGroup1.visible = false;
            this.loginGroup3.visible = false;
            this.loginGroup2.visible = true;
        }

        TweenMovement(btns: any[]) {
            var delay: number = 300
            var i: number = 0;
            for (i = 0; i != btns.length; i++) {
                var ui: eui.UIComponent = <eui.UIComponent>btns[i];
                var originX = ui.x;
                egret.Tween.removeTweens(ui);
                delay -= 200;
                ui.x = ui.parent.width + originX;
                egret.Tween.get(ui)
                    // .set({x: ui.parent.width + originX})
                    .wait(delay)
                    .to({x: originX}, 300, egret.Ease.sineOut);
                delay += 300;
            }
        }

        touchBindButtonHandler(clickTarget:egret.DisplayObject):void {
            switch (clickTarget) {
                case this.loginbtn:
                    if (platform.canLoginByAccount()) {
                        user.getProxy().loginName = this.nameTextInput.text;
                        user.getProxy().loginPass = this.passTextInput.text;
                        if (user.getProxy().loginName == "") {
                            tip.popSysCenterTip("账户不能为空！", tip.TIPS_TYPE.TIPS_WARNING)
                            return;
                        } else if (user.getProxy().loginPass == "") {
                            tip.popSysCenterTip("密码不能为空！", tip.TIPS_TYPE.TIPS_WARNING)
                            return;
                        }
                        this.loginEvent();
                    }
                    else {
                        var errorMsg:string = gameabc.getMessage("NONLICET_CHANNEL");
                        tip.popSysCenterTip(errorMsg, tip.TIPS_TYPE.TIPS_WARNING);
                    }
                    return;
                case this.cancelbtn:
                    this.showLoginGroup1();
                    break;
                case this.btnChannelLogin:
                    this.quickLogin();
                    break;
                case this.fastregbtn:
                    this.quickLogin();
                    break;
                
                case this.iptext:
                    this.serverlist.visible = true;
                    break;
                case this.qqbtn:
                case this.qqbtn2:
                    console.log("sdk login start: qq");
                    // PlatformSdk.setListener(this.onCallback, this);
                    // platform.getFactory().startLogin("QQLogin");
                    platform.getFactory().startLogin(platform.LOGIN_TYPE.QQLogin);
                    break;
                case this.weixinbtn:
                case this.weixinbtn2:
                    console.log("sdk login start: wx");
                    // PlatformSdk.setListener(this.onCallback, this);
                     platform.getFactory().startLogin(platform.LOGIN_TYPE.WXLogin);
                    break;
                case this.bfidbtn:
                    this.loginType = user.LOGIN_TYPE.PTID;
                    this.showLoginGroup2();
                    break;
                case this.bfgamebtn:
                    this.loginType = user.LOGIN_TYPE.PTGAME;
                    this.showLoginGroup2();
                    break;
                case this.gameteabtn:
                    this.loginType = user.LOGIN_TYPE.GAMETEA;
                    this.showLoginGroup2();
                    break;
                // case this.changebtn:
                //     if (this.autoLoginValue) egret.clearTimeout(this.autoLoginValue);
                //     if (this.timeintervalValue) egret.clearInterval(this.timeintervalValue);
                //     // this.autoLoginGroup.visible = false;
                //     user.getProxy().isAutoLogin = false;
                //     break;
                default:
                    tip.popSysCenterTip(gameabc.ResourceBundleUtil.getMessage("FUNCTION_NO_TIPS"))
                    break;
            }
        }

        onSeverList(p?:any):void {
            console.log(this.serverlist.selectedIndex);
            this.iptext.text = this.serverlist.selectedItem.label;
            this.serverlist.visible = false;
        }

        inLogin: boolean = false;
        sid: number = 0;

        /**
         * 是否要以缓存账号和密码,由于第三方平台登录 微信，QQ，AppStore 所以不能在界面中记录玩家的账号信息
         * 第loadingMediato第三方登录是为被标记为 false
         */
        notCanCacheID$PD:boolean = false;

        public loginEvent(checkLoginType: boolean = true):void {
            if (this.inLogin) {
                tip.popSysCenterTip(gameabc.ResourceBundleUtil.getMessage("IN_LOGIN"));
                return;
            }
            this.inLogin = true;
            if (checkLoginType) {
                user.getProxy().loginUserType = this.loginType;
            }

            if(this.isNativeDebug()) {
                AppConst.setServer(this.serverlist.selectedItem);
                room.setServer(this.serverlist.selectedItem.roomType);
            }
            else {
                if (this.showSrsSelector() && this.serverlist.selectedIndex != 0) {
                AppConst.setServer(this.serverlist.selectedItem);
                room.setServer(this.serverlist.selectedItem.roomType);
                // match.setServer(this.serverlist.selectedItem.roomType);
                } else {
                    AppConst.setServer(cy.getSrsIp());
                    room.setServer(room.CONFIG.AUTO_SRS);
                    // match.setServer(room.CONFIG.AUTO_SRS);
                }
            }
            
            cy.connectSrsServer(AppConst.CONNECT_SERVER);
            // this.sid = egret.setTimeout(this.showLoading, this, 300);
            __OPEN_PRELOAD();
            // __SEND_PARAMVO(app.NetAction.GAME_CONFIG, [], [], [__SET_INT64(Number(platform.CHANNE_ID))]);
        }

        // private showLoading():void {
        //     if (this.inLogin) __OPEN_PRELOAD();
        // }

        public loginSuccess():void {
            
            if (!AppGlobal.isLoginFlag) {
                AppGlobal.isLoginFlag = true;
            }
            if(setting.getProxy().gameConfigVOS.length>0){
                mc2sdk.event(mc2sdk.EVENT_TYPE.ON_LOIGN_STEP_3);
                app.mvc.AppFacade.getInstance().registerCommand(app.NetAction.SRS_CLOSE, cy.ConnectCommands);
                this.setCacheDate();

                gameabc.LocalSO.USERID = user.getProxy().svrRoleId.toString();

                if (setting.getProxy().playBool) {
                    setting.getProxy().playBool = false;
                    setting.getProxy().playsetBgSound();
                }

                __CLOSE_PRELOAD();
                // __CLOSE_MOUDLE(AppReg.BF_LOGIN);
                //本地推送
                // LocalNotificationInterface.send("边锋德州", Math.floor(DateUtils.getNearTime(20)/1000),
                //                                 "您今天还没有签到，快去签到吧", LocalNotificationInterface.LOCALNOTI_SIGN);
                LocalNotificationInterface.send("边锋德州", Math.floor((DateUtils.getNearDayTime(3,12)-(new Date()).getTime())/1000),
                                                "您的牌友真焦急的等待着您，快回来看看吧", LocalNotificationInterface.LOCALNOTI_CALLBACK);
                record.getProxy().initDate();
                this.sysConfigInit();

                console.log("登录成功了，看看要不要进入新手引导")

                //进入新手引导
                var GREEN_FLAG = gameabc.LocalSO.getItem("greenFlag");

                if(user.getProxy().playInfoVO == null) {
                    console.log("用户信息是空的")
                } 
                else {
                    console.log("用户第一次进游戏的玩局次数是" + user.getProxy().playInfoVO.totalHand);
                }            

                if(!GREEN_FLAG && user.getProxy().isGreenHandler()) {
                    console.log("可以进入新手引导了");
                }
                else {
                    //console.log(GREEN_FLAG ? "&" + GREEN_FLAG.toString() + "&" : "");
                    console.log(GREEN_FLAG);
                    console.log("不用进了");
                }

                if(egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                    if ((GREEN_FLAG == null || GREEN_FLAG == undefined || GREEN_FLAG == "") && user.getProxy().isGreenHandler()) {
                        gameabc.LocalSO.setItem("greenFlag", true)
                        this.visible = false;
                        __OPEN_PRE_MOUDLE(AppReg.GREEN_HANDLER, {callBack: this.gameRun, thisObj: this})
                    }
                    else {
                        this.gameRun();
                    }
                }
                else {
                    var urlObj = utils.NativeUtils.getURLObj();
                    var roomId = parseInt(urlObj["rid"] ? urlObj["rid"] : 0);
                    //99德州房间不进新手引导
                    var dz_99_roomids:number[] = [15050, 4096, 4098, 4102, 4103, 4104];
                    if ((GREEN_FLAG == null || GREEN_FLAG == undefined || GREEN_FLAG == "") && user.getProxy().isGreenHandler() && dz_99_roomids.indexOf(roomId) == -1) {
                        gameabc.LocalSO.setItem("greenFlag", true)
                        this.visible = false;
                        __OPEN_PRE_MOUDLE(AppReg.GREEN_HANDLER, {callBack: this.gameRun, thisObj: this})
                    } 
                    else {
                        this.gameRun();
                    }
                }
            }
            else {
                //因为需要划分本地读取的信息所以在登录成功之前不能拿配置信息，本地读取需要账号信息做为前缀.
                __SEND_PARAMVO(app.NetAction.GAME_CONFIG, [], [], [__SET_INT64(Number(platform.CHANNE_ID))]);
            } 
        }

        public loginFailed():void {
            __CLOSE_PRELOAD();
            // this.autoLoginGroup.visible = false;
            if (user.getProxy().loginUserType == user.LOGIN_TYPE.SESSION) {
                this.automess.visible = false;
                tip.Alert.show("您的账号已在别处登陆，请重新登陆茶苑大厅", null, tip.ALERT, ()=> {
                    this.loginEvent(false);
                }, null, this)
            }
        }

        private gameRun():void {
            __SEND_NOTIFICATION(app.NetAction.REQ_FILE);
            this.autoGame = null;
            /*** 如果不是茶苑pc渠道*/
            if(!platform.isGTPCChannel())  {
                /**如果是新手则直接进入游戏房间则提示金币房的铵钮*/
                if(user.getProxy().isGreenHandler()) {
                    var silver:number = user.getProxy().svrGameData ? user.getProxy().svrGameData.silver : 0;
                    if(silver <= 1000) {
                        __OPEN_PRE_MOUDLE(AppReg.ROOM, {greenHandler: true});
                    }
                    else {
                        //进入极速游戏
                        room.getProxy().fastRoom();
                    }
                }
                else {
                    __OPEN_PRE_MOUDLE(AppReg.APP_MAIN_UI);
                }

                //Var array = ["roleId","roleName","roleLevel","zoneId","zoneName"];            
                //UserInterface.callFunctionArray(UserInterface.FUNCTION_SUBMIT_DATA,array;
                //有猫腻api

                var user_ary:string[] = [user.getProxy().svrNumId.toString(),user.getProxy().svrName,user.getProxy().svrAreaId.toString(),""];
                UserInterface.callFunctionArray(UserInterface.FUNCTION_SUBMIT_DATA,user_ary);
                
                if(!platform.isBfdzpkdrChannel()) {
                    //显示悬浮球
                    UserInterface.callFunction(UserInterface.FUNCTION_SHOW_TOOLBAR);
                }
                //不往下执行了
                return;
            }
            
            /** * webURL登录的参数*/
            var urlObj = utils.NativeUtils.getURLObj();

            /** * 第三方平台h5登录 */
            if(urlObj.hasOwnProperty("loginType")) {
                var loginType = urlObj["loginType"];
                if(loginType == "qqloginweb") {
                }
            }
            /** pc茶苑渠道和debug渠道以下操作 @type {Object} */
            else {
                var stab = urlObj["stab"];
                var roomId = parseInt(urlObj["rid"]);
                var ofsId = parseInt(urlObj["oid"]);
                // stab = "game"; roomId = 4085; //强制写死，用于测试外网
                // stab = "game"; roomId = 15129; //强制写死，用于测试内网
                // stab = "game"; roomId = 4096; //强制写死，用于测试欢乐城外网
                // stab = "game"; roomId = 15050; //强制写死，用于测试欢乐城内网
                switch (stab) {
                    case "room":
                        __OPEN_PRE_MOUDLE(AppReg.ROOM);
                        break;
                    case "game":
                        mc2sdk.event(mc2sdk.EVENT_TYPE.ON_LOIGN_STEP_2);
                        var roomVO = room.getProxy().getRoomVOByOfsId(ofsId);
                        if (roomVO == null) {
                            roomVO = room.getProxy().getRoomVOByRoomId(roomId);
                        }
                        if (roomVO != null && !roomVO.isVip) {
                            this.autoGame = roomVO;
                            this.sendNotification(app.NetAction.TOOL_RILVER);
                        } else {
                            __OPEN_PRE_MOUDLE(AppReg.APP_MAIN_UI);
                        }
                        break;
                    case "sng":
                        __OPEN_PRE_MOUDLE(AppReg.SNG);
                        break;
                    case "mtt":
                        __OPEN_PRE_MOUDLE(AppReg.MTT);
                        break;
                    case "match":
                        __OPEN_PRE_MOUDLE(AppReg.MATCH_MAIN);
                        break;
                    default :
                        __OPEN_PRE_MOUDLE(AppReg.APP_MAIN_UI);
                }
            }
        }

        public rilverUpdate():void {
            if (user.getProxy().svrGameData == null) {
                this.gotoAutoRoomList();//拿不到玩家数据的情况，进房间列表
                this.autoGame = null;
            } else {
                if (room.getProxy().permit(this.autoGame)) {
                    user.gotoRoom(this.autoGame, AppReg.APP_MAIN_UI);
                    this.autoGame = null;
                } else if (this.autoGame != null) {
                    var tipStr = gameabc.ResourceBundleUtil.getMessage("ROOM_PERMIT", FormatUtils.wan(this.autoGame.minBank));
                    this.gotoAutoRoomList();
                    this.autoGame = null;
                    user.getProxy().notMoneyBank(tipStr);//玩家进游戏没钱 打开钱庄界面
                }
            }
        }

        /**
         * 系统模块初始化
         */
        sysConfigInit():void {
             //与比赛服(列表服)建立连接
            __SEND_NOTIFICATION(app.NetAction.SNG_REQJOIN);
            //防沉迷时间校验
            antiSystem.getProxy().validateAntiInit();
            //开启防沉迷计时器
            __SEND_NOTIFICATION(antiSystem.AntiMediator.ANTI_BEGIN);
            //实名认证
            __SEND_NOTIFICATION(antiSystem.AntiMediator.VERIFICATION_NAME);
            //显示滚屏公告，如果有数据的话
            __SEND_PARAMVO(app.NetAction.GOGO_NOTICE_GET_MANY, [], [], [__SET_INT64(Number(platform.CHANNE_ID))]);
        }

        /**
         * 快速注册登录游戏
         */
        quickLogin():void {
            if (platform.canLoginByAccount()) {
                AppConst.setServer(this.serverlist.selectedItem);
                room.setServer(this.serverlist.selectedItem.roomType);
                // match.setServer(this.serverlist.selectedItem.roomType);
                user.getProxy().quickAccount.generateAccount();
            }
            else {
                var errorMsg:string = gameabc.getMessage("NONLICET_CHANNEL_2");
                tip.popSysCenterTip(errorMsg, tip.TIPS_TYPE.TIPS_WARNING);
            }
        }

        gotoAutoRoomList():void {
            switch (this.autoGame.type) {
                case room.TYPE.HAPPY:
                    __OPEN_PRE_MOUDLE(AppReg.APP_HAPPY_MAIN);
                    return;
                case room.TYPE.NORMAL:
                    __OPEN_PRE_MOUDLE(AppReg.ROOM);
                    return;
                default:
                    __OPEN_PRE_MOUDLE(AppReg.APP_MAIN_UI);
            }
        }

        dispose():void {
            if (this.serverlist) {
                this.serverlist.removeEventListener(egret.Event.CHANGE, this.onSeverList, this);
            }
            if (this.sid > 0) egret.clearTimeout(this.sid);
            this.sid = 0;
            if (this.autoLoginValue) egret.clearTimeout(this.autoLoginValue);
            if (this.timeintervalValue) egret.clearInterval(this.timeintervalValue);
            super.dispose();
        }

        public setMess(str:string):void {
            this.automess.text = str;
        }
    }
}