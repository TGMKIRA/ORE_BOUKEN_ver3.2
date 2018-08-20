//=============================================================================
// MPP_MiniMap.js
//=============================================================================
// Copyright (c) 2018 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.2.16】ミニマップを画面に表示させます。
 * @author 木星ペンギン
 * @help プラグインコマンド:
 *   MiniMap x y w h type op zoom  # ミニマップの表示
 *   HideMiniMap                # ミニマップの非表示
 *   ShowMiniMap                # ミニマップの非表示を解除
 *   ChangeMinimap mapId        # 指定したマップIDのミニマップに変更
 *   SetMinimapFrame name       # ミニマップの上にフレーム画像を表示
 *   ClearMinimapFrame          # フレーム画像を消去する
 *   SetMinimapZoom zoom        # ミニマップの拡大率のみ変更
 *   
 *   MarkingCirEve n mapId evId r c   # イベントを中心に円形のマーキングを表示
 *   MarkingCirPos n mapId x y r c    # 座標を中心に円形のマーキングを表示
 *   MarkingRecPos n mapId x y w h c  # 四角形のマーキングを表示
 *   MarkingIcoEve n mapId evId m     # イベントの位置にマーカーアイコンを表示
 *   MarkingIcoPos n mapId x y m      # 座標(x,y)にマーカーアイコンを表示
 *   DeleteMarking n            # マーキング番号 n を削除
 * 
 *   SetMinimapScroll type n    # スクロールタイプとパラメータの設定
 *   StartMinimapScroll x y     # ミニマップを座標(x,y)までスクロール
 *   ResetMinimapScroll         # ミニマップをプレイヤーの座標までスクロール
 *   
 * マップのメモ:
 *   <Minimap:name>             # このマップのミニマップ画像のファイル名
 *   <MinimapZoom:n>            # このマップのミニマップ拡大率
 * 
 * イベントのメモ:
 *   <Marker:n>                 # このイベントのマーカーアイコン番号
 * 
 * ================================================================
 * ▼ プラグインコマンド 詳細
 * --------------------------------
 *  〇 プラグインコマンド全般
 *   指定する値には変数が使用できます。
 *   v[n] と記述することでn番の変数の値を参照します。
 * 
 * --------------------------------
 *  〇 MiniMap x y w h type op zoom
 *       x,y,w,h : 表示する座標(x,y)とサイズ(幅,高さ)
 *       type    : 表示タイプ (0:全体, 1:周辺)
 *       op      : 不透明度 (0 - 255)
 *       zoom    : 拡大率(1.0で等倍 / 周辺ﾀｲﾌﾟのみ / 未設定の場合は1.0)
 *   
 *   ミニマップの表示位置や表示内容を変更します。
 * 
 * --------------------------------
 *  〇 ChangeMinimap mapId
 *       mapId : 表示するマップID
 *   
 *   ミニマップを指定したマップのものに切り替えます。
 *   
 *   現在のマップとは違うマップを表示した場合、マーキングは表示されますが、
 *   イベントのマーカーアイコンは表示されません。
 *   乗り物のマーカーアイコンは表示されます。
 * 
 * --------------------------------
 *  〇 SetMinimapFrame name
 *       name : フレーム画像のファイル名
 *   
 *   ミニマップの上に画像を重ねて表示する機能です。
 *   ミニマップのサイズに合わせてサイズを変更する機能はありません。
 *   使用する画像は img/pictures フォルダ内に入れてください。
 *  
 *   ここで使用する画像はプラグインパラメータ[Frame Images]に
 *   設定してください。
 *   設定していない画像は、デプロイメントの「未使用ファイルを含まない」を
 *   使用した場合に削除されます。
 * 
 * --------------------------------
 *  〇 MarkingCirEve n mapId evId r c
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       evId  : イベントID
 *       r     : 半径 (タイル)
 *       c     : 色番号
 *   
 *   指定したイベントを中心とした円形のマーキングをミニマップ上に表示します。
 *   
 *   ※ マーキング番号
 *    マーキング番号は任意の数値を指定してください。
 *    ピクチャの番号と同じで、同じ番号を使うと上書きされます。
 *   
 *   ※ 色番号
 *    色番号はプラグインパラメータ[Marking Colors]で設定した色の番号を
 *    指定してください。
 *   
 * --------------------------------
 *  〇 MarkingCirPos n mapId x y r c
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       x,y   : 中心となる座標(x,y)
 *       r     : 半径 (タイル)
 *       c     : 色番号
 *  
 *   指定した座標(x,y)を中心とした円形のマーキングをミニマップ上に表示します。
 *   
 *   マーキング番号・色番号については同上。
 *  
 * --------------------------------
 *  〇 MarkingRecPos n mapId x y w h c
 *       n       : マーキング番号 (任意の数値)
 *       mapId   : マーキングするマップID (0で現在のマップ)
 *       x,y,w,h : 表示する座標(x,y)とサイズ(幅,高さ)
 *       c       : 色番号
 *  
 *   指定した四角形(x,y,w,h)のマーキングをミニマップ上に表示します。
 *   
 *   マーキング番号・色番号については同上。
 *  
 * --------------------------------
 *  〇 MarkingIcoEve n mapId evId m
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       evId  : イベントID
 *       m     : マーカーアイコン番号
 *  
 *   ミニマップ上の指定したイベントの位置にマーカーアイコンを表示します。
 *   
 *   マーキング番号については同上。
 *   
 *   マーカーアイコン番号については後述。
 *   
 * --------------------------------
 *  〇 MarkingIcoPos n mapId x y m
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       x,y   : 表示する座標(x,y)
 *       m     : マーカーアイコン番号
 *  
 *   ミニマップ上の指定した座標(x,y)にマーカーアイコンを表示します。
 *   
 *   マーキング番号については同上。
 *   
 *   マーカーアイコン番号については後述。
 *   
 * --------------------------------
 *  〇 MarkingIcoPos n mapId x y m
 *       n     : マーキング番号 (任意の数値)
 *       mapId : マーキングするマップID (0で現在のマップ)
 *       x,y   : 表示する座標(x,y)
 *       m     : マーカーアイコン番号
 *  
 *   ミニマップ上の指定した座標(x,y)にマーカーアイコンを表示します。
 *   
 *   マーキング番号については同上。
 *   
 *   マーカーアイコン番号については後述。
 *   
 * --------------------------------
 *  〇 SetMinimapScroll type n
 *       type  : スクロールタイプ
 *       n     : パラメータ
 *  
 *   ミニマップのスクロールタイプとパラメータを設定します。
 *   
 *   各スクロールタイプ(type)とパラメータの説明
 *    0 : 等速移動。nで移動速度を指定。
 *    1 : 等速移動。nで移動にかかるフレーム数を指定。
 *    2 : 減速移動。nで移動にかかるフレーム数を指定。
 *    3 : 加減速移動。nで移動にかかるフレーム数を指定。
 *   
 * ================================================================
 * ▼ マップのメモ 詳細
 * --------------------------------
 *  〇 <Minimap:name>
 *   このマップのミニマップ画像を指定したファイル名の画像にします。
 *   未設定の場合は自動生成されます。
 *   
 *   ミニマップ画像は img/system フォルダ内に入れてください。
 * 
 * ================================================================
 * ▼ イベントのメモ 詳細
 * --------------------------------
 *  〇 <Marker:n>
 *   このイベントの位置にマーカーアイコンを表示します。
 *   nでマーカーアイコン番号を指定します。
 *   
 *   マーカーアイコン番号については後述。
 *   
 *   このマーカーアイコンは以下の条件のうちどれか一つでも満たしている場合
 *   表示されません。
 *    ・イベントの[出現条件]が満たされていない場合
 *    ・[イベントの一時消去]によって消去されている場合
 *    ・透明化がONになっている場合
 * 
 * ================================================================
 * ▼ プラグインパラメータ 詳細
 * --------------------------------
 *  〇 Map IDs (ミニマップを表示するマップIDの配列) /
 *     Wall Region IDs (通行不可として表示するリージョンIDの配列) /
 *     Floor Region IDs (通行可能として表示するリージョンIDの配列)
 *  
 *   n-m と表記することで、nからmまでの数値を指定できます。
 *   (例 : 1-4,8,10-12 => 1,2,3,4,8,10,11,12)
 * 
 * --------------------------------
 *  〇 Minimap Z (ミニマップのZ座標)
 *  
 *   0 : キャラクターや天候、画面の色調変更より上、ピクチャより下
 *   1 : ピクチャより上、タイマーより下
 *   2 : タイマーより上、画面暗転より下
 *   3 : 画面のフラッシュより上
 *   4 : 全スプライトより上
 * 
 * --------------------------------
 *  〇 Plugin Commands (プラグインコマンド名)
 * 
 *   プラグインコマンド名を変更できます。
 *   コマンドを短くしたり日本語化等が可能です。
 *   
 *   コマンド名を変更しても、デフォルトのコマンドは使用できます。
 * 
 * ================================================================
 * ▼ その他
 * --------------------------------
 *  〇 マーカーアイコン
 *   マーカーアイコンを表示するにはマーカーアイコン画像が必要です。
 *   MinimapMarkerSet という画像ファイルを img/system フォルダ内に
 *   入れてください。
 *   
 *   マーカーアイコン画像は横方向に8個並べたものを1ブロックとし、
 *   そのブロックを必要なだけ縦に長くしたものです。
 *   画像の幅を8で割ったものが、マーカーアイコン1個の幅と高さになります。
 *   
 *   サンプル画像(フリー素材)はダウンロードページにあります。
 *   
 *   マーカーアイコン番号は通常のアイコンと同じで、
 *   一番左上を0とし右に向かって 1,2,3... となります。
 * 
 * --------------------------------
 *  〇 イベントコマンド[タイルセットの変更]
 *   本プラグインはイベントコマンドの[タイルセットの変更]には対応していません。
 *   マップ画像はシーン切り替え時に生成され、途中で変更されることはありません。
 *  
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param === Basic ===
 * @default 【基本的な設定】
 * 
 * @param Map IDs
 * @desc ミニマップを表示するマップIDの配列
 * (範囲指定可)
 * @default 1-5
 * @parent === Basic ===
 *
 * @param Default Visible
 * @type boolean
 * @desc ミニマップ表示/非表示の初期値
 * (true:表示, false:非表示)
 * @default true
 * @parent === Basic ===
 *
 * @param Default Data
 * @desc ミニマップ表示位置の初期値
 * (X座標,Y座標,幅,高さ,タイプ,不透明度,拡大率)
 * @default 32,32,160,128,1,192,1.0
 * @parent === Basic ===
 *
 * @param Minimap Z
 * @type number
 * @max 4
 * @desc ミニマップのZ座標(詳細はヘルプ参照)
 * @default 0
 * @parent === Basic ===
 *
 * @param Frame Images
 * @type file[]
 * @desc フレーム画像(未使用ファイル削除ツールへの対処)
 * @default []
 * @require 1
 * @dir img/pictures
 * @parent === Basic ===
 *
 *
 * @param === Advanced ===
 * @default 【細かな設定】
 *
 * @param Update Count
 * @type number
 * @desc 更新頻度
 * @default 80
 * @parent === Advanced ===
 *
 * @param Blink Duration
 * @type number
 * @desc 点滅時間
 * (0で点滅なし)
 * @default 80
 * @parent === Advanced ===
 *
 * @param Hide Next Scene?
 * @type boolean
 * @desc メニュー画面や戦闘画面に移行する際にミニマップを消すかどうか
 * @default true
 * @parent === Advanced ===
 *
 * @param Default Scroll Data
 * @desc スクロールタイプとパラメータのデフォルト値
 * @default 1,16
 * @parent === Advanced ===
 *
 * @param Scroll Map Link?
 * @type boolean
 * @desc [マップのスクロール]を実行した際、ミニマップもスクロールさせるかどうか（OP2には未対応）
 * @default false
 * @parent === Advanced ===
 *
 *
 * @param === Marker ===
 * @default 【マーカーアイコン】
 * 
 * @param Player Marker
 * @type number
 * @desc プレイヤーのマーカーアイコン番号
 * @default 1
 * @parent === Marker ===
 *
 * @param Player OY
 * @desc プレイヤー画像のY軸の原点位置
 * @default 0.5
 * @parent === Marker ===
 *
 * @param Turn Player?
 * @type boolean
 * @desc プレイヤーの向きに合わせて画像を回転させるかどうか
 * @default false
 * @parent === Marker ===
 *
 * @param Vehicle On Marker
 * @type number
 * @desc 乗り物搭乗時のマーカーアイコン番号
 * @default 7
 * @parent === Marker ===
 *
 * @param Vehicle On OY
 * @desc 乗り物画像のY軸の原点位置
 * @default 0.5
 * @parent === Marker ===
 *
 * @param Turn Vehicle?
 * @type boolean
 * @desc 乗り物搭乗時の向きに合わせて画像を回転させるかどうか
 * @default true
 * @parent === Marker ===
 *
 * @param Vehicle Off Markers
 * @desc 非搭乗時の乗り物のマーカーアイコン番号
 * (タイプ:番号 で指定)
 * @default boat:2,ship:2,airship:2
 * @parent === Marker ===
 *
 *
 * @param === Marking ===
 * @default 【マーキング】
 * 
 * @param Marking Colors
 * @type string[]
 * @desc マーキングの色番号の配列
 * @default ["255,255,255,1.0","32,160,214,1.0","32,160,214,1.0","255,120,76,1.0","102,204,64,1.0","153,204,255,1.0","204,192,255,1.0","255,255,160,1.0","128,128,128,1.0"]
 * @parent === Marking ===
 *
 *
 * @param === Auto Generate ===
 * @default 【マップの自動生成】
 * 
 * @param Tile Size
 * @type number
 * @desc 1タイルの大きさ
 * @default 4
 * @parent === Auto Generate ===
 *
 * @param Blur Intensity
 * @type number
 * @desc ぼかし処理の強さ
 * @default 2
 * @parent === Auto Generate ===
 *
 *
 * @param ▽ Field Type ▽
 * @default 【モード:フィールドタイプ】
 * @parent === Auto Generate ===
 * 
 * @param Land Color
 * @desc 陸地の色
 * @default 192,192,192,1.0
 * @parent ▽ Field Type ▽
 *
 * @param Sea Color
 * @desc 深海の色
 * @default 0,0,0,0.5
 * @parent ▽ Field Type ▽
 *
 * @param Ford Color
 * @desc 浅瀬・沼の色
 * @default 64,64,64,0.75
 * @parent ▽ Field Type ▽
 *
 * @param Mountain Color
 * @desc 山の色
 * @default 96,96,96,1.0
 * @parent ▽ Field Type ▽
 *
 * @param Hill Color
 * @desc 丘の色
 * @default 128,128,128,1.0
 * @parent ▽ Field Type ▽
 *
 * @param Forest Color
 * @desc 森の色
 * @default 160,160,160,1.0
 * @parent ▽ Field Type ▽
 *
 *
 * @param ▽ Area Type ▽
 * @default 【モード:エリアタイプ】
 * @parent === Auto Generate ===
 * 
 * @param River Color
 * @desc 水辺（通行不可）の色
 * @default 128,128,128,0.5
 * @parent ▽ Area Type ▽
 *
 * @param Shallow Color
 * @desc 水辺（通行可能）の色
 * @default 160,160,160,0.75
 * @parent ▽ Area Type ▽
 *
 * @param Ladder Color
 * @desc 梯子の色
 * @default 160,160,160,1.0
 * @parent ▽ Area Type ▽
 *
 * @param Bush Color
 * @desc 茂みの色
 * @default 192,192,192,1.0
 * @parent ▽ Area Type ▽
 *
 * @param Counter Color
 * @desc カウンターの色
 * @default 160,160,160,0.5
 * @parent ▽ Area Type ▽
 *
 * @param Wall Color
 * @desc 通行不可タイルの色
 * @default 64,64,64,0.25
 * @parent ▽ Area Type ▽
 *
 * @param Floor Color
 * @desc 通行可能タイルの色
 * @default 224,224,224,1.0
 * @parent ▽ Area Type ▽
 *
 * @param Wall Region IDs
 * @desc 通行不可として表示するリージョンIDの配列
 * (範囲指定可)
 * @default 63
 * @parent ▽ Area Type ▽
 *
 * @param Floor Region IDs
 * @desc 通行可能として表示するリージョンIDの配列
 * (範囲指定可)
 * @default 
 * @parent ▽ Area Type ▽
 *
 * @param Dir4 Wall Width
 * @type number
 * @desc 通行(4方向)の壁の幅
 * @default 2
 * @parent ▽ Area Type ▽
 *
 *
 * @param === Command ===
 * @default 【コマンド関連】
 * 
 * @param Plugin Commands
 * @type struct<Plugin>
 * @desc プラグインコマンド名
 * @default {"MiniMap":"MiniMap","HideMiniMap":"HideMiniMap","ShowMiniMap":"ShowMiniMap","ChangeMinimap":"ChangeMinimap","SetMinimapFrame":"SetMinimapFrame","ClearMinimapFrame":"ClearMinimapFrame","SetMinimapZoom":"SetMinimapZoom","MarkingCirEve":"MarkingCirEve","MarkingCirPos":"MarkingCirPos","MarkingRecPos":"MarkingRecPos","MarkingIcoEve":"MarkingIcoEve","MarkingIcoPos":"MarkingIcoPos","DeleteMarking":"DeleteMarking","SetMinimapScroll":"SetMinimapScroll","StartMinimapScroll":"StartMinimapScroll","ResetMinimapScroll":"ResetMinimapScroll"}
 * @parent === Command ===
 * 
 * @param Map Metadata
 * @type struct<MapMeta>
 * @desc マップメモ欄のデータ名
 * @default {"MiniMap":"MiniMap","MinimapZoom":"MinimapZoom"}
 * @parent === Command ===
 * 
 * @param Event Metadata
 * @type struct<EventMeta>
 * @desc イベントメモ欄のデータ名
 * @default {"Marker":"Marker"}
 * @parent === Command ===
 * 
 * 
 * @requiredAssets img/system/MinimapMarkerSet
 * 
 * @noteParam Minimap
 * @noteRequire 1
 * @noteDir img/system/
 * @noteType file
 * @noteData maps
 * 
 */

/*~struct~Vehicle:
 * @param boat
 * @type number
 * @desc 小型船
 * @default 2
 *
 * @param ship
 * @type number
 * @desc 大型船
 * @default 2
 *
 * @param airship
 * @type number
 * @desc 飛行船
 * @default 2
 *
 */

/*~struct~Plugin:
 * @param MiniMap
 * @desc ミニマップの表示
 * @default MiniMap
 *
 * @param HideMiniMap
 * @desc ミニマップの表示
 * @default HideMiniMap
 *
 * @param ShowMiniMap
 * @desc ミニマップの非表示を解除
 * @default ShowMiniMap
 *
 * @param ChangeMinimap
 * @desc 指定したマップIDのミニマップに変更
 * @default ChangeMinimap
 *
 * @param SetMinimapFrame
 * @desc ミニマップの上にフレーム画像を表示する
 * @default SetMinimapFrame
 *
 * @param ClearMinimapFrame
 * @desc フレーム画像を消去する
 * @default ClearMinimapFrame
 *
 * @param SetMinimapZoom
 * @desc ミニマップの拡大率のみ変更
 * @default SetMinimapZoom
 *
 *
 * @param MarkingCirEve
 * @desc イベントを中心に円形のマーキングを表示
 * @default MarkingCirEve
 *
 * @param MarkingCirPos
 * @desc 座標を中心に円形のマーキングを表示
 * @default MarkingCirPos
 *
 * @param MarkingRecPos
 * @desc 四角形のマーキングを表示
 * @default MarkingRecPos
 *
 * @param MarkingIcoEve
 * @desc イベントの位置にマーカーアイコンを表示
 * @default MarkingIcoEve
 *
 * @param MarkingIcoPos
 * @desc 座標(x,y)にマーカーアイコンを表示
 * @default MarkingIcoPos
 *
 * @param DeleteMarking
 * @desc マーキング番号 n を削除
 * @default DeleteMarking
 *
 *
 * @param SetMinimapScroll
 * @desc スクロールタイプとパラメータの設定
 * @default SetMinimapScroll
 *
 * @param StartMinimapScroll
 * @desc ミニマップを座標(x,y)までスクロール
 * @default StartMinimapScroll
 *
 * @param ResetMinimapScroll
 * @desc ミニマップをプレイヤーの座標までスクロール
 * @default ResetMinimapScroll
 */

/*~struct~MapMeta:
 * @param MiniMap
 * @desc このマップのミニマップ画像のファイル名
 * @default MiniMap
 *
 * @param MinimapZoom
 * @desc このマップのミニマップ拡大率
 * @default MinimapZoom
 *
 */

/*~struct~EventMeta:
 * @param Marker
 * @desc ミニマップに表示するこのイベントのマーカー番号
 * @default Marker
 */

var $dataMinimap = null;
var $gameMinimap = null;

function Game_MiniMap() {
    this.initialize.apply(this, arguments);
}

function Sprite_MiniMap() {
    this.initialize.apply(this, arguments);
}

function MppSprite_Loop() {
    this.initialize.apply(this, arguments);
}

(function() {

var MPPlugin = {};

(function() {
    
    var parameters = PluginManager.parameters('MPP_MiniMap');
    
    function convertParam(name) {
        var param = parameters[name];
        var result = [];
        if (param) {
            var data = param.split(',');
            for (var i = 0; i < data.length; i++) {
                if (/(\d+)\s*-\s*(\d+)/.test(data[i])) {
                    for (var n = Number(RegExp.$1); n <= Number(RegExp.$2); n++) {
                        result.push(n);
                    }
                } else {
                    result.push(Number(data[i]));
                }
            }
        }
        return result;
    };

    MPPlugin.MapIDs = convertParam('Map IDs');
    MPPlugin.DefaultVisible = !!eval(parameters['Default Visible']);
    MPPlugin.DefaultData = eval('[' + parameters['Default Data'] + ']');
    MPPlugin.MinimapZ = Number(parameters['Minimap Z'] || 0);
    MPPlugin.UpdateCount = Math.max(Number(parameters['Update Count'] || 80), 1);
    MPPlugin.BlinkDuration = Number(parameters['Blink Duration'] || 80);
    MPPlugin.HideNextScene = !!eval(parameters['Hide Next Scene?']);

    MPPlugin.DefaultScrollData = parameters['Default Scroll Data'].split(',');
    MPPlugin.DefaultScrollData[0] = Number(MPPlugin.DefaultScrollData[0] || 1);
    MPPlugin.DefaultScrollData[1] = Number(MPPlugin.DefaultScrollData[1]);
    MPPlugin.ScrollMapLink = !!eval(parameters['Scroll Map Link?']);

    MPPlugin.PlayerMarker = Number(parameters['Player Marker']);
    MPPlugin.PlayerOY = Number(parameters['Player OY']);
    MPPlugin.TurnPlayer = !!eval(parameters['Turn Player?']);

    MPPlugin.VehicleOnMarker = Number(parameters['Vehicle On Marker']);
    MPPlugin.VehicleOnOY = Number(parameters['Vehicle On OY']);
    MPPlugin.TurnVehicle = !!eval(parameters['Turn Vehicle?']);
    
    MPPlugin.VehicleOffMarkers = {};
    (parameters['Vehicle Off Markers'] || "").split(',').forEach(function(str) {
        var ary = str.split(':');
        MPPlugin.VehicleOffMarkers[ary[0]] = Number(ary[1]);
    });
    
    MPPlugin.TileSize = Math.max(Number(parameters['Tile Size']), 1);
    MPPlugin.BlurIntensity = Number(parameters['Blur Intensity'] || 2);

    MPPlugin.colors = {};
    MPPlugin.colors.Land = 'rgba(' + parameters['Land Color'] + ')';
    MPPlugin.colors.Sea = 'rgba(' + parameters['Sea Color'] + ')';
    MPPlugin.colors.Ford = 'rgba(' + parameters['Ford Color'] + ')';
    MPPlugin.colors.Mountain = 'rgba(' + parameters['Mountain Color'] + ')';
    MPPlugin.colors.Hill = 'rgba(' + parameters['Hill Color'] + ')';
    MPPlugin.colors.Forest = 'rgba(' + parameters['Forest Color'] + ')';

    MPPlugin.colors.River = 'rgba(' + parameters['River Color'] + ')';
    MPPlugin.colors.Shallow = 'rgba(' + parameters['Shallow Color'] + ')';
    MPPlugin.colors.Ladder = 'rgba(' + parameters['Ladder Color'] + ')';
    MPPlugin.colors.Bush = 'rgba(' + parameters['Bush Color'] + ')';
    MPPlugin.colors.Counter = 'rgba(' + parameters['Counter Color'] + ')';
    MPPlugin.colors.Wall = 'rgba(' + parameters['Wall Color'] + ')';
    MPPlugin.colors.Floor = 'rgba(' + parameters['Floor Color'] + ')';
    MPPlugin.WallRegionIDs = convertParam('Wall Region IDs');
    MPPlugin.FloorRegionIDs = convertParam('Floor Region IDs');
    MPPlugin.Dir4WallWidth = Number(parameters['Dir4 Wall Width']);

    MPPlugin.mColors = JSON.parse(parameters['Marking Colors'] || "[]");
    MPPlugin.mColors = MPPlugin.mColors.map(function(rgba) {
        return 'rgba(' + rgba + ')';
    });
    MPPlugin.mColors.unshift('rgba(0,0,0,0)');
    
    MPPlugin.PluginCommands = JSON.parse(parameters['Plugin Commands']);
    MPPlugin.MapMetadata = JSON.parse(parameters['Map Metadata']);
    MPPlugin.EventMetadata = JSON.parse(parameters['Event Metadata']);

})();

var Alias = {};

//-----------------------------------------------------------------------------
// MiniMap

var MiniMap = {
    image:null,
    createMinimap:function() {
        var name = MPPlugin.MapMetadata.Minimap || "Minimap";
        if ($dataMinimap.meta[name]) {
            MiniMap.image = ImageManager.loadSystem($dataMinimap.meta[name]);
            return;
        }
        var flags = $gameMinimap.tilesetFlags();
        var width = $gameMinimap.width();
        var height = $gameMinimap.height();
        var data = $gameMinimap.data();
        var overworld = $gameMinimap.isOverworld();
        var size = MPPlugin.TileSize;
        var colors = MPPlugin.colors;
        var wallIds = MPPlugin.WallRegionIDs;
        var floorIds = MPPlugin.FloorRegionIDs;
        var dir4W = MPPlugin.Dir4WallWidth;
        var image = new Bitmap(width * size, height * size);
        var tileId, color, wallDir;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                wallDir = 0;
                if (overworld) {
                    tileId = data[(0 * height + y) * width + x] || 0;
                    var index0 = Math.floor((tileId - 2048) / 48);
                    tileId = data[(1 * height + y) * width + x] || 0;
                    var index1 = Math.floor((tileId - 2048) / 48);
                    if (index0 < 16) {
                        color = (index1 === 1 ? colors.Sea : colors.Ford);
                    } else {
                        switch (index1) {
                        case 20: case 21: case 28: case 36: case 44:
                            color = colors.Forest;
                            break;
                        case 22: case 30: case 38: case 46:
                            color = colors.Hill;
                            break;
                        case 23: case 31: case 39: case 47:
                            color = colors.Mountain;
                            break;
                        default:
                            color = colors.Land;
                        }
                    }
                } else {
                    tileId = data[(5 * height + y) * width + x] || 0;
                    if (wallIds.contains(tileId)) {
                        color = colors.Wall;
                    } else if (floorIds.contains(tileId)) {
                        color = colors.Floor;
                    } else {
                        for (var z = 3; z >= 0; z--) {
                            tileId = data[(z * height + y) * width + x] || 0;
                            var flag = flags[tileId];
                            if ((flag & 0x10) !== 0) continue;
                            var index = Math.floor((tileId - 2048) / 48);
                            if (index >= 0 && index < 16) {
                                color = ((flag & 0x0f) === 0x0f ? colors.River : colors.Shallow);
                            } else if ((flag & 0x20) !== 0) {
                                color = colors.Ladder;
                            } else if ((flag & 0x40) !== 0) {
                                color = colors.Bush;
                            } else if ((flag & 0x80) !== 0) {
                                color = colors.Counter;
                            } else if ((flag & 0x0f) === 0x0f) {
                                color = colors.Wall;
                            } else {
                                color = colors.Floor;
                                wallDir = flag & 0x0f;
                            }
                            break;
                        }
                    }
                }
                image.fillRect(x * size, y * size, size, size, color);
                if (wallDir > 0 && dir4W > 0) {
                    color = colors.Wall;
                    if ((flag & 0x01) === 0x01) {
                        image.fillRect(x * size, (y + 1) * size - dir4W, size, dir4W, color);
                    }
                    if ((flag & 0x02) === 0x02) {
                        image.fillRect(x * size, y * size, dir4W, size, color);
                    }
                    if ((flag & 0x04) === 0x04) {
                        image.fillRect((x + 1) * size - dir4W, y * size, dir4W, size, color);
                    }
                    if ((flag & 0x08) === 0x08) {
                        image.fillRect(x * size, y * size, size, dir4W, color);
                    }
                }
            }
        }
        image.mpBlur();
        MiniMap.image = image;
    }
};

//-----------------------------------------------------------------------------
// Math

Math.hypot = Math.hypot || function() {
  var y = 0;
  var length = arguments.length;

  for (var i = 0; i < length; i++) {
    if (arguments[i] === Infinity || arguments[i] === -Infinity) {
      return Infinity;
    }
    y += arguments[i] * arguments[i];
  }
  return Math.sqrt(y);
};

//-----------------------------------------------------------------------------
// Bitmap

Bitmap.prototype.mpBlur = function() {
    var w = this.width;
    var h = this.height;
    var canvas = this._canvas;
    var context = this._context;
    for (var i = 0; i < MPPlugin.BlurIntensity; i++) {
        var tempCanvas = document.createElement('canvas');
        var tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = w + 2;
        tempCanvas.height = h + 2;
        tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
        tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
        tempContext.drawImage(canvas, 0, 0, 1, h, 0, 1, 1, h);
        tempContext.drawImage(canvas, 0, h - 1, w, 1, 1, h + 1, w, 1);
        tempContext.drawImage(canvas, w - 1, 0, 1, h, w + 1, 1, 1, h);
        tempContext.drawImage(canvas, 0, 0, 1, 1, 0, 0, 1, 1);
        tempContext.drawImage(canvas, w - 1, 0, 1, 1, w + 1, 0, 1, 1);
        tempContext.drawImage(canvas, 0, h - 1, 1, 1, 0, h + 1, 1, 1);
        tempContext.drawImage(canvas, w - 1, h - 1, 1, 1, w + 1, h + 1, 1, 1);
        context.save();
        context.clearRect(0, 0, w, h);
        context.globalCompositeOperation = 'lighter';
        context.globalAlpha = 1 / 9;
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
            }
        }
        context.restore();
    }
    this._setDirty();
};

//-----------------------------------------------------------------------------
// DataManager

DataManager.loadMinimapData = function(mapId) {
    if (mapId === $gameMap.mapId()) {
        $dataMinimap = $dataMap;
    } else if (mapId > 0) {
        var filename = 'Map%1.json'.format(mapId.padZero(3));
        this.loadDataFile('$dataMinimap', filename);
    }
};

//125
Alias.DaMa_onLoad = DataManager.onLoad;
DataManager.onLoad = function(object) {
    if (object === $dataMinimap) {
        this.extractMetadata(object);
        var array = object.events;
        if (Array.isArray(array)) {
            for (var i = 0; i < array.length; i++) {
                var data = array[i];
                if (data && data.note !== undefined) {
                    this.extractMetadata(data);
                }
            }
        }
    } else {
        Alias.DaMa_onLoad.call(this, object);
    }
};

//195
Alias.DaMa_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    Alias.DaMa_createGameObjects.call(this);
    $gameMinimap       = new Game_MiniMap();
};

//425
Alias.DaMa_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = Alias.DaMa_makeSaveContents.call(this);
    contents.minimap      = $gameMinimap;
    return contents;
};

//441
Alias.DaMa_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    Alias.DaMa_extractSaveContents.call(this, contents);
    $gameMinimap       = contents.minimap || new Game_MiniMap();
    $gameMinimap.requestCreate = true;
};

//-----------------------------------------------------------------------------
// Game_Temp

//10
Alias.GaTe_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    Alias.GaTe_initialize.call(this);
    this.gameMinimapLoaded = false;
};

//-----------------------------------------------------------------------------
// Game_Map

//37
Alias.GaMa_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    Alias.GaMa_setup.call(this, mapId);
    if (MPPlugin.MapIDs.contains(mapId)) {
        $gameMinimap.setup(mapId);
    } else {
        $gameMinimap.clear();
    }
};

//-----------------------------------------------------------------------------
// Game_MiniMap

Game_MiniMap.prototype.initialize = function() {
    this.mapId = 0;
    $dataMinimap = null;
    this.tileset = null;
    var data = MPPlugin.DefaultData;
    this.rect = new Rectangle(data[0], data[1], data[2], data[3]);
    this.type = data[4];
    this.opacity = data[5];
    this.zoom = data[6];
    this.requestFrame = false;
    this.requestMarker = false;
    this.visible = MPPlugin.DefaultVisible;
    this._dataLoaded = false;
    this._markingData = [];
    this.frameName = '';
    this.requestCreate = false;
    data = MPPlugin.DefaultScrollData;
    this.setScrollType(data[0], data[1]);
    this._minimapX = 0;
    this._minimapY = 0;
    this._scrollDuration = 0;
    this.realZoom = 1.0;
    this.realRect = new Rectangle();
    this.xRate = 1.0;
    this.yRate = 1.0;
    this._lastBaseX = 0;
    this._lastBaseY = 0;
};

Game_MiniMap.prototype.setup = function(mapId) {
    if (this.mapId !== mapId) {
        this.mapId = mapId;
        this.create();
    }
};

Game_MiniMap.prototype.clear = function() {
    this.mapId = 0;
    $dataMinimap = null;
    MiniMap.image = null;
    this.requestFrame = true;
    this._dataLoaded = false;
    $gameTemp.gameMinimapLoaded = false;
};

Game_MiniMap.prototype.create = function() {
    $dataMinimap = null;
    MiniMap.image = null;
    DataManager.loadMinimapData(this.mapId);
    this._dataLoaded = false;
    this.requestFrame = true;
    $gameTemp.gameMinimapLoaded = false;
};

Game_MiniMap.prototype.tilesetFlags = function() {
    return this.tileset ? this.tileset.flags : [];
};

Game_MiniMap.prototype.width = function() {
    return $dataMinimap.width;
};

Game_MiniMap.prototype.height = function() {
    return $dataMinimap.height;
};

Game_MiniMap.prototype.data = function() {
    return $dataMinimap.data;
};

Game_MiniMap.prototype.isLoopHorizontal = function() {
    return $dataMinimap.scrollType === 2 || $dataMinimap.scrollType === 3;
};

Game_MiniMap.prototype.isLoopVertical = function() {
    return $dataMinimap.scrollType === 1 || $dataMinimap.scrollType === 3;
};

Game_MiniMap.prototype.isOverworld = function() {
    return this.tileset && this.tileset.mode === 0;
};

Game_MiniMap.prototype.minimapOx = function() {
    var ox = (this._minimapX + 0.5) * this.xRate - this.realRect.width / 2;
    return Math.round(ox / this.realZoom);
};

Game_MiniMap.prototype.minimapOy = function() {
    var oy = (this._minimapY + 0.5) * this.yRate - this.realRect.height / 2;
    return Math.round(oy / this.realZoom);
};

Game_MiniMap.prototype.start = function(x, y, w, h, t, op, zoom) {
    var rect = this.rect;
    if (rect.x !== x || rect.y !== y || rect.width !== w || rect.height !== h ||
            this.type !== t || this.opacity !== op || this.zoom !== zoom) {
        rect.x = x;
        rect.y = y;
        rect.width = w;
        rect.height = h;
        this.type = t;
        this.opacity = op;
        this.zoom = zoom;
        this.requestFrame = true;
    }
};

Game_MiniMap.prototype.setScrollType = function(type, param) {
    this._scrollType = type.clamp(0, 3);
    this._scrollParam = Math.max(param, 0);
};

Game_MiniMap.prototype.startScrollPos = function(x, y) {
    if (this._scrollType === 0 && this._scrollParam > 0) {
        var d = Math.hypot(x - this._minimapX, y - this._minimapY) * 8;
        this._scrollDuration = Math.round(d / this._scrollParam);
    } else {
        this._scrollDuration = this._scrollParam;
    }
    if (this._scrollDuration === 0) {
        this.setMinimapX(x);
        this.setMinimapY(y);
    } else {
        this._scrollTargetX = x;
        this._scrollTargetY = y;
        this._scrollStartX = this._minimapX;
        this._scrollStartY = this._minimapY;
    }
};

Game_MiniMap.prototype.resetScroll = function() {
    this.startScrollPos(this.getBaseX(), this.getBaseY());
};

Game_MiniMap.prototype.setCenter = function() {
    this._scrollDuration = 0;
    this._lastBaseX = this.getBaseX();
    this._lastBaseY = this.getBaseY();
    this.setMinimapX(this._lastBaseX);
    this.setMinimapY(this._lastBaseY);
};

Game_MiniMap.prototype.getBaseX = function() {
    if ($gameMap.mapId() !== this.mapId) {
        return this.width() / 2;
    } else if (this.isMapLink()) {
        return $gameMap.displayX() + $gamePlayer.centerX();
    } else {
        return $gamePlayer._realX;
    }
};

Game_MiniMap.prototype.getBaseY = function() {
    if ($gameMap.mapId() !== this.mapId) {
        return this.height() / 2;
    } else if (this.isMapLink()) {
        return $gameMap.displayY() + $gamePlayer.centerY();
    } else {
        return $gamePlayer._realY;
    }
};

Game_MiniMap.prototype.isMapLink = function() {
    return MPPlugin.ScrollMapLink;
};

Game_MiniMap.prototype.setMinimapX = function(x) {
    if (this.type === 0 || !this.isLoopHorizontal()) {
        var hw = this.realRect.width / this.xRate / 2;
        this._minimapX = x.clamp(hw - 0.5, this.width() - hw - 0.5);
    } else {
        this._minimapX = x.mod(this.width());
    }
};

Game_MiniMap.prototype.setMinimapY = function(y) {
    if (this.type === 0 || !this.isLoopVertical()) {
        var hh = this.realRect.height / this.yRate / 2;
        this._minimapY = y.clamp(hh - 0.5, this.height() - hh - 0.5);
    } else {
        this._minimapY = y.mod(this.height());
    }
};

Game_MiniMap.prototype.moveMinimapHor = function(distance) {
    this.setMinimapX(this._minimapX + distance);
};

Game_MiniMap.prototype.moveMinimapVer = function(distance) {
    this.setMinimapY(this._minimapY + distance);
};

Game_MiniMap.prototype.isEnabled = function() {
    return this.isReady() && this.visible &&
            (this.type === 0 || this.zoom > 0) &&
            this.rect.width > 0 && this.rect.height > 0;
};

Game_MiniMap.prototype.isReady = function() {
    if (!this._dataLoaded && !!$dataMinimap) {
        this.onMinimapLoaded();
        this._dataLoaded = true;
    }
    return !!$dataMinimap;
};

Game_MiniMap.prototype.onMinimapLoaded = function() {
    this.tileset = $dataTilesets[$dataMinimap.tilesetId];
    var name = MPPlugin.MapMetadata.MinimapZoom || "MinimapZoom";
    if ($dataMinimap.meta[name]) {
        this.zoom = Number($dataMinimap.meta[name]);
    }
    setTimeout(MiniMap.createMinimap, 1);
};

Game_MiniMap.prototype.allEvents = function() {
    if ($gameMap.mapId() === this.mapId) {
        return $gameMap.events().concat($gameMap.vehicles());
    } else {
        return $gameMap.vehicles();
    }
};

Game_MiniMap.prototype.markingData = function() {
    return this._markingData.filter(function(data) {
        return data && data.mapId === this.mapId;
    }, this);
};

Game_MiniMap.prototype.setMarking = function(id, mapId, type, params) {
    if (type >= 0 && type < 5) {
        this._markingData[id] = { mapId:mapId, type:type, params:params };
        this.requestMarker = true;
    }
};

Game_MiniMap.prototype.removeMarking = function(id) {
    this._markingData[id] = null;
    this.requestMarker = true;
};

Game_MiniMap.prototype.update = function() {
    if (this.mapId > 0) {
        this.updateScroll();
    }
};

Game_MiniMap.prototype.updateScroll = function() {
    if (this._scrollDuration > 0) {
        var d = this._scrollDuration;
        var tx = this._scrollTargetX;
        var ty = this._scrollTargetY;
        var mx, my;
        switch (this._scrollType) {
            case 0: case 1:
                mx = (this._minimapX * (d - 1) + tx) / d;
                my = (this._minimapY * (d - 1) + ty) / d;
                break;
            case 2:
                mx = this.step(d, tx, this._minimapX);
                my = this.step(d, ty, this._minimapY);
                break;
            case 3:
                var sx = this._scrollStartX;
                var sy = this._scrollStartY;
                var rate = (Math.cos((d - 1) / this._scrollParam * Math.PI) + 1) / 2;
                mx = Math.round(sx - (sx - tx) * rate);
                my = Math.round(sy - (sy - ty) * rate);
                break;
        }
        this.setMinimapX(mx);
        this.setMinimapY(my);
        this._scrollDuration--;
    } else {
        var x1 = this._lastBaseX;
        var y1 = this._lastBaseY;
        var x2 = this.getBaseX();
        var y2 = this.getBaseY();
        if (this.type === 0 || !this.isLoopHorizontal()) {
            if ((x2 < x1 && x2 < this._minimapX) ||
                    (x2 > x1 && x2 > this._minimapX)) {
                this.moveMinimapHor(x2 - x1);
            }
        } else {
            if (x2 !== x1) {
                this.moveMinimapHor(x2 - x1);
            }
        }
        if (this.type === 0 || !this.isLoopVertical()) {
            if ((y2 > y1 && y2 > this._minimapY) ||
                    (y2 < y1 && y2 < this._minimapY)) {
                this.moveMinimapVer(y2 - y1);
            }
        } else {
            if (y2 !== y1) {
                this.moveMinimapVer(y2 - y1);
            }
        }
    }
    this._lastBaseX = this.getBaseX();
    this._lastBaseY = this.getBaseY();
};

Game_MiniMap.prototype.step = function(d, t, n) {
    return Math.round(t + (n - t) * Math.pow(d - 1, 2) / Math.pow(d, 2));
};

//-----------------------------------------------------------------------------
// Game_Vehicle

Game_Vehicle.prototype.marker = function() {
    if (!this._driving && this._mapId === $gameMinimap.mapId) {
        return MPPlugin.VehicleOffMarkers[this._type];
    } else {
        return -1;
    }
};

//-----------------------------------------------------------------------------
// Game_Event

//14
Alias.GaEv_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    Alias.GaEv_initialize.call(this, mapId, eventId);
    var name = MPPlugin.EventMetadata.Marker || "Marker";
    var marker = this.event().meta[name];
    this._marker = (marker ? Number(marker) : -1);
};

Game_Event.prototype.marker = function() {
    return (this._pageIndex >= 0 && !this.isTransparent() ? this._marker : -1);
};

//-----------------------------------------------------------------------------
// Game_Interpreter

//1722
Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Alias.GaIn_pluginCommand.call(this, command, args);
    var v = $gameVariables._data;
    switch (command) {
    case MPPlugin.PluginCommands.MiniMap: case 'MiniMap':
        var x = eval(args[0]);
        var y = eval(args[1]);
        var w = Math.max(eval(args[2]), 0);
        var h = Math.max(eval(args[3]), 0);
        var t = eval(args[4]);
        var op = eval(args[5]).clamp(0, 255);
        var zoom = (args[6] ? Math.max(eval(args[6]), 0) : 1);
        $gameMinimap.start(x, y, w, h, t, op, zoom);
        break;
    case MPPlugin.PluginCommands.HideMiniMap: case 'HideMiniMap':
        $gameMinimap.visible = false;
        break;
    case MPPlugin.PluginCommands.ShowMiniMap: case 'ShowMiniMap':
        $gameMinimap.visible = true;
        break;
    case MPPlugin.PluginCommands.ChangeMinimap: case 'ChangeMinimap':
        $gameMinimap.setup(eval(args[0]));
        break;
    case MPPlugin.PluginCommands.MarkingCirEve: case 'MarkingCirEve':
        for (var i = 0; i < args.length; i++) {
            args[i] = eval(args[i]);
        }
        var id = args.shift();
        var mapId = args.shift() || $gameMinimap.mapId;
        $gameMinimap.setMarking(id, mapId, 0, args);
        break;
    case MPPlugin.PluginCommands.MarkingCirPos: case 'MarkingCirPos':
        for (var i = 0; i < args.length; i++) {
            args[i] = eval(args[i]);
        }
        var id = args.shift();
        var mapId = args.shift() || $gameMinimap.mapId;
        $gameMinimap.setMarking(id, mapId, 1, args);
        break;
    case MPPlugin.PluginCommands.MarkingRecPos: case 'MarkingRecPos':
        for (var i = 0; i < args.length; i++) {
            args[i] = eval(args[i]);
        }
        var id = args.shift();
        var mapId = args.shift() || $gameMinimap.mapId;
        $gameMinimap.setMarking(id, mapId, 2, args);
        break;
    case MPPlugin.PluginCommands.MarkingIcoEve: case 'MarkingIcoEve':
        for (var i = 0; i < args.length; i++) {
            args[i] = eval(args[i]);
        }
        var id = args.shift();
        var mapId = args.shift() || $gameMinimap.mapId;
        $gameMinimap.setMarking(id, mapId, 3, args);
        break;
    case MPPlugin.PluginCommands.MarkingIcoPos: case 'MarkingIcoPos':
        for (var i = 0; i < args.length; i++) {
            args[i] = eval(args[i]);
        }
        var id = args.shift();
        var mapId = args.shift() || $gameMap.mapId();
        $gameMinimap.setMarking(id, mapId, 4, args);
        break;
    case MPPlugin.PluginCommands.DeleteMarking: case 'DeleteMarking':
        $gameMinimap.removeMarking(eval(args[0]));
        break;
    case MPPlugin.PluginCommands.SetMinimapFrame: case 'SetMinimapFrame':
        $gameMinimap.frameName = args[0];
        break;
    case MPPlugin.PluginCommands.ClearMinimapFrame: case 'ClearMinimapFrame':
        $gameMinimap.frameName = '';
        break;
    case MPPlugin.PluginCommands.SetMinimapScroll: case 'SetMinimapScroll':
        $gameMinimap.setScrollType(eval(args[0]), eval(args[1]));
        break;
    case MPPlugin.PluginCommands.StartMinimapScroll: case 'StartMinimapScroll':
        $gameMinimap.startScrollPos(eval(args[0]), eval(args[1]));
        break;
    case MPPlugin.PluginCommands.ResetMinimapScroll: case 'ResetMinimapScroll':
        $gameMinimap.resetScroll();
        break;
    case MPPlugin.PluginCommands.SetMinimapZoom: case 'SetMinimapZoom':
        var zoom = eval(args[0]);
        if (zoom > 0) {
            $gameMinimap.zoom = zoom;
            $gameMinimap.requestFrame = true;
        }
        break;
    }
};

//-----------------------------------------------------------------------------
// Sprite_Loop

MppSprite_Loop.prototype = Object.create(Sprite.prototype);
MppSprite_Loop.prototype.constructor = MppSprite_Loop;

MppSprite_Loop.prototype.initialize = function(bitmap) {
    Sprite.prototype.initialize.call(this, bitmap);
    for (var i = 0; i < 4; i++) {
        this.addChild(new Sprite(bitmap));
    }
};

MppSprite_Loop.prototype._refresh = function() {
    var frameX = Math.floor(this._frame.x);
    var frameY = Math.floor(this._frame.y);
    var frameW = Math.floor(this._frame.width);
    var frameH = Math.floor(this._frame.height);
    var bitmapW = this._bitmap ? this._bitmap.width : 0;
    var bitmapH = this._bitmap ? this._bitmap.height : 0;
    var realX1 = frameX.clamp(0, bitmapW);
    var realY1 = frameY.clamp(0, bitmapH);
    var realW1 = (frameW - realX1 + frameX).clamp(0, bitmapW - realX1);
    var realH1 = (frameH - realY1 + frameY).clamp(0, bitmapH - realY1);
    var realX2 = 0;
    var realY2 = 0;
    var realW2 = (frameW - realW1).clamp(0, frameW);
    var realH2 = (frameH - realH1).clamp(0, frameH);
    var x1 = Math.floor(-frameW * this.anchor.x);
    var y1 = Math.floor(-frameH * this.anchor.y);
    var x2 = x1 + realW1;
    var y2 = y1 + realH1;
    var sprite = this.children[0];
    sprite.bitmap = this._bitmap;
    sprite.move(x1, y1);
    sprite.setFrame(realX1, realY1, realW1, realH1);
    sprite = this.children[1];
    sprite.bitmap = this._bitmap;
    sprite.move(x2, y1);
    sprite.setFrame(realX2, realY1, realW2, realH1);
    sprite = this.children[2];
    sprite.bitmap = this._bitmap;
    sprite.move(x1, y2);
    sprite.setFrame(realX1, realY2, realW1, realH2);
    sprite = this.children[3];
    sprite.bitmap = this._bitmap;
    sprite.move(x2, y2);
    sprite.setFrame(realX2, realY2, realW2, realH2);
};

//-----------------------------------------------------------------------------
// Sprite_MiniMap

Sprite_MiniMap.prototype = Object.create(Sprite.prototype);
Sprite_MiniMap.prototype.constructor = Sprite_MiniMap;

Sprite_MiniMap.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._updateCount = 0;
    this._blinkDuration = MPPlugin.BlinkDuration;
    this._rect = new Rectangle();
    this._zoom = 1.0;
    this._windowskin = ImageManager.loadSystem('Window');
    this._markerSet = ImageManager.loadSystem('MinimapMarkerSet');
    this._markerSize = Math.floor(this._markerSet.width / 8);
    this._playerMarker = null;
    this.createMiniMapSprite();
    this.createMarkerSprite();
    this.createPlayerSprite();
    this.createFrameSprite();
    this.visible = false;
    this.show = true;
    $gameTemp.gameMinimapLoaded = false;
};

Sprite_MiniMap.prototype.createMiniMapSprite = function() {
    this._miniMapSprite = new MppSprite_Loop();
    this._miniMapSprite.anchor.x = 0.5;
    this._miniMapSprite.anchor.y = 0.5;
    this.addChild(this._miniMapSprite);
};

Sprite_MiniMap.prototype.createMarkerSprite = function() {
    this._markerSprite = new Sprite();
    this._markerSprite.anchor.x = 0.5;
    this._markerSprite.anchor.y = 0.5;
    this.addChild(this._markerSprite);
};

Sprite_MiniMap.prototype.createPlayerSprite = function() {
    this._playerSprite = new Sprite();
    this._playerSprite.bitmap = this._markerSet;
    this._playerSprite.anchor.x = 0.5;
    this.addChild(this._playerSprite);
    this._playerMarker = MPPlugin.PlayerMarker;
    this.refreshPlayer();
};

Sprite_MiniMap.prototype.createFrameSprite = function() {
    this._frameSprite = new Sprite();
    this._frameName = $gameMinimap.frameName;
    this._frameSprite.bitmap = ImageManager.loadPicture(this._frameName);
    this._frameSprite.anchor.x = 0.5;
    this._frameSprite.anchor.y = 0.5;
    this.addChild(this._frameSprite);
};

Sprite_MiniMap.prototype.markerColor = function(n) {
    var px = 96 + (n % 8) * 12 + 6;
    var py = 144 + Math.floor(n / 8) * 12 + 6;
    return this._windowskin.getPixel(px, py);
};

Sprite_MiniMap.prototype.isReady = function() {
    if (!$gameTemp.gameMinimapLoaded && MiniMap.image && MiniMap.image.isReady()) {
        this.onMinimapLoaded();
        $gameTemp.gameMinimapLoaded = true;
    }
    return $gameTemp.gameMinimapLoaded;
};

Sprite_MiniMap.prototype.onMinimapLoaded = function() {
    this._baseBitmap = MiniMap.image;
    this._miniMapSprite.bitmap = this._baseBitmap;
    this.refreshFrame();
};

Sprite_MiniMap.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.visible = $gameMinimap.isEnabled() && this.isReady() && this.show;
    if (!this.visible) return;
    $gameMinimap.update();
    if ($gameMinimap.requestFrame) {
        this.refreshFrame();
        $gameMinimap.requestFrame = false;
    }
    this._updateCount++;
    this._blinkDuration--;
    this.updateAllParts();
};

Sprite_MiniMap.prototype.refreshFrame = function() {
    var bw = this._baseBitmap.width;
    var bh = this._baseBitmap.height;
    var rect = this._rect;
    var baseRect = $gameMinimap.rect;
    if ($gameMinimap.type === 0) {
        this._zoom = Math.min(baseRect.width / bw, baseRect.height / bh);
    } else {
        this._zoom = $gameMinimap.zoom;
    }
    var zoom = this._zoom;
    rect.width = Math.round(Math.min(baseRect.width, bw * zoom));
    rect.height = Math.round(Math.min(baseRect.height, bh * zoom));
    rect.x = baseRect.x + Math.floor((baseRect.width - rect.width) / 2);
    rect.y = baseRect.y + Math.floor((baseRect.height - rect.height) / 2);
    this.x = rect.x + rect.width / 2;
    this.y = rect.y + rect.height / 2;
    this._miniMapSprite.scale.x = zoom;
    this._miniMapSprite.scale.y = zoom;
    this._miniMapSprite.opacity = $gameMinimap.opacity;
    var width = Math.floor(bw * zoom) + rect.width;
    var height = Math.floor(bh * zoom) + rect.height;
    this._markerSprite.bitmap = new Bitmap(width, height);
    this.redrawAllMarker();
    $gameMinimap.realZoom = zoom;
    $gameMinimap.realRect = rect;
    $gameMinimap.xRate = bw / $gameMinimap.width() * zoom;
    $gameMinimap.yRate = bh / $gameMinimap.height() * zoom;
    $gameMinimap.setCenter();
};

Sprite_MiniMap.prototype.updateAllParts = function() {
    var bitmap = this._baseBitmap;
    var ox = $gameMinimap.minimapOx().mod(bitmap.width);
    var oy = $gameMinimap.minimapOy().mod(bitmap.height);
    this.updatePlayer(ox, oy);
    this.updateMiniMap(ox, oy);
    this.updateMarker(ox, oy);
    this.updateMinimapFrame();
};

Sprite_MiniMap.prototype.updatePlayer = function(x, y) {
    var sprite = this._playerSprite;
    sprite.visible = ($gameMap.mapId() === $gameMinimap.mapId);
    if (!sprite.visible) return;
    var marker, turn;
    if ($gamePlayer.isInVehicle() &&
            !$gamePlayer._vehicleGettingOn && !$gamePlayer._vehicleGettingOff) {
        marker = MPPlugin.VehicleOnMarker;
        turn = MPPlugin.TurnVehicle;
        sprite.anchor.y = MPPlugin.VehicleOnOY;
    } else {
        marker = MPPlugin.PlayerMarker;
        turn = MPPlugin.TurnPlayer;
        sprite.anchor.y = MPPlugin.PlayerOY;
    }
    if (this._playerMarker !== marker) {
        this._playerMarker = marker;
        this.refreshPlayer();
    }
    if (turn) {
        switch ($gamePlayer.direction()) {
        case 2:
            sprite.rotation = 180 * Math.PI / 180;
            break;
        case 4:
            sprite.rotation = 270 * Math.PI / 180;
            break;
        case 6:
            sprite.rotation = 90 * Math.PI / 180;
            break;
        case 8:
            sprite.rotation = 0 * Math.PI / 180;
            break;
        }
    } else {
        sprite.rotation = 0;
    }
    var bw = this._baseBitmap.width;
    var bh = this._baseBitmap.height;
    var px = ($gamePlayer._realX + 0.5) * bw / $gameMinimap.width();
    var py = ($gamePlayer._realY + 0.5) * bh / $gameMinimap.height();
    sprite.x = (px - x).mod(bw) * this._zoom - this._rect.width / 2;
    sprite.y = (py - y).mod(bh) * this._zoom - this._rect.height / 2;
    sprite.visible = (Math.abs(sprite.x) < this._rect.width / 2 &&
            Math.abs(sprite.y) < this._rect.height / 2);
};

Sprite_MiniMap.prototype.refreshPlayer = function() {
    var marker = this._playerMarker;
    var size = this._markerSize;
    var x = marker % 8 * size;
    var y = Math.floor(marker / 8) * size;
    this._playerSprite.setFrame(x, y, size, size);
};

Sprite_MiniMap.prototype.updateMiniMap = function(x, y) {
    var w = Math.ceil(this._rect.width / this._zoom);
    var h = Math.ceil(this._rect.height / this._zoom);
    this._miniMapSprite.setFrame(x, y, w, h);
};

Sprite_MiniMap.prototype.updateMarker = function(x, y) {
    if ($gameMinimap.requestMarker || this._updateCount >= MPPlugin.UpdateCount) {
        this.redrawAllMarker();
        $gameMinimap.requestMarker = false;
        this._updateCount = 0;
    }
    var d = MPPlugin.BlinkDuration;
    if (d > 0) {
        if (this._blinkDuration < 0) {
            this._blinkDuration = d - 1;
        }
        this._markerSprite.opacity = 320 * (d - this._updateCount) / d;
    } else {
        this._markerSprite.opacity = 255;
    }
    var zoom = this._zoom;
    var rect = this._rect;
    this._markerSprite.setFrame(x * zoom, y * zoom, rect.width, rect.height);
};

Sprite_MiniMap.prototype.redrawAllMarker = function() {
    var bitmap = this._markerSprite.bitmap;
    var markerSet = this._markerSet;
    var size = this._markerSize;
    bitmap.clear();
    var bw = bitmap.width - this._rect.width;
    var bh = bitmap.height - this._rect.height;
    var xRate = bw / $gameMinimap.width();
    var yRate = bh / $gameMinimap.height();
    var horizontal = $gameMinimap.isLoopHorizontal();
    var vertical = $gameMinimap.isLoopVertical();
    var frame = this._markerSprite._frame;
    var cx = frame.x + frame.width / 2;
    var cy = frame.y + frame.height / 2;
    function drawMarker(x, y, marker) {
        var dx1 = (x + 0.5) * xRate - size / 2;
        var dy1 = (y + 0.5) * yRate - size / 2;
        var dx2 = dx1 + (dx1 < cx ? bw : -bw);
        var dy2 = dy1 + (dy1 < cy ? bh : -bh);
        var mx = marker % 8 * size;
        var my = Math.floor(marker / 8) * size;
        bitmap.blt(markerSet, mx, my, size, size, dx1, dy1);
        if (horizontal) {
            bitmap.blt(markerSet, mx, my, size, size, dx2, dy1);
        }
        if (vertical) {
            bitmap.blt(markerSet, mx, my, size, size, dx1, dy2);
        }
        if (horizontal && vertical) {
            bitmap.blt(markerSet, mx, my, size, size, dx2, dy2);
        }
    }
    function drawCircle(x, y, r, color) {
        var dx1 = (x + 0.5) * xRate;
        var dy1 = (y + 0.5) * yRate;
        var dx2 = dx1 + (dx1 < cx ? bw : -bw);
        var dy2 = dy1 + (dy1 < cy ? bh : -bh);
        r *= xRate;
        bitmap.drawCircle(dx1, dy1, r, color);
        if (horizontal) {
            bitmap.drawCircle(dx2, dy1, r, color);
        }
        if (vertical) {
            bitmap.drawCircle(dx1, dy2, r, color);
        }
        if (horizontal && vertical) {
            bitmap.drawCircle(dx2, dy2, r, color);
        }
    }
    function drawRect(x, y, w, h, color) {
        var dx1 = x * xRate;
        var dy1 = y * yRate;
        var dx2 = dx1 + (dx1 < cx ? bw : -bw);
        var dy2 = dy1 + (dy1 < cy ? bh : -bh);
        w *= xRate;
        h *= yRate;
        bitmap.fillRect(dx1, dy1, w, h, color);
        if (horizontal) {
            bitmap.fillRect(dx2, dy1, w, h, color);
        }
        if (vertical) {
            bitmap.fillRect(dx1, dy2, w, h, color);
        }
        if (horizontal && vertical) {
            bitmap.fillRect(dx2, dy2, w, h, color);
        }
    }
    var colors = MPPlugin.mColors;
    var data = $gameMinimap.markingData();
    for (var i = 0; i < data.length; i++) {
        var marking = data[i];
        var params = marking.params;
        switch (marking.type) {
            case 0:
                if ($gameMap.mapId() === marking.mapId) {
                    var event = $gameMap.event(params[0]);
                    if (event) {
                        var color = colors[params[2]];
                        drawCircle(event.x, event.y, params[1], color);
                    }
                }
                break;
            case 1:
                var color = colors[params[3]];
                drawCircle(params[0], params[1], params[2], color);
                break;
            case 2:
                var color = colors[params[4]];
                drawRect(params[0], params[1], params[2], params[3], color);
                break;
            case 3:
                if ($gameMap.mapId() === marking.mapId) {
                    var event = $gameMap.event(params[0]);
                    if (event) {
                        drawMarker(event.x, event.y, params[1]);
                    }
                }
                break;
            case 4:
                drawMarker(params[0], params[1], params[2]);
                break;
        }
    }
    var allEvents = $gameMinimap.allEvents();
    for (var i = 0; i < allEvents.length; i++) {
        var event = allEvents[i];
        var marker = event.marker();
        if (marker >= 0) {
            drawMarker(event.x, event.y, marker);
        }
    }
};

Sprite_MiniMap.prototype.updateMinimapFrame = function() {
    if (this._frameName !== $gameMinimap.frameName) {
        this._frameName = $gameMinimap.frameName;
        this._frameSprite.bitmap = ImageManager.loadPicture(this._frameName);
    }
};

Sprite_MiniMap.prototype.hide = function() {
    this.show = false;
};

//-----------------------------------------------------------------------------
// Spriteset_Map

Spriteset_Map.prototype.addMinimap = function(minimap, z) {
    var index;
    switch (z) {
        case 0:
            index = this.children.indexOf(this._pictureContainer);
            break;
        case 1:
            index = this.children.indexOf(this._timerSprite);
            break;
        case 2:
            index = this.children.indexOf(this._flashSprite);
            break;
        case 3:
            index = this.children.indexOf(this._fadeSprite) + 1;
            break;
    }
    if (index) {
        this.addChildAt(minimap, index);
    }
};

//-----------------------------------------------------------------------------
// Scene_Map

//36
Alias.ScMa_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    Alias.ScMa_onMapLoaded.call(this);
    if ($gameMinimap.requestCreate) {
        $gameMinimap.create();
        $gameMinimap.requestCreate = false;
    }
};

//75
//Alias.ScMa_updateMain = Scene_Map.prototype.updateMain;
//Scene_Map.prototype.updateMain = function() {
//    Alias.ScMa_updateMain.call(this);
//    $gameMinimap.update();
//};

//107
Alias.ScMa_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    if (MPPlugin.HideNextScene && !SceneManager.isNextScene(Scene_Battle))
        this._miniMap.hide();
    Alias.ScMa_terminate.call(this);
};

//195
Alias.ScMa_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    Alias.ScMa_createDisplayObjects.apply(this, arguments);
    this.createMinimap();
};

Scene_Map.prototype.createMinimap = function() {
    this._miniMap = new Sprite_MiniMap();
    if (MPPlugin.MinimapZ < 4) {
        this._spriteset.addMinimap(this._miniMap, MPPlugin.MinimapZ);
    } else {
        var index = this.children.indexOf(this._mapNameWindow);
        this.addChildAt(this._miniMap, index);
    }
};

//251
Alias.ScMa_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
    Alias.ScMa_callMenu.call(this);
    if (MPPlugin.HideNextScene)
        this._miniMap.hide();
};

//288
Alias.ScMa_launchBattle = Scene_Map.prototype.launchBattle;
Scene_Map.prototype.launchBattle = function() {
    Alias.ScMa_launchBattle.call(this);
    if (MPPlugin.HideNextScene)
        this._miniMap.hide();
};

//-----------------------------------------------------------------------------
// Scene_Boot

//29
Alias.ScBo_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
    Alias.ScBo_loadSystemImages.call(this);
    ImageManager.reserveSystem('MinimapMarkerSet');
};


})();
