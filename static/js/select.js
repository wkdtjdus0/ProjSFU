import config from "./apikey.js";

const nickname = "{{ username }}"
console.log("닉네임:", nickname);

//콘솔로 타입, 무드 보여줌
const urlParams=new URLSearchParams(window.location.search);
const resultType=urlParams.get('type');
const resultMood=urlParams.get('mood');

console.log("최종 타입: ", resultType);
console.log("최종 무드: ", resultMood);

const apiKey = config.LASTFM_API;

// 메인 로직을 실행하는 async 함수
async function getAndDisplayMusic() {
    // API URL 두 개 준비
    const apiUrl1 = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${resultType}&api_key=${apiKey}&format=json&limit=500`;
    const apiUrl2 = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${resultMood}&api_key=${apiKey}&format=json&limit=500`;

    try {
        // Promise.all을 사용해 두 API를 동시에 호출하고 모두 끝날 때까지 기다림
        const responses = await Promise.all([
            fetch(apiUrl1),
            fetch(apiUrl2)
        ]);

        // 각 응답이 정상적인지 확인
        for (const response of responses) {
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
        }

        // 두 응답을 각각 JSON으로 변환
        const data1 = await responses[0].json();
        const data2 = await responses[1].json();

        // 각 API 결과에서 트랙 목록을 추출
        const tracks1 = data1.tracks.track;
        const tracks2 = data2.tracks.track;

        // 두 목록의 공통 트랙 찾기
        const track1Names = new Set(tracks1.map(track => `${track.name}<br>${track.artist.name}`));
        const commonTracks = tracks2.filter(track => track1Names.has(`${track.name}<br>${track.artist.name}`));
        
        console.log('공통 트랙 개수:', commonTracks.length, commonTracks);

        const trackList = document.getElementById('track-list');
        trackList.innerHTML = '';

        // 공통 트랙 중에서 랜덤으로 하나 선택하여 표시
        if (commonTracks && commonTracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * commonTracks.length);
            const randomTrack = commonTracks[randomIndex];
            displayTrack(randomTrack);
        } else { //공통 트랙이 없을 경우 두 트랙을 합쳐서 그 안에서 랜덤으로 한 곡 표시(9.3 추가)
            const combinedTrack=[tracks1, tracks2];
            if(combinedTrack.length>0){
                const messageEl = document.createElement('p');
                messageEl.innerHTML='두 태그에 모두 해당하는 곡을 찾지 못했어요. 대신 각 태그 중에서 랜덤으로 한 곡을 보여드릴게요!';
                trackList.appendChild(messageEl);

                const tempRandIndex = Math.floor(Math.random()*combinedTrack.length);
                const tempRandTrack = tracks1[tempRandIndex];
                displayTrack(tempRandTrack);
            } else displayTrack(null); // 트랙이 단 한개도 없을때
        }

    } catch (error) {
        console.error('API 처리 중 오류 발생:', error);
        const trackList = document.getElementById('track-list');
        trackList.innerHTML = '<li>음악을 불러오는 데 실패했습니다.</li>';
    }
}

// 단일 트랙을 화면에 표시하는 함수 (변경 없음)
function displayTrack(track) {
    const trackList = document.getElementById('track-list');
    //trackList.innerHTML = '';

    if (!track) {
        trackList.innerHTML = '<li>결과에 맞는 곡을 찾지 못했어요.</li>';
        return;
    }
    
    const listItem = document.createElement('li');
    // tag.getTopTracks의 artist는 객체이므로 .name으로 접근
    listItem.innerHTML = `<strong>${track.name}</strong><br>${track.artist.name}`;
    trackList.appendChild(listItem);

    //12.20 추가(자동저장)
    const coverUrl="/static/img/testimg.png";

    const trackData={
        title: track.name,
        singer: track.artist.name,
        cover: coverUrl
    };
    autoSaveResult(trackData);
}
//12.20 추가(자동저장)
function autoSaveResult(trackData){
    const albumImg = document.getElementById('album-img');
    fetch('/save_result',{
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({title:trackData.title, singer: trackData.singer}),
    })
    .then(response => response.json())
    .then(data =>{
        if(data.status==='success'){
            console.log("자동 저장 완료:",data.message);
            console.log("이미지 매칭 완료:",data.cover_url);
            if(albumImg && data.cover_url){
                albumImg.src=data.cover_url;
            }
        } else{
            console.log("저장 실패:",data.message);
            if(albumImg) albumImg.src="/static/img/testimg.png";
        }
    })
    .catch((error)=>{
        console.error('자동저장 오류:',error);
        if(albumImg) albumImg.src="/static/img/testimg.png";
    })
}

// 스크립트 시작 시 메인 함수 호출
getAndDisplayMusic();