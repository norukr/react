const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3001;

const db = require('./lib/db');
const sessionOption = require('./lib/sessionOption');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);
app.use(session({  
    key: 'session_cookie_name',
    secret: '~',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.get('/', (req, res) => {    
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.get('/authcheck', (req, res) => {      
    const sendData = { isLogin: "" };
    if (req.session.is_logined) {
        sendData.isLogin = "True";
    } else {
        sendData.isLogin = "False";
    }
    res.send(sendData);
});

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

app.post("/login", (req, res) => { 
    const username = req.body.userId;
    const password = req.body.userPassword;
    const sendData = { isLogin: "" };

    if (username && password) { 
        db.query('SELECT * FROM userTable WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) { 
                bcrypt.compare(password, results[0].password, (err, result) => { 
                    if (result === true) { 
                        req.session.is_logined = true; 
                        req.session.nickname = username;
                        req.session.userId = results[0].id; // 세션에 userId 저장
                        req.session.save(function () {
                            sendData.isLogin = "True";
                            res.send(sendData);
                        });
                        db.query(`INSERT INTO logTable (created, username, action, command, actiondetail) VALUES (NOW(), ?, 'login', ?, ?)`, 
                        [req.session.nickname, '-', `React 로그인 테스트`], function (error, result) { });
                    } else {
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
                        res.send(sendData);
                    }
                });
            } else {
                sendData.isLogin = "아이디 정보가 일치하지 않습니다.";
                res.send(sendData);
            }
        });
    } else {
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!";
        res.send(sendData);
    }
});

app.post("/signin", (req, res) => { 
    const username = req.body.userId;
    const password = req.body.userPassword;
    const password2 = req.body.userPassword2;
    
    const sendData = { isSuccess: "" };

    if (username && password && password2) {
        db.query('SELECT * FROM userTable WHERE username = ?', [username], function(error, results, fields) {
            if (error) throw error;
            if (results.length <= 0 && password == password2) {
                const hasedPassword = bcrypt.hashSync(password, 10); 
                db.query('INSERT INTO userTable (username, password) VALUES(?,?)', [username, hasedPassword], function (error, data) {
                    if (error) throw error;
                    req.session.save(function () {                        
                        sendData.isSuccess = "True";
                        res.send(sendData);
                    });
                });
            } else if (password != password2) { 
                sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다.";
                res.send(sendData);
            } else {
                sendData.isSuccess = "이미 존재하는 아이디 입니다!";
                res.send(sendData);  
            }            
        });        
    } else {
        sendData.isSuccess = "아이디와 비밀번호를 입력하세요!";
        res.send(sendData);  
    }
});

app.get('/posts', (req, res) => {
    if (!req.session.is_logined) {
        return res.status(401).send("Unauthorized");
    }
    
    db.query('SELECT * FROM UserPosts', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

// 게시글 등록 API (로그인된 사용자만 접근 가능)
app.post('/posts', (req, res) => {
    if (!req.session.is_logined) {
        return res.status(401).send("Unauthorized");
    }

    const { title, content } = req.body;
    const userId = req.session.userId; // 세션에서 userId 가져오기

    if (title && content) {
        db.query('INSERT INTO UserPosts (UserID, Title, Content, CreatedAt) VALUES (?, ?, ?, NOW())', 
        [userId, title, content], (error, results) => {
            if (error) throw error;
            res.send({ isSuccess: "True" });
        });
    } else {
        res.send({ isSuccess: "제목과 내용을 입력하세요!" });
    }
});

// 게시글 삭제 API (로그인된 사용자만 접근 가능)
app.delete('/posts/:postId', (req, res) => {
    if (!req.session || !req.session.is_logined) {
        return res.status(401).send("Unauthorized");
    }

    const postId = req.params.postId;

    db.query('DELETE FROM UserPosts WHERE PostID = ?', [postId], (error, results) => {
        if (error) {
            console.error("Error deleting post:", error);
            return res.status(500).send("Internal Server Error");
        }
        res.send({ isSuccess: "True" });
    });
});

// 게시글 수정 API (로그인된 사용자만 접근 가능)
app.put('/posts/:postId', (req, res) => {
    if (!req.session || !req.session.is_logined) {
        return res.status(401).send("Unauthorized");
    }

    const postId = req.params.postId;
    const { title, content } = req.body;

    if (title && content) {
        db.query('UPDATE UserPosts SET Title = ?, Content = ?, UpdatedAt = NOW() WHERE PostID = ?', 
        [title, content, postId], (error, results) => {
            if (error) {
                console.error("Error updating post:", error);
                return res.status(500).send("Internal Server Error");
            }
            res.send({ isSuccess: "True" });
        });
    } else {
        res.send({ isSuccess: "제목과 내용을 입력하세요!" });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
