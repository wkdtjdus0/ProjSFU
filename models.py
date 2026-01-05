from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user_table'

    id = db.Column(db.Integer, primary_key = True)
    userId = db.Column(db.String(32), unique = True, nullable = False) #id
    nickname = db.Column(db.String(32), nullable = False) #nickname

    #user.test_results로 해당 유저의 모든 테스트 결과에 접근할 수 있다.
    test_results = db.relationship('TestResult', backref='user', lazy=True)

    def __init__(self, userId, nickname):
        self.userId = userId
        self.nickname = nickname
    

#TO-DO: 
#닉네임 유니크하게 해야하네 닉네임으로 검사할거니까 
#카톡으로 가입할때 닉네임이 겹치면 랜덤한 닉네임을 부여하고, 그걸 나중에 고칠 수 있게 하는 게 낫겠다.

class TestResult(db.Model):
    __tablename__ = 'user_result'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)  # 외래키 (User.id 참조)
    test_date = db.Column(db.DateTime, default=datetime.utcnow)
    title = db.Column(db.String(128), nullable=False)
    singer = db.Column(db.String(128), nullable = False) #기존 desc 삭제(singer 추가)
    cover = db.Column(db.String(256))

    # 닉네임은 굳이 외래키로 관리할 필요 없이 복사/저장해도 됨
    nickname = db.Column(db.String(64), nullable=False)