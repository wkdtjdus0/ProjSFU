const qna=document.querySelector("#qna");
const endpoint=7;
const userSelections=[];

function calMood(selections){ //mood 점수 계산
    const finalMoodScore=selections.reduce((acc, cur) => acc+cur.mood, 0);
    const TypeCnt=new Map();
    selections.flatMap(selection => selection.type).forEach(type => {
        TypeCnt.set(type, (TypeCnt.get(type)||0)+1);
    });

    let finalType='';
    let maxCnt=0;
    for(let[type, cnt] of TypeCnt.entries()){
        if(cnt>maxCnt){
            maxCnt=cnt;
            finalType=type;
        }
    }
    return {finalMoodScore, finalType};
}

function getMoodDescription(score){
    if(score>=5) return 'energetic';
    if(score>=3) return 'happy';
    if(score>=1) return 'chill';
    if(score===0) return 'relaxed';
    if(score>=-2) return 'mellow';
    if(score>=-4) return 'sad';
    return 'angry';
}

function goResult(){
    const { finalMoodScore, finalType } = calMood(userSelections);
    const moodDesc = getMoodDescription(finalMoodScore);
    const seventhAnswer = userSelections[6] ? userSelections[6].answer : '';

    // Flask에 결과 전달 (GET 방식)
   const url = `/result?type=${encodeURIComponent(finalType)}`
        + `&mood=${encodeURIComponent(moodDesc)}`
        + `&keyword=${encodeURIComponent(seventhAnswer)}`;
    window.location.href = url;
}

function addAnswer(answerText, qIdx, idx, aBox){
    const answer=document.createElement('button');
    answer.classList.add('answerlist');
    answer.classList.add('mx-auto');
    answer.classList.add('my-3');
    answer.classList.add('py-1');
    answer.innerHTML=answerText;
    aBox.appendChild(answer);
    answer.addEventListener("click", function(){
        userSelections[qIdx]=qnalist[qIdx].a[idx]; //인덱스에 맞는 답변 객체 저장
        goNext(++qIdx);
    }, false);
}

function goNext(qIdx){
    if(qIdx===endpoint){
        goResult();
        return;
    }
    const q=document.querySelector('.qBox');
    const aBox=document.querySelector('.aBox');
    aBox.innerHTML=''; //답변 목록 비움
    q.innerHTML=qnalist[qIdx].q;
    qnalist[qIdx].a.forEach((answerData, i) => {
        addAnswer(answerData.answer, qIdx, i, aBox); //인자로 aBox를 넘겨줌 위에서 한번만 찾음
    });

    const status=document.querySelector('.statusBar');
    status.style.width=(100/endpoint)*(qIdx+1)+'%';
}

function goBegin(){ //display 사용 안 하고, goNext함수 시작하게 하는 함수로 변경
    let qIdx=0;
    goNext(qIdx);
}