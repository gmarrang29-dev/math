//mongoDB 연결
const mongoose = require('mongoose')
// Render 배포를 위해 포트 설정을 유연하게 바꿉니다. (아래 app.listen 참고)
mongoose.connect('mongodb+srv://servermaster:c0679577@blogcluster.kdlcehw.mongodb.net/').then(() => console.log('connected')).catch(() => console.log('failed'))            

//mongoDB
const postSchema = new mongoose.Schema({
    title: String,
    contents: String,
    date: String,
    author: String
});

// 'Post'라는 이름의 모델을 생성합니다. (실제 DB에는 posts라는 컬렉션으로 저장됩니다)
const Post = mongoose.model('Post', postSchema);
//oauth
const { OAuth2Client } = require('google-auth-library');
// CLIENT_ID
const CLIENT_ID = '540516487909-ck8376qsm6vullcjemidktqjh0g7meb0.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

//bodyparsar
const path = require('path');
const bodyParser = require('body-parser')

//nunjucksc
const nunjucks = require('nunjucks');

//서버구성
const express = require('express');
const app = express();

//fs
const fs = require('fs');
const { ECDH } = require('crypto');

//구글pass설정 (세션 설정은 라우트보다 위에 있어야 해서 이쪽으로 올렸습니다)
const session = require('express-session');

app.use(session({
    secret: 'my-secret-key', // 암호화 키
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // http 환경일 때 false
}));

// body parser set
app.use(bodyParser.urlencoded({ extended: false })); // express 기본 모듈 사용
app.use(bodyParser.json());

//nunjucks
nunjucks.configure('views',{
    watch: true,//html파일수정시 재 렌더링
    express: app
})
//view engine set
app.set('view engine', 'html');

app.use(express.static('public'));

//data+data.json에 적용
const filePath = path.join(__dirname, 'data' , 'data.json')

//파일과 서버 연결
app.use(express.static(__dirname + '/main'));
app.use(express.static(__dirname + '/write'));
app.use(express.static(__dirname + '/login'));

// 구글 로그인 인증 라우트 (두 개였던 것을 님이 원하신 '세션 저장' 기능이 포함된 것으로 하나만 남겼습니다)
app.post('/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        // 중요: 세션에 유저 정보 저장!
        req.session.user = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        };
        
        res.json({ success: true });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

//기본 시작코드(이정도는 외워라)
// Render 배포 환경을 위해 포트를 변수화합니다.
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', function(){
    console.log(`listen in port ${PORT}`)
});

//누군가가 /a로 들어가면 a에 관한 정보를 띄워주자
app.get('/hello', function( req , res){
    res.send('안녕??')
});

app.get('/', async function(req , res){
    // 파일 읽기 시 에러 방지를 위해 체크 추가
    let datas = [];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        datas = JSON.parse(fileData);
    }
    
    const postsFromDB = await Post.find(); 

    res.render('index.html' , { 
        list: postsFromDB, // 이제 화면에 DB 데이터를 뿌려줍니다!
        user: req.session.user
    });
});


app.get('/write',function(req,res){
    res.render('write.html')
});

app.post('/write',async function(req, res){
    const title = req.body.title;
    const contents = req.body.contents;
    const date = req.body.date; 

    //우선 data.json에 글 저장
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        const datas = JSON.parse(fileData);
        
        //req를 js에 저장(임시)
        datas.push({
            'title' : title,
            'contents' : contents,
            'author' : req.session.user ? req.session.user.name : "익명", // 이 줄만 추가!
        });
        // JSON에 저장
        fs.writeFileSync(filePath, JSON.stringify(datas, null, 2));
    }

    try {
        const newPost = new Post({
            title: title,
            contents: contents,
            date: date,
            author: req.session.user ? req.session.user.name : "익명"
        });
        await newPost.save(); // 실제 DB에 저장
        console.log('MongoDB 저장 성공!');
    } catch (error) {
        console.error('MongoDB 저장 실패:', error);
    }

    // [수정] 응답은 한 번만 보내야 502 에러가 안 납니다! redirect만 남깁니다.
    res.redirect('/');
    
});

app.get('/test',function(req , res){
    res.render('test.html')
})

app.get('/login',function(req,res){
    res.sendFile(__dirname + '/login/login.html')
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});