/**
 * Created by taojiang on 16/4/25.
 */

/**
 * 弹出窗口从scale:0到scale1的动画弹出
 */
module gameabc {

    export class ScaleTo1UIModule extends UIMoudle {
        constructor() {super()}
        private tween:egret.Tween;
        
        openSlowAction():void {
            if(this.gui && this.gui.parent != null) {
                this.gui.scaleX = this.gui.scaleY = 0.5;
                egret.Tween.removeTweens(this.gui);
                this.tween = egret.Tween.get(this.gui);
                this.tween.to({scaleX:1,scaleY:1},300,egret.Ease.backOut);
            }
        }
        
        close():void {
            if(this.gui) {
                egret.Tween.removeTweens(this.gui);
            }
            super.close();
        }

        dispose():void {
            super.dispose();
        }

    }
}