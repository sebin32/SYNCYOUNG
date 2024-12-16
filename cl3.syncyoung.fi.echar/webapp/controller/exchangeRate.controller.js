sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/base/Log",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller,ODataModel,Log,JSONModel,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("cl3.syncyoung.fi.echar.cl3.syncyoung.fi.echar.controller.exchangeRate", {
        onInit: function () {
            // VizFrame 바인딩 후 필터 적용
            var oVizFrame = this.byId("usdProfit");
            var oVizFrameLoss = this.byId("usdLoss");

            //afterRendering 이벤트도 사용할 수 있지만, 한 번만 실행하고 싶다면 attachEventOnce가 더 적합
            //"환차익에 해당하는 데이터만 컴포넌트 렌더링 후 바인딩"
            oVizFrame.attachEventOnce("renderComplete", function () {
                var oModel = this.getModel();
                oModel.read("/ExrateSet", {
                    filters: [
                        new Filter("waers", FilterOperator.EQ, 'USD'),
                        new Filter("hkont", FilterOperator.NE, "외환 차손")
                    ],
                    success: function(oData) {
                        // JSONModel로 필터링된 데이터 설정
                        var oFilteredModel = new JSONModel({ ExrateSet: oData.results });
                        oVizFrame.setModel(oFilteredModel); // 차트에 새 모델 바인딩
                        
                    },
                    error: function() {
                        console.error("데이터 로드 실패");
                    }
                });
            });

            //"환차손에 해당하는 데이터만 컴포넌트 렌더링 후 바인딩"
            oVizFrameLoss.attachEventOnce("renderComplete", function () {
                var oModel = this.getModel();
                oModel.read("/ExrateSet", {
                    filters: [
                        new Filter("waers", FilterOperator.EQ, 'USD'),
                        new Filter("hkont", FilterOperator.EQ, "외환 차손")
                    ],
                    success: function(oData) {
                        // JSONModel로 필터링된 데이터 설정
                        var oFilteredModel = new JSONModel({ ExrateSet: oData.results });
                        oVizFrameLoss.setModel(oFilteredModel); // 차트에 새 모델 바인딩
            
                    },
                    error: function() {
                        console.error("USD Loss 데이터 로드 실패");
                    }
                });
            });
            
            // Model 추가 
            //국가만 반환하는 모델
            var oModel = new ODataModel("/sap/opu/odata/sap/ZC302FICDS0009_CDS");
            oModel.read("/NationSet", { 
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData.results);
                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 
            //유로 환차손, 환차익 
            var oModelEur = new ODataModel("/sap/opu/odata/sap/ZC302FICDS0010_CDS");
            oModelEur.read("/ExrateSet", { 
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData.results);
                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 
            // 중국 환차손, 환차익 
            var oModelCnh = new ODataModel("/sap/opu/odata/sap/ZC302FICDS0011_CDS");
            oModelCnh.read("/CNHRateSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData.results);
                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 
            // 미국 환차손, 환차익
            var oModelUsd = new ODataModel("/sap/opu/odata/sap/ZC302FICDS0012_CDS");
            oModelUsd.read("/USDRateSet", { 
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData.results);
                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 
            // 일본 환차손, 환차익 
            var oModelJpy = new ODataModel("/sap/opu/odata/sap/ZGW_C302_FI0006_SRV");
            oModelJpy.read("/ExchangeRateSet", 
                {
                success: function(oData) {
                    console.log("데이터읽기 성공 : ", oData.results);
                },
                error: function(oError){
                    console.error("오류 발생: ", oError ) ;
                }
            })
            
            // Model 세팅
            this.getView().setModel(oModel,"NationSet");              // 국가 정보
            this.getView().setModel(oModelJpy, "JPYRateSet");         // 일본
            this.getView().setModel(oModelUsd,"USDRateSet");          // 미국
            this.getView().setModel(oModelCnh, "CNHRateSet");         // 중국
            this.getView().setModel(oModelEur,"EURRateSet");          // 유로




            // vizChart popoverId 띄우기
            var oVizFrameUsdProfit = this.byId("usdProfit"),
                oVizFrameUsdLoss = this.byId("usdLoss"),
                oVizFrameChnProfit = this.byId("chnProfit"),
                oVizFrameChnLoss = this.byId("chnLoss"),
                oVizFrameJpyProfit = this.byId("jpyProfit"),
                oVizFrameJpyLoss = this.byId("jpyLoss"),
                oVizFrameEurProfit = this.byId("eurProfit"),
                oVizFrameEurLoss = this.byId("eurLoss"),
                oPopOverUsdProfit = this.byId("usdProfitPopOver"),
                oPopOverUsdLoss = this.byId("usdLossPopOver"),
                oPopOverChnProfit = this.byId("chnProfitPopOver"),
                oPopOverChnLoss = this.byId('chnLossPopOver'),
                oPopOverJpyProfit = this.byId("jpyProfitPopOver"),
                oPopOverJpyLoss = this.byId('jpyLossPopOver'),
                oPopOverEurProfit = this.byId("eurProfitPopOver"),
                oPopOverEurLoss = this.byId('eurLossPopOver');

            // Popover를 VizFrame에 연결
            oPopOverUsdProfit.connect(oVizFrameUsdProfit.getVizUid());
            oPopOverUsdLoss.connect(oVizFrameUsdLoss.getVizUid());
            oPopOverChnProfit.connect(oVizFrameChnProfit.getVizUid());
            oPopOverChnLoss.connect(oVizFrameChnLoss.getVizUid());
            oPopOverJpyProfit.connect(oVizFrameJpyProfit.getVizUid());
            oPopOverJpyLoss.connect(oVizFrameJpyLoss.getVizUid());
            oPopOverEurProfit.connect(oVizFrameEurProfit.getVizUid());
            oPopOverEurLoss.connect(oVizFrameEurLoss.getVizUid());

        },
        onListItemPress: function (oEvent) {

            // 왼쪽 Master Page 중 어느 아이템이 실행됐는지 저장 'EUR', 'USD', 'CHN', 'JPY'
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
            var oModel = this.getView().getModel();
            var oChart;
            var oChart2;
    
            // 조건문으로 각각의 차트를 설정
            if (sToPageId === 'USD') {
                oChart = this.byId("usdProfit");
                oChart2 = this.byId('usdLoss');
            } else if (sToPageId === 'EUR') {
                oChart = this.byId("eurProfit");
                oChart2 = this.byId('eurLoss');
            } else if (sToPageId === 'CNH') {
                oChart = this.byId("chnProfit");
                oChart2 = this.byId('chnLoss');
            } else if (sToPageId === 'JPY') {
                oChart = this.byId("jpyProfit");
                oChart2 = this.byId('jpyLoss');
            } 
        
            if (oChart && oChart2) {
                // OData 읽기 및 필터링
                oModel.read("/ExrateSet", {
                    filters: [
                        new Filter("waers", FilterOperator.EQ, sToPageId),
                        new Filter("hkont", FilterOperator.NE, "외환 차손")
                    ],
                    success: function(oData) {
                        // JSONModel로 필터링된 데이터 설정
                        var oFilteredModel = new JSONModel({ ExrateSet: oData.results });
                        oChart.setModel(oFilteredModel); // 차트에 새 모델 바인딩
                        // oChart.invalidate();             // 차트 강제 갱신
                    },
                    error: function() {
                        console.error("데이터 로드 실패");
                    }
                });

                oModel.read("/ExrateSet", {
                    filters: [
                        new Filter("waers", FilterOperator.EQ, sToPageId),
                        new Filter("hkont", FilterOperator.EQ, "외환 차손")
                    ],
                    success: function(oData) {
                        // JSONModel로 필터링된 데이터 설정
                        var oFilteredModel = new JSONModel({ ExrateSet: oData.results });
                        oChart2.setModel(oFilteredModel); // 차트에 새 모델 바인딩
                        // oChart2.invalidate();             // 차트 강제 갱신
                    },
                    error: function() {
                        console.error("데이터 로드 실패");
                    }
                });
            }

            // SplitApp으로 페이지 이동
            this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},
        getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		}
    });
});
