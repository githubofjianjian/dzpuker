module appvos {
	export class PMTableVO {
 		gTableId = 1;					//房间ID
  		stockNum = 2;        			//总奖池
  		FreeNum = 3;         			//免费次数
  		totalMoney = 4;					//总筹码
 		infoVO:PMInfoVO = null;       	//牌局信息 有可能没有
		public constructor(data?:any) {
			if(data) {
				var vo:any = AppGlobal.getMessage("PMTableVO").decode(data);
				if(vo) this.setData(vo);
			}
		}

		setData(data?:any):void {
			if(data) {
				this.gTableId = data.gTableId;
				this.stockNum = data.stockNum;
				this.FreeNum = data.FreeNum;
				this.totalMoney = data.totalMoney;
				if(data.infoVO) {
					this.infoVO = new PMInfoVO();
					this.infoVO.setData(data.infoVO);
				}
			}
			else {
				this.clear();
			}
		}

		clear():void {
			this.gTableId = 0;
			this.stockNum = 0;
			this.FreeNum = 0;
			this.totalMoney = 0;
			this.infoVO = null;
		}
	}
}