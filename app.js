const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const generate = require('./mod/generate')
const getEvent = require('./mod/getEvent')


const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const jsonFilePath = './data/database.json';
const jsonDB = function(){
    return JSON.parse(fs.readFileSync(jsonFilePath))
};


app.get('/', (req, res) => generate.webPage(res, 'index', 'Home'));

app.get('/new', (req, res) => generate.webPage(res, 'new', 'Buat Sesi Baru'));

app.get('/help', (req, res) => generate.webPage(res, 'help', 'Bantuan'));

app.get('/join', (req, res) => generate.webPage(res, 'join', 'Masuk ke Event'));

app.get('/login', (req, res) => generate.webPage(res, 'login', 'Login'));

app.get('/thanks', (req, res) => generate.webPage(res, 'thanks', 'Terima Kasih'))

app.get('/dashboard', (req, res) => {
    const i = getEvent.index(parseInt(req.query.code));
    if (parseInt(req.cookies.code) !== parseInt(req.query.code)) {
        return res.redirect('/login')
    };

    if (jsonDB().events[i].access !== req.cookies.access) {
        return res.redirect('/login');
    };
    let fArray = []
    jsonDB().events[i].feedback.forEach(feedback => {
        let f = generate.eventFeedbackHtml(feedback.feedback, feedback.name)
        fArray.push(f)
    });
    // res.render('dashboard', {code: req.query.code, eventName: jsonDB.events[getEvent.index(req.query.code)].eventName, fblength: jsonDB.events[i].feedback.length , feedback: fArray.join(' ')});
    generate.webPage(res, 'dashboard', 'Dashboard', { code: req.query.code, eventName: jsonDB().events[getEvent.index(req.query.code)].eventName, fblength: jsonDB().events[i].feedback.length, feedback: fArray.join(' ') });
});

app.post('/newsession', (req, res) => {
    res.clearCookie('code'); res.clearCookie('access');
    const code = generate.eventCode();
    const accessCode = generate.randomHex();
    const passwordHash = generate.passwordHash(req.body.password);
    const currDb = {...jsonDB()} 
    currDb.events.push(generate.eventJSON(htmlEscape(req.body.eventName), passwordHash, code, accessCode));
    fs.writeFileSync(jsonFilePath, JSON.stringify(currDb, null, 2));
    res.cookie('code', code, { maxAge: 86400000, httpOnly: true });
    res.cookie('access', accessCode, { maxAge: 86400000, httpOnly: true });
    res.redirect(`/dashboard?code=${code}`);
})

app.post('/join', (req, res) => {
    const code = req.body.code;
    res.redirect(`/feedback?code=${code}`);
})

app.post('/login', (req, res) => {
    const code = parseInt(req.body.code)
    if (!getEvent.availableCode().includes(code)) return generate.webPage(res, 'login', 'Login', { error: generate.errorHtml('Kode yang anda masukkan tidak ditemukan!') });
    bcrypt.compare(req.body.password, getEvent.passwordHash(code), (err, result) => {
        if (err) console.err(err);
        if (result) {
            const accessCode = generate.randomHex();
            const eventIndex = getEvent.index(code);
            res.clearCookie('code'); res.clearCookie('access');
            const curr = jsonDB()
            curr.events[eventIndex].access = accessCode;
            fs.writeFileSync(jsonFilePath, JSON.stringify(curr, null, 2));

            res.cookie('code', code, { maxAge: 86400000, httpOnly: true });
            res.cookie('access', accessCode, { maxAge: 86400000, httpOnly: true });
            res.redirect('/dashboard?code=' + code);
        } else {
            // res.render('login', {error: generate.errorHtml('Password yang anda masukkan salah!')});
            generate.webPage(res, 'login', 'Login', { error: generate.errorHtml('Password yang anda masukkan salah!') });
        }
    });
});

app.get('/feedback', (req, res) => {
    if (req.query.code === NaN || req.query.code === undefined) {
        // return res.render('join', {error: generate.errorHtml("Masukkan Code terlebih dahulu")});
        return generate.webPage(res, 'join', 'Masuk ke Event', { error: generate.errorHtml("Masukkan Code terlebih dahulu") })
    } else if (!getEvent.availableCode().includes(parseInt(req.query.code))) {
        // return res.render('join', {error : generate.errorHtml("Code yang anda masukkan salah!") });
        return generate.webPage(res, 'join', 'Masuk ke Event', { error: generate.errorHtml("Code yang anda masukkan salah!") })
    }
    const code = parseInt(req.query.code);
    const eventIndex = getEvent.index(code);
    const eventName = jsonDB().events[eventIndex].eventName;
    // res.render('feedback', {eventName : eventName });
    generate.webPage(res, 'feedback', 'Event Feedback', { eventName: eventName })
});

app.post('/feedback/send', (req, res) => {
    const code = req.query.code;
    let name = req.body.name == "" ? "Anonim" : htmlEscape(req.body.name);
    const feedbackMessage = generate.eventFeedback(name, htmlEscape(req.body.feedback));
    const eventIndex = getEvent.index(code);
    const curr = jsonDB()
    curr.events[eventIndex].feedback.push(feedbackMessage)
    try{
        fs.writeFileSync(jsonFilePath, JSON.stringify(curr, null, 2));
    }catch(err){
        throw err
    }
    res.redirect('/thanks');



})

app.use((req, res) => {
    res.status(404)
    generate.webPage(res, "notfound", "Halaman Tidak Ditemukan")
});


function htmlEscape(text) {
    return String(text)
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

app.listen(port, () => {
    console.log(`Aplikasi berjalan di http://localhost:${port}`);
});