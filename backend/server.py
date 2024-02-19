from fastapi import FastAPI, HTTPException,  Header
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import bcrypt
from datetime import datetime, timedelta
from typing import Union, Any
from jose import jwt
import jose
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
from typing import Optional

load_dotenv()
import os

DATABASE_URL = os.environ.get("DATABASE_URL")
DATABASE_NAME = os.environ.get("DATABASE_NAME")
DATABASE_USERNAME = os.environ.get("DATABASE_USERNAME")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_PORT = os.getenv("DATABASE_PORT")

conn = psycopg2.connect(host=DATABASE_URL, dbname=DATABASE_NAME, user=DATABASE_USERNAME, password=DATABASE_PASSWORD, port=DATABASE_PORT)

cur = conn.cursor()

cur.execute("""CREATE TABLE IF NOT EXISTS popbottle_users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash bytea NOT NULL,
    discord_id INT NULL,
    bottles_saved INT DEFAULT 0
    );
    """)

cur.execute("""CREATE TABLE IF NOT EXISTS bottles_saved (
    action_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    bottles_saved INT,
    description VARCHAR(256) NULL,
    action_date DATE DEFAULT CURRENT_DATE
    );
    """)
conn.commit()

app = FastAPI()

origins = [
    "*",
]

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'username' : username, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token
    except jwt.ExpiredSignatureError:
        return None
    except jose.exceptions.JWTError:
        return None

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    username: str
    password: str

class SaveBottle(BaseModel):
    BottlesSaved: int
    description: Optional[str] = None

@app.post("/register/")
async def create_user(user_data: UserCreate):
    cur.execute('''SELECT COUNT(*) FROM popbottle_users WHERE username = %s;''',(user_data.username,))
    taken = cur.fetchone()[0]
    print(taken)
    if taken:
        raise HTTPException(status_code=400, detail="Username already exists")
    else:
        hashedpw = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
        print(hashedpw,0)
        cur.execute("""INSERT INTO popbottle_users (username, password_hash) VALUES (%s, %s)""",(user_data.username, hashedpw))
        conn.commit()
    return user_data

@app.post("/login/")
async def create_user(user_data: UserCreate):
    cur.execute('''SELECT COUNT(*) FROM popbottle_users WHERE username = %s;''',(user_data.username,))
    taken = cur.fetchone()[0]
    print(taken)
    if not taken:
        raise HTTPException(status_code=400, detail="Username or Password Incorrect")
    else:
        cur.execute("""SELECT password_hash FROM popbottle_users WHERE username = %s""",(user_data.username,))
        # conn.commit()
        hashed = bytes(cur.fetchone()[0])
        print(hashed,1)
        # input()
        if bcrypt.checkpw(user_data.password.encode('utf-8'), hashed):
            print("It matches")
            cur.execute("""SELECT user_id FROM popbottle_users WHERE username = %s""",(user_data.username,))
            user_id = cur.fetchone()[0]
            token = create_access_token(user_data.username,user_id,timedelta(minutes=20))
            print(verify_token(token ), 'e')
            return {"token" : token}
        else:
            print("It does not match")
    return bcrypt.checkpw(user_data.password.encode('utf-8'), hashed)


@app.get("/dashboard")
async def protected_endpoint(token: str = Header(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Token header is missing")
    
    valid = verify_token(token )
    if valid == None:
        raise HTTPException(status_code=401, detail="Invalid token")

    username = valid["username"]
    print(username)
    cur.execute("""select username, bottles_saved  from popbottle_users WHERE username=%s;""", (username,))
    data = cur.fetchone()
    username = data[0]
    bottles_saved = data[1]
    return {"username": username, "bottles_saved" : bottles_saved}

@app.get("/validate")
async def validate(token: str = Header(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Token header is missing")
    
    valid = verify_token(token )
    if valid == None:
        raise HTTPException(status_code=401, detail="Invalid token")
    username = valid["username"]

    return {"message": f"Hello, {username}! You are logged in!"}

@app.post("/savebottle")
async def protected_endpoint(save_bottle: SaveBottle, token: str = Header(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Token header is missing")
    
    valid = verify_token(token )
    if valid == None:
        raise HTTPException(status_code=401, detail="Invalid token")

    username = valid["username"]
    
    cur.execute("""UPDATE popbottle_users
    SET bottles_saved = bottles_saved + %s
    WHERE user_id = %s;""",(save_bottle.BottlesSaved, valid["id"],))
    conn.commit()
    cur.execute("""INSERT INTO bottles_saved (username, bottles_saved, description) VALUES (%s, %s, %s)""",
                (username, save_bottle.BottlesSaved, save_bottle.description))
    conn.commit()
    return save_bottle

@app.get("/savebottle")
async def getbottles():
    cur.execute("""select username, bottles_saved, description, action_date from bottles_saved ORDER BY action_id DESC;""")
    latest =  cur.fetchmany(30)
    return latest