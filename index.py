from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from models import db, User, TestResult
from spotipy.oauth2 import SpotifyClientCredentials
import requests, os, spotipy, requests, base64

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

SPOTIFY_CLIENT_ID = 'd6956dd3c4e840e8aead776fe5854bbe'
SPOTIFY_CLIENT_SECRET_ID = 'bb619c108b4a4b4ab641fd2ec0af8975'

app.secret_key = 'my_secret_key' # session 비밀키
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) #절대경로 설정

db.init_app(app)

with app.app_context():
    db.create_all()

#스포티파이 토큰 받아오는 코드
def get_spotify_token():
    auth_string = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET_ID}"
    auth_base64 = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')
    
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    
    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print("토큰 발급 실패:", response.json())
        return None

#제목, 가수로 앨범 커버 url 가져옴
def get_spotify_cover_url(title, singer):
    token = get_spotify_token()
    if not token:
        return "/static/img/testimg.png" #토큰이 없으면 임시이미지 넘겨줌
    
    query = f"track:{title} artist:{singer}"
    url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit=1"
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        tracks=data.get('tracks',{}).get('items',[])
        if tracks:
            return tracks[0]['album']['images'][1]['url'] #두번째로 큰 사이즈 이미지 반환
    return "/static/img/testimg.png" #검색 결과 없으면 임시이미지

# 메인 페이지 (로그인 페이지)
@app.route('/', methods=['GET', 'POST'])
def goLogin():  #로그인 함수 이름 변경
    return render_template('login.html')
def kakao_login():
    data = request.json
    return jsonify({'status':'ok', 'nickname': data['nickname']})

# 로그인 파트
@app.route('/login', methods=['POST'])
def login():
    session.clear() #이전 유저 정보 삭제
    data = request.get_json()
    userId = data.get('user_id')
    nickname = data.get('nickname')
    print("세션에 저장된 닉네임:", session.get('nickname')) # 세션에 저장 확인

    # DB에서 사용자 검색
    user = User.query.filter_by(userId=userId, nickname=nickname).first()
    if user:
        #session['user_id'] = userId
        session['user_id_num'] = user.id
        session['user_id'] = user.userId
        session['nickname'] = user.nickname
        return jsonify(success=True, message='로그인 성공!', redirect_url = url_for('protected'))
    else:
        return jsonify(success=False, message='아이디 또는 닉네임이 올바르지 않습니다.')

@app.route('/oauth/callback')
def oauth_callback():
    code = request.args.get('code')
    if not code:
        return redirect(url_for('goLogin'))
    
    #카카오에서 토큰 받기
    data = {
        'grant_type': 'authorization_code',
        'client_id': '7278fa59de7a98d5f8e095662089fec5', #'e53ec257a899fd2adc0aa192036f1967' REST API 키
        'redirect_uri': 'https://songs-for-you-hgbw.onrender.com/oauth', #'http://127.0.0.1:5500/oauth/callback',
        'code': code
    }
    resp = requests.post('https://kauth.kakao.com/oauth/token', data=data)
    token_json = resp.json()
    access_token = token_json.get('access_token')
    if not access_token:
        return redirect(url_for('goLogin'))
    
    # 사용자 정보 요청
    headers = {'Authorization': f'Bearer {access_token}'}
    user_resp = requests.get('https://kapi.kakao.com/v2/user/me', headers=headers)
    user_json = user_resp.json()
    kakao_id = user_json['id']
    kakao_nickname = user_json['kakao_account']['profile']['nickname']

    session.clear() #이전 유저 정보 삭제
    
    # DB에서 유저 검색 후 신규면 회원가입, 기존이면 로그인처럼 처리
    user = User.query.filter_by(userId=str(kakao_id)).first()
    if not user:
        user = User(userId=str(kakao_id), nickname=kakao_nickname)
        db.session.add(user)
        db.session.commit()
    session['user_id'] = user.userId
    session['user_id_num'] = user.id
    session['nickname'] = user.nickname

    # 이제 세션이 생성되었으니 protected로 이동
    return redirect(url_for('protected'))

# 로그아웃
@app.route('/logout', methods=['POST'])
def api_logout():
    session.pop('user_id', None) #session에서 로그인 정보 삭제
    return jsonify(success=True, message='로그아웃 성공!')


# 회원가입 페이지
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        userId = request.form.get('userId')
        nickname = request.form.get('nickname')

        # 중복 체크
        if User.query.filter_by(userId=userId).first():
            return render_template('signup.html', error="이미 존재하는 ID입니다.")
        
        # 회원가입 처리
        user = User(userId=userId, nickname=nickname)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('goLogin'))  # 로그인 페이지로 이동
        #수정요함(구려서)
    return render_template('signup.html')

#protected (로그인 후 페이지)
@app.route('/protected')  
def protected():    
    userId = session.get('user_id')
    if 'user_id' in session:
        return render_template('protected.html', userId = userId)
    else:
        return redirect(url_for('goLogin'))

# 기타 페이지
@app.route('/survey')
def survey():
    return render_template('survey.html')

@app.route('/searchtab')
def searchtab():
    userId=session.get('user_id')
    #js에서 사용할 userId목록 전달
    user_ids=list(user.userId for user in User.query.all())
    print(user_ids) #서버 콘솔 확인용
    return render_template('searchtab.html', user_ids=user_ids, userId=userId)

@app.route('/playlist/<user_id>') #개인 유저별 플레이리스트를 보여주기 위함
def playlist(user_id):
    user = User.query.filter_by(userId=user_id).first()
    #username=session.get('nickname')
    username=user.nickname #검색한 사람의 닉네임을 보여주기 위함
    if not user:
        return redirect(url_for('searchtab'))
    return render_template('playlist.html', user_id=user_id, username=username)

@app.route('/api/get_playlist/<user_id>') #js가 데이터 요청할 전용 경로
def get_playlist_data(user_id):
    user = User.query.filter_by(userId=user_id).first()
    if not user:
        return jsonify([]), 404
    results = TestResult.query.filter_by(user_id=user.id).all()
    data = [{
        'userId': user.userId,
        'title': r.title,
        'singer': r.singer,
        'cover': r.cover
    } for r in results ]
    return jsonify(data)

@app.route('/result', methods = ['GET'])
def result():
    username = session.get('nickname')
    final_type = request.args.get("type") # 8.20 이후 수정한 부분
    mood = request.args.get("mood") # 8.20 이후 수정한 부분
    keyword = request.args.get("keyword")

    return render_template('result.html', username=username, finalType=final_type, mood=mood, keyword=keyword)

@app.route('/save_result', methods=['POST'])
def save_result():
    print("현재 세션: ",session)
    user_db_id = session.get('user_id_num')
    print("가져온 user_id_num: ",user_db_id)
    if not user_db_id:
        return jsonify({'status':'error','message':'로그인 정보가 없습니다.'}),401
    data=request.get_json()
    title = data.get('title')
    singer = data.get('singer')
    
    try:
        current_user=User.query.get(user_db_id)
        if not current_user:
            return jsonify({'status':'error','message':'사용자를 찾을 수 없습니다.'}), 404
        
        cover_url=get_spotify_cover_url(title, singer) #스포티파이 앨범 커버 가져옴
        
        new_result=TestResult(
            user_id=current_user.id,
            nickname=current_user.nickname,
            title=title,
            singer=singer,
            cover=cover_url
        )
        db.session.add(new_result)
        db.session.commit()
        return jsonify({'status':'success','message':'Saved sucessfully','cover_url':cover_url})
    except Exception as e:
        db.session.rollback()
        return jsonify({'status':'error','message':str(e)}), 500

if __name__ == '__main__':
    #app.run(debug=True, port=5500)
    app.run(host='0.0.0.0', port=5500)