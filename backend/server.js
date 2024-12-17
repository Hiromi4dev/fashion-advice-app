const express = require('express'); // Expressフレームワーク
const bcrypt = require('bcrypt'); // パスワードのハッシュ化
const bodyParser = require('body-parser'); // JSONデータを扱う
const db = require('./database'); // SQLiteデータベースファイル

const app = express();
const port = 3000;

app.use(bodyParser.json()); // JSONリクエストを解析

// ルートエンドポイント
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// ユーザー登録API
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const saltRounds = 10;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // パスワードをハッシュ化してデータベースに保存
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.status(500).json({ message: "Error hashing password" });

        const query = "INSERT INTO users (email, password) VALUES (?, ?)";
        db.run(query, [email, hash], (err) => {
            if (err) {
                return res.status(400).json({ message: "Email already exists" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    });
});

// ユーザー一覧取得API（デバッグ用）
app.get('/users', (req, res) => {
    db.all("SELECT id, email FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch users" });
        }
        res.status(200).json({ users: rows });
    });
});

// サーバー起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
