// NameSpace の定義
var MorningGirl = MorningGirl || {};

// クラスの定義
// Moduleクラス コンストラクター
MorningGirl.Module = MorningGirl.Module || function (firstName, lastName){

    // Moduleクラス プロパティ
    this.FirstName = firstName;
    this.LastName = lastName;
};

// Module クラス 関数
MorningGirl.Module.prototype.GetFullName = function (){
    return this.FirstName + this.LastName;
}

// オブジェクトの生成
var user = new MorningGirl.Module("Kazuya","Sugimoto");

// メソッドへのアクセス
console.log(user.GetFullName());

// プロパティへのアクセス
console.log(user.FirstName);