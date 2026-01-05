function kakaoShare(){
    if(!Kakao.isInitialized()){
        Kakao.init('c7242b41eaad5d31a1ff6c0de0f82f32');
    }
    Kakao.Share.sendCustom({
        templateId: 1363341,
        templateArgs: {
            title: 'Songs For You!',
            description: '당신에게 꼭 맞는 곡을 PICK!',
        },
    });
}