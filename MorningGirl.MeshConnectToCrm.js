if(typeof MorningGirl === "undefined"){
    var MorningGirl = {};
}

// Azure IoTに温度情報を送信するクラス
// コンストラクタ
MorningGirl.AzureIot = function(){
        // MessageValueとプロパティの中身を検証
        this.CheckObjectValues(messageValues);
        this.CheckObjectValues(properties);

　　　　 // IoT Hub Name
        this._iotHubName = this.GetPropertyValue(properties, "_iotHubName");
        // IoT Hub Rest API の Version
        // 2017/05/01 時点では「api-version=2016-02-03」が最新
        this._apiVersion = this.GetPropertyValue(properties, "_apiVersion");

        // IoT Hub に登録しているDevice ID
        this._deviceId = this.GetPropertyValue(properties, "_deviceId");

        // IoT Hub に接続する際に使用するSAS(Shared Access Signatures)
        this._sas = this.GetPropertyValue(properties, "_sas");

        // MESHから受け渡される温度情報 Message Valueから取得
        this._temperature = this.GetMessageValue(messageValues, "temperature");

        // リクエスト用URL
        this._requestUrl = "https://" + this._iotHubName + ".azure-devices.net/devices/" + this._deviceId + "/messages/events?" + this._apiVersion;
}

MorningGirl.AzureIot.prototype = {
    // IoT Hubにメッセージを送信
    SendIotHub : function(){
            // IoT Hubに送信するオブジェクトを作成
            var sendData = { 
                "DeviceId": this._deviceId, 
                "Temperature": this._temperature 
            };

            var requestHeaders = {
                'X-HTTP-Method-Override': 'POST',
                "Authorization" : this._sas,
                "Content-Type" : "application/json"
            };

            // MESH SDK の中で利用できるajaxオブジェクトでPOSTを実施
            ajax(this._requestUrl,
                {
                    type: 'POST',
                    timeout : 5000,
                    headers : requestHeaders,
                    data : sendData,
                    success : this.successFunc,
                    error : this.errorFunc,
                    crossDomain: true,
                }
            );

    },
    // MessageValues から 任意のオブジェクトを取得
    // MessageValues には、各MESHのInputデータが渡ってくる。
    // 温度であれば"temperature"
    // https://meshprj.com/sdk/doc/ja/ にいまいち説明が足りない
    GetMessageValue : function(messageValues, targetObject){
        if(MorningGirl.Util.is(messageValues,"Object"))
            throw "Message Valuesの型がオブジェクトではありません。";

        if(MorningGirl.Util.is(targetObject,MorningGirl.Util.TypeName.String))
            throw "targetObjectの型が文字列ではありません。文字列を指定してください。";

        if(!(targetObject in messageValues))
            throw "messageValues に " + targetObject + " が定義されていません。";

        return messageValues[targetObject];
    },

    // MESH SDKで指定されたpropertiesを取得
    // 基本的にはMessageObjectの取得と変わらないけど、今後の変化を考慮して定義
    GetPropertyValue : function(properties, targetObject){
        if(MorningGirl.Util.is(properties,"Object"))
            throw "propertiesの型がオブジェクトではありません。";

        if(MorningGirl.Util.is(targetObject,MorningGirl.Util.TypeName.String))
            throw "targetObjectの型が文字列ではありません。文字列を指定してください。";

        if(!(targetObject in properties))
            throw "properties に " + targetObject + " が定義されていません。";

        return properties[targetObject];
    },

    // MessageValuesもしくはpropertiesの中身をLogに出力
    CheckObjectValues : function(obj){
        for(key in obj)
        {
            // MESH SDK ではlogメソッドでMESHのLogに流すことが可能。デバッグができないので、基本的にこれで確認するしか無い？
            log("key : " + key + " value : " + obj[key]);
        };
    },

    // Post IoT Hub のSuccess Call Back
    SuccessFunc : function (data, textStatus, jqXHR ) {
        log("Success Message " + textStatus); 
        callbackSuccess( {
            resultType : "continue",
        });
    },

    // Post IoT Hub の Error Call Buck
    ErrorFunc : function (request, errorMessage) {
        log("Error jqxhr " + request.message);
        log("Error text status " + errorMessage);
        callbackSuccess( {
            resultType : "continue",
        });
    }
}

// Utilityクラス
MorningGirl.Util = {
    // Objectの型判定用メソッド
    is : function(type,obj){
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    },

    TypeName : {
        String : "String",
        Number : "Number",
        Boolean : "Boolean",
        Date : "Date",
        Error : "Error",
        Array : "Array",
        Function : "Function",
        RegExp : "RegExp",
        Object : "Object"
    }
}

// 実行部分
try{
    log("Start Azure IoT Connection");
    var IoTHub = new MorningGirl.AzureIot();

    log("MorningGirl.AzureIot コンストラクタ完了");
    var rtnObj = IoTHub.SendIotHub();

    log("End Azure IoT Connection");
}
catch(e)
{
    log("Error が発生しました。Message : " + e);
    return { resultType : "continue" }
}

// ajaxの非同期完了もしくはタイムアウトまで待機するため、返り値にpauseを指定
return { resultType : "pause" }