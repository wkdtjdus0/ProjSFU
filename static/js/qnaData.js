const qnalist = [
    {
        q: '1. 어떤 분위기의 음악을 자주 듣나요?',
        a: [
            { answer: '차분하고 편안한 분위기', type: ['chillout', 'ambient', 'acoustic', 'folk'], mood: -1 },
            { answer: '에너지 넘치고 신나는 분위기', type: ['dance', 'electronic', 'house', 'techno'], mood: 1 },
            { answer: '감성적이고 서정적인 분위기', type: ['indie', 'singer-songwriter', 'acoustic'], mood: -1 },
            { answer: '어둡고 무거운 분위기', type: ['metal', 'industrial', 'heavy metal'], mood: -1 },
            { answer: '실험적이고 독특한 분위기', type: ['experimental', 'psychedelic', 'post-rock'], mood: 0 }
        ]
    },
    {
        q: '2. 음악을 들을 때 보통 어떤 활동을 하나요?',
        a: [
            { answer: '공부', type: ['instrumental', 'ambient', 'classical', 'chillout'], mood: -1 },
            { answer: '운동', type: ['electronic', 'dance', 'techno', 'Hip-Hop'], mood: 1 },
            { answer: '출퇴근', type: ['pop', 'indie', 'house'], mood: 0 },
            { answer: '산책', type: ['folk', 'singer-songwriter', 'acoustic'], mood: -1 },
            { answer: '휴식', type: ['ambient', 'chillout', 'jazz', 'soul'], mood: 1 }
        ]
    },
    {
        q: '3. 하루 중 음악을 가장 자주 듣는 시간대는 언제인가요?',
        a: [
            { answer: '아침', type: ['acoustic', 'folk', 'indie', 'chillout'], mood: 1 },
            { answer: '점심', type: ['pop', 'dance', 'electronic'], mood: 1 },
            { answer: '저녁', type: ['jazz', 'soul', 'alternative rock', 'rock'], mood: -1 },
            { answer: '밤', type: ['ambient', 'experimental', 'post-rock', 'classical'], mood: -1 },
            { answer: '새벽', type: ['ambient', 'techno', 'chillout', 'industrial'], mood: 0 }
        ]
    },
    {
        q: '4. 선호하는 음악 장르는 무엇인가요?',
        a: [
            { answer: '록/메탈', type: ['rock', 'metal', 'heavy metal'], mood: -1 },
            { answer: '팝/인디 팝', type: ['pop', 'indie', 'alternative rock', 'new wave'], mood: 0 },
            { answer: '일렉트로닉/댄스', type: ['electronic', 'dance', 'techno', 'house'], mood: 1 },
            { answer: '힙합', type: ['Hip-Hop', 'soul', 'industrial'], mood: 1 },
            { answer: '재즈/클래식', type: ['jazz', 'classical', 'instrumental'], mood: -1 }
        ]
    },
    {
        q: '5. 어떤 감정일 때 음악을 듣나요?',
        a: [
            { answer: '기분이 좋을 때', type: ['pop', 'dance', 'indie', 'house'], mood: 1 },
            { answer: '우울하거나 슬플 때', type: ['singer-songwriter', 'ambient', 'folk'], mood: -1 },
            { answer: '스트레스를 받을 때', type: ['chillout', 'ambient', 'instrumental', 'classical'], mood: -1 },
            { answer: '긴장을 풀고 싶을 때', type: ['jazz', 'soul', 'acoustic'], mood: -1 },
            { answer: '감정을 더 느끼고 싶을 때', type: ['experimental', 'post-rock', 'psychedelic', 'alternative rock'], mood: 0 }
        ]
    },
    {
        q: '6. 어떤 시대의 음악을 좋아하나요?',
        a: [
            { answer: '1980년대', type: ['rock', 'new wave', 'pop'], mood: 0 },
            { answer: '1990년대', type: ['alternative rock', 'Hip-Hop', 'metal'], mood: 0 },
            { answer: '2000년대 이후', type: ['indie', 'electronic', 'house', 'pop'], mood: 0 },
            { answer: '시대 상관 없이 다양한 음악', type: ['experimental', 'jazz', 'folk', 'classical'], mood: 0 }
        ]
    },
    {
        q: '7. 다음 중 가장 끌리는 키워드는?',
        a: [
            { answer: '몽환적', type: ['ambient', 'psychedelic', 'post-rock'], mood: -1 },
            { answer: '열정적', type: ['metal', 'Hip-Hop', 'dance'], mood: 1 },
            { answer: '감성적', type: ['singer-songwriter', 'indie', 'folk', 'acoustic'], mood: -1 },
            { answer: '중후하고 깊은', type: ['jazz', 'classical', 'blues', 'soul'], mood: -1 },
            { answer: '트렌디하고 세련된', type: ['electronic', 'house', 'techno'], mood: 1 }
        ]
    }
];

/*
태그	            등장 횟수
indie	            7
ambient	            6
chillout	        6
pop	                6
folk	            6
acoustic	        6
jazz	            6
classical	        6
dance	            6
house	            5
techno	            5
soul	            5
hip-hop	            4
metal	            4
post-rock	        4
singer-songwriter	4
alternative rock	4
experimental	    4
electronic	        4
industrial	        3
instrumental	    3
psychedelic	        3
rock	            3
new wave	        2
heavy metal	        2
*/