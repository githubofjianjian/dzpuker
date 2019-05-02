module cy {
    
    
    
    export const enum LOG_TYPE {
        SEND = 1,
        RECV = 2,
        GS_SEND = 4,
        GS_RECV = 8,
        ROOM = 16,
        UNDEFINE = 32,
        ERROR = 64
    }
    
    export var logMaskConfig:number = 0
        | LOG_TYPE.SEND  //所有发送的消息号打印
        | LOG_TYPE.RECV  //所有接收的消息号打印
        | LOG_TYPE.GS_SEND //游戏内发送的消息号打印
        | LOG_TYPE.GS_RECV //游戏内接收的消息号打印
        | LOG_TYPE.ROOM //进出房间关键点打印
        | LOG_TYPE.UNDEFINE //没有完成的开发打印提示
        | LOG_TYPE.ERROR //错误提示
        
    
    export function log(str:string, id:number = 0) {
        // if(DEBUG) {
            var date:Date = new Date();
            var logStr = DateUtils.dateFormat(date,"hh:mm:ss")+" "+str;
            console.log(logStr);
            // if (id & cy.logMaskConfig) console.log(logStr);
            app.debug.log(logStr);    
        // } 
        // else {
        //     if (id & logMaskConfig) console.log(str);
        //     app.debug.log(str);
        // }
    }

    export var unwatch = ["72-6","72-7","2","72-9","73-12","1-11079","1-11200","1-11201"];

    
    export var continuousId:string = "";
    export var continuousCount:number = 1;
    export function recvLog(id:number,pocs:number=0):void {
        
        var xyId = (pocs>0 ? pocs+app.NetAction.PROCESS_CUT : "") + id;
        var notificationId = pocs==11||pocs==12||pocs==72||pocs==73 ? xyId : String(id);
        if (continuousId == xyId) {
            ++continuousCount;
        } else {
            var cuntInfo = continuousCount > 1 ? (continuousId + " x" + continuousCount) : "";
            if (unwatch.indexOf(continuousId)==-1) {
                if (cuntInfo != "") cy.log('recv:' + cuntInfo, cy.LOG_TYPE.RECV);
                if (__HAS_NOTIFICATION(notificationId)) {
                    cy.log('recv:' + xyId, cy.LOG_TYPE.RECV);
                } else {
                    cy.log('recv:' + xyId + " (忽略)", cy.LOG_TYPE.UNDEFINE);
                }
            } 
            continuousId = xyId;
            continuousCount = 1;
        }
    }
    
    export function sendLog(id:number,pocs:number=0):void {
        var logStr = (pocs>0?(pocs+"-"):"") + id;
        if (unwatch.indexOf(logStr)==-1) {
            cy.log('send:' + logStr, cy.LOG_TYPE.SEND);
        }
    }

    export function logHeartChange():void {
        var hearts = cy.srsServer.heartList;
        var len = hearts.length;
        var str = "heart change:"
        for (var i=0; i<len; ++i) {
            var heartVO = hearts[i];
            str += " " + heartVO.xyId + "("+heartVO.appId+")";
        }
        console.log(str);
    }
}

