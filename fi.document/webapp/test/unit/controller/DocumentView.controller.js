/*global QUnit*/

sap.ui.define([
	"cl3syncyoungfidoc/fi.document/controller/DocumentView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("DocumentView Controller");

	QUnit.test("I should test the DocumentView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
