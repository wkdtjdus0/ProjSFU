function card(){
    const container = document.getElementById('card-container');
    
    //전용 api 경로로 데이터 요청
    fetch(`/api/get_playlist/${targetUserId}`) //결과 json을 받을 예정 -> db로 결과 받는걸로 변경
    .then(response => response.json())
    .then(data => {    
        container.innerHTML=''//초기화
        if(data.length === 0){
            container.innerHTML ='<p class="no-data">아직 저장된 곡이 없습니다.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="album-wrapper">
                <div class="user-id">ID: ${item.userId}</div>
                <div class="album-cover" style="background-image: url('${item.cover}');"></div>
                </div>
                <div class="song-info">
                    <div class="song-title">${item.title}</div>
                    <div class="song-singer">${item.singer}</div>
                </div>
            `;

            //추가 클릭이벤트: 클릭하면 해당 곡 유튜브로 이동
            card.style.cursor='pointer'; //커서 모양 변경
            card.addEventListener('click',()=>{
                const songQuery = `${item.title} ${item.singer}`;
                const isMove = confirm(`'${item.title}' 곡으로 이동하겠습니까?`);
                if(isMove){
                    const youtubeUrl=`https://www.youtube.com/results?search_query=${encodeURIComponent(songQuery)}`;
                    window.open(youtubeUrl, '_blank'); //새 탭에서 열기
                }
            });

            container.appendChild(card);
        });
    })
    .catch(error=>{
        console.error('데이터 로드 중 오류:',error);
        container.innerHTML='<p>데이터를 불러오는 데 실패했습니다.</p>';
    });
}
//card(); //함수 호출
document.addEventListener('DOMContentLoaded', card); //페이지 로드 시 실행