module playcards {
	/**
	 * 
     * 
     * 牌形结构体
	 * @author 
	 *
	 */
	
    export class CardsResult {
        /** 高牌	 */
        static HIGH: number = 0;
        /** 一对 */
        static ONE_PAIR: number = 1;
        /** 两对	 */
        static TWO_PAIRS: number = 2;
        /** 三条	 */
        static THREE_KIND: number = 3;
        /** 顺子	 */
        static STRAIGHT: number = 4;
        /** 同花	 */
        static FLUSH: number = 5;
        /** 葫芦	 */
        static FULL_HOUSE: number = 6;
        /** 四条	 */
        static FOUR_KIND: number = 7;
        /** 同花顺	 */
        static STRAIGHT_FLUSH: number = 8;
        /** 皇家同花顺	 */
        static ROYAL: number = 9;
    	/**
    	 * 所有牌服务端值
    	 */
    	public allids:number[];
        /**
        * 不重复的牌值
        */
//        public allLogicValues: number[];
    	/**
    	 * 所有牌客户端对象
    	 */
    	public allvos:CardVO[];
    	
//    	/**
//    	 * 所有牌花色数量  [方块，梅花，红桃，黑桃]
//    	 */
//    	public allcolors:number[] = [0,0,0,0];
    	
       /**
        * 牌型
        */
       public type:number;
	   public constructor() {
    	
		}
       public toString():string{
           return this.type + this.allvos.toString();
       }
	}
}
