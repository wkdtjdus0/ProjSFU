import config from "./apikey";

function kakaoShare(){
    if(!Kakao.isInitialized()){
        Kakao.init(config.KAKAO_JS_API);
    }
    Kakao.Share.sendCustom({
        templateId: 127662,
        templateArgs: {
            title: 'Songs For You!',
            description: '당신에게 꼭 맞는 곡을 PICK!',
        },
    });
}