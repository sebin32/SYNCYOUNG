/*global QUnit*/

sap.ui.define([
	"cl3syncyoungfiechar/cl3.syncyoung.fi.echar/controller/exchangeRate.controller"
], function (Controller) {
	"use strict";

	QUnit.module("exchangeRate Controller");

	QUnit.test("I should test the exchangeRate controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
