"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appModule = require("tns-core-modules/application");
var utils = require("tns-core-modules/utils/utils");
var SCANNER_REQUEST_CODE = 444;
var _onScanReceivedCallback = undefined;
var _onContinuousScanResult = undefined;
var BarcodeScanner = (function () {
    function BarcodeScanner() {
        this.broadcastManager = null;
        this.wasCameraPermissionGranted = function () {
            var hasPermission = android.os.Build.VERSION.SDK_INT < 23;
            if (!hasPermission) {
                hasPermission = android.content.pm.PackageManager.PERMISSION_GRANTED ===
                    android.support.v4.content.ContextCompat.checkSelfPermission(utils.ad.getApplicationContext(), android.Manifest.permission.CAMERA);
            }
            return hasPermission;
        };
        this.requestCameraPermissionInternal = function (onPermissionGranted, reject) {
            this.onPermissionGranted = onPermissionGranted;
            this.onPermissionRejected = reject;
            android.support.v4.app.ActivityCompat.requestPermissions(appModule.android.foregroundActivity, [android.Manifest.permission.CAMERA], 234);
        };
        var self = this;
        appModule.android.on(appModule.AndroidApplication.activityRequestPermissionsEvent, function (args) {
            for (var i = 0; i < args.permissions.length; i++) {
                if (args.grantResults[i] === android.content.pm.PackageManager.PERMISSION_DENIED) {
                    if (self.onPermissionRejected) {
                        self.onPermissionRejected("Please allow access to the Camera and try again.");
                    }
                    else {
                        console.log("Please allow access to the Camera and try again. (tip: pass in a reject to receive this message in your app)");
                    }
                    return;
                }
            }
            if (self.onPermissionGranted) {
                self.onPermissionGranted();
            }
        });
    }
    BarcodeScanner.prototype.available = function () {
        return new Promise(function (resolve, reject) {
            try {
                resolve(utils.ad.getApplicationContext().getPackageManager().hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA));
            }
            catch (ex) {
                console.log("Error in barcodescanner.available: " + ex);
                resolve(true);
            }
        });
    };
    BarcodeScanner.prototype.hasCameraPermission = function () {
        var self = this;
        return new Promise(function (resolve) {
            var granted = self.wasCameraPermissionGranted();
            resolve(granted);
        });
    };
    BarcodeScanner.prototype.requestCameraPermission = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            try {
                self.requestCameraPermissionInternal(resolve, reject);
            }
            catch (ex) {
                console.log("Error in barcodescanner.requestCameraPermission: " + ex);
                reject(ex);
            }
        });
    };
    BarcodeScanner.prototype.stop = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!self.broadcastManager) {
                    reject("You found a bug in the plugin, please report that calling stop() failed with this message.");
                    return;
                }
                var stopIntent = new android.content.Intent("barcode-scanner-stop");
                self.broadcastManager.sendBroadcast(stopIntent);
                if (_onScanReceivedCallback) {
                    self.broadcastManager.unregisterReceiver(_onScanReceivedCallback);
                    _onScanReceivedCallback = undefined;
                }
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    BarcodeScanner.prototype.scan = function (arg) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var onPermissionGranted = function () {
                var intent = new android.content.Intent("com.google.zxing.client.android.SCAN");
                intent.setPackage(appModule.android.context.getPackageName());
                arg = arg || {};
                if (arg.message) {
                    intent.putExtra("PROMPT_MESSAGE", arg.message);
                }
                if (arg.preferFrontCamera === true) {
                    intent.putExtra(com.google.zxing.client.android.Intents.Scan.CAMERA_ID, 1);
                }
                if (arg.showFlipCameraButton === true) {
                    intent.putExtra(com.google.zxing.client.android.Intents.Scan.SHOW_FLIP_CAMERA_BUTTON, true);
                }
                if (arg.showTorchButton === true) {
                    intent.putExtra(com.google.zxing.client.android.Intents.Scan.SHOW_TORCH_BUTTON, true);
                }
                if (arg.orientation) {
                    intent.putExtra(com.google.zxing.client.android.Intents.Scan.ORIENTATION_LOCK, arg.orientation);
                }
                if (arg.formats) {
                    intent.putExtra(com.google.zxing.client.android.Intents.Scan.FORMATS, arg.formats);
                }
                if (arg.torchOn === true) {
                    intent.putExtra(com.google.zxing.client.android.Intents.Scan.TORCH_ON, true);
                }
                intent.putExtra(com.google.zxing.client.android.Intents.Scan.BEEP_ON_SCAN, arg.beepOnScan !== false);
                if (arg.resultDisplayDuration !== undefined) {
                    intent.putExtra(com.google.zxing.client.android.Intents.Scan.RESULT_DISPLAY_DURATION_MS, "" + arg.resultDisplayDuration);
                }
                intent.putExtra(com.google.zxing.client.android.Intents.Scan.SAVE_HISTORY, false);
                if (!self.broadcastManager) {
                    self.broadcastManager = android.support.v4.content.LocalBroadcastManager.getInstance(com.tns.NativeScriptApplication.getInstance());
                }
                var isContinuous = typeof arg.continuousScanCallback === "function";
                if (isContinuous) {
                    _onContinuousScanResult = arg.continuousScanCallback;
                    intent.putExtra(com.google.zxing.client.android.Intents.Scan.BULK_SCAN, true);
                    var CallbackReceiver = android.content.BroadcastReceiver.extend({
                        onReceive: function (context, data) {
                            var format = data.getStringExtra(com.google.zxing.client.android.Intents.Scan.RESULT_FORMAT);
                            var text = data.getStringExtra(com.google.zxing.client.android.Intents.Scan.RESULT);
                            if (!this.uniquelyScannedCodes) {
                                this.uniquelyScannedCodes = [];
                            }
                            if (arg.reportDuplicates || this.uniquelyScannedCodes.indexOf("[" + text + "][" + format + "]") === -1) {
                                this.uniquelyScannedCodes.push("[" + text + "][" + format + "]");
                                var result = {
                                    format: format,
                                    text: text
                                };
                                _onContinuousScanResult(result);
                            }
                        }
                    });
                    _onScanReceivedCallback = new CallbackReceiver();
                    self.broadcastManager.registerReceiver(_onScanReceivedCallback, new android.content.IntentFilter("bulk-barcode-result"));
                }
                if (intent.resolveActivity(com.tns.NativeScriptApplication.getInstance().getPackageManager()) !== null) {
                    var onScanResult_1 = function (data) {
                        console.log(">> activity result: @ " + new Date().getTime());
                        if (data.requestCode === SCANNER_REQUEST_CODE) {
                            self.onPermissionGranted = null;
                            if (isContinuous) {
                                if (_onScanReceivedCallback) {
                                    self.broadcastManager.unregisterReceiver(_onScanReceivedCallback);
                                    _onScanReceivedCallback = undefined;
                                }
                            }
                            else {
                                if (data.resultCode === android.app.Activity.RESULT_OK) {
                                    var format = data.intent.getStringExtra(com.google.zxing.client.android.Intents.Scan.RESULT_FORMAT);
                                    var text = data.intent.getStringExtra(com.google.zxing.client.android.Intents.Scan.RESULT);
                                    var result = {
                                        format: format,
                                        text: text
                                    };
                                    resolve(result);
                                }
                                else {
                                    reject("Scan aborted");
                                }
                            }
                            arg.closeCallback && arg.closeCallback();
                            appModule.android.off('activityResult', onScanResult_1);
                        }
                    };
                    appModule.android.on('activityResult', onScanResult_1);
                    appModule.android.foregroundActivity.startActivityForResult(intent, SCANNER_REQUEST_CODE);
                }
                else {
                    reject("Configuration error");
                }
            };
            if (!self.wasCameraPermissionGranted()) {
                self.requestCameraPermissionInternal(onPermissionGranted, reject);
                return;
            }
            onPermissionGranted();
        });
    };
    return BarcodeScanner;
}());
exports.BarcodeScanner = BarcodeScanner;
