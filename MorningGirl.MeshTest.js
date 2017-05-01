
function SendIotHub(){
    // Input確認用
    for(key in messageValues)
    {
        // MESH SDK ではlogメソッドでMESHのLogに流すことが可能。デバッグができないので、基本的にこれで確認するしか無い？
        log("key : " + key + " value : " + messageValues[key]);
    };

    // 温度を取得 MessageValueの中に色々含まれてる。SDKにもオブジェクトがどのような形になっているか情報が無いので、上のForで漁るしかない感
    var temperature = messageValues.temperature;

    // Azure IoT Hubの名前
    var iotHubName = "***";

    // Azure IoT Hubに登録しているDevice名
    var deviceId = "***";

    // Azure IoT Hub のREST APIにPOSTするために指定するApiバージョン
    var apiVersion = "api-version=2016-02-03";
    
    var requestUrl = "https://" + iotHubName + ".azure-devices.net/devices/" + deviceId + "/messages/events?" + apiVersion;
    
    // IoT Hubに送信するオブジェクトを作成
    var sendData = { 
        "DeviceId": deviceId, 
        "Temperature":temperature 
    };

    // 事前に作成しておいたSAS
    var sas = "***";
    
    var requestHeaders = {
        'X-HTTP-Method-Override': 'POST',
        "Authorization" : sas,
        "Content-Type" : "application/json"
    };

    // Success Call Buck
    var successFunc = function (data, textStatus, jqXHR ) {
        log("Success Message " + textStatus); 
        callbackSuccess( {
            resultType : "continue",
        });
    };

    // Error Call Buck 用Function
    var errorFunc = function (request, errorMessage)
    {
        log("Error jqxhr " + request.message);
        log("Error text status " + errorMessage);
        callbackSuccess( {
            resultType : "continue",
        });
    };

    // MESH SDK の中で利用できるajaxオブジェクトでPOSTを実施
    ajax(requestUrl,
        {
        type: 'POST',
        timeout : 5000,
        headers : requestHeaders,
        data : sendData,
        success : successFunc,
        error : errorFunc,
        crossDomain: true,
        }
    );

    return { resultType : "pause" }
}

