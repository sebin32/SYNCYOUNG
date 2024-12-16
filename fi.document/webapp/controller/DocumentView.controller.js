sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog"
],
function (Controller,MessageToast, Filter, FilterOperator, ODataModel, JSONModel, ValueHelpDialog) {
    "use strict";

    return Controller.extend("cl3.syncyoung.fi.doc.fi.document.controller.DocumentView", {
        onInit: function () {
            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGW_C302_FI0003_SRV/"),
                self = this;
            oModel.read("/BpcodelistSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공", oData);

                    // 필터링된 데이터를 JSON 모델로 설정
                    var oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
                    self.getView().byId("Bpcode").setModel(oJSONModel, "Bpcode");
                },
                error: function(oError) {
                    console.log("오류 발생", oError);
                }
                
            });
        },
        onSearch: function() {

            let oTable   = this.getView().byId("headerlist"),
                oBinding = oTable.getBinding("rows"),    // rows 정보를 가져옴
                aFilter  = [],                           // aFilter = arrayFilter  -> 2. 이 배열에 넣는다.
                oFilter  = null;                         // oFilter = objectFilter -> 1. oFilter를 통해 WA 형태로 검색 조건을 Making해서


            var vDocno = this.getView().byId("docno").getValue(),
                vBpcode   = this.getView().byId("Bpcode").getValue();

            if (!vDocno && !vBpcode) {
                MessageToast.show("전표 번호 또는 BP Code를 입력하세요");
                exit;
            };
            
            /** 검색조건 Making */
            if (vDocno != '') {

                // 생성자를 이용해서 검색조건을 Making 한다. (중괄호이기 때문에 Work Area로 Making 한다.)
                oFilter = new Filter({
                    path: "Belnr",
                    operator: FilterOperator.EQ,
                    value1: vDocno
                });

                aFilter.push(oFilter); // aFilter에 담아준다.
                oFilter = null;        // oFilter 초기화

            };

            if (vBpcode != '') {

                oFilter = new Filter({
                    path: "Bpcode",
                    operator: FilterOperator.EQ,
                    value1: vBpcode
                });

                aFilter.push(oFilter);
                oFilter = null;
                
            };

            oBinding.filter(aFilter); // Making한 검색 조건들을 Entityset에 날려준다.
        },
        onReset: function() {
            let oTable   = this.getView().byId("headerlist"),
                oBinding = oTable.getBinding("rows"),    // rows 정보를 가져옴
                aFilter  = [],                           // aFilter = arrayFilter  -> 2. 이 배열에 넣는다.
                oFilter  = null;                         // oFilter = objectFilter -> 1. oFilter를 통해 WA 형태로 검색 조건을 Making해서

            this.byId("docno").setValue("");
            this.byId("Bpcode").setValue("");

            var vDocno = this.getView().byId("docno").getValue(),
                vBpcode   = this.getView().byId("Bpcode").getValue();

            /** 검색조건 Making */
            if (vDocno != '') {

                // 생성자를 이용해서 검색조건을 Making 한다. (중괄호이기 때문에 Work Area로 Making 한다.)
                oFilter = new Filter({
                    path: "Belnr",
                    operator: FilterOperator.Contains,
                    value1: vDocno
                });

                aFilter.push(oFilter); // aFilter에 담아준다.
                oFilter = null;        // oFilter 초기화

            };

            if (vBpcode != '') {

                oFilter = new Filter({
                    path: "Bpcode",
                    operator: FilterOperator.EQ,
                    value1: vBpcode
                });

                aFilter.push(oFilter);
                oFilter = null;
                
            };

            oBinding.filter(aFilter); // Making한 검색 조건들을 Entityset에 날려준다.

        }
    });
});
