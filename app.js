const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { error } = require('console');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const jsonFilePath = './data/database.json';
const jsonDB = JSON.parse(fs.readFileSync(jsonFilePath));

app.get('/', (req, res) => generate.webPage(res, 'index'));

app.get('/new', (req, res) => generate.webPage(res, 'new'));

app.get('/help', (req, res) => generate.webPage(res, 'help'));

app.get('/join', (req, res) => generate.webPage(res, 'join'));

app.get('/login', (req, res) => generate.webPage(res, 'login'));

app.get('/thanks', (req, res) => generate.webPage(res, 'thanks'))

app.get('/dashboard', (req, res) => {
    const i = getEvent.index(parseInt(req.query.code));
    if (parseInt(req.cookies.code) !== parseInt(req.query.code)) {
        return res.redirect('/login')
    };
    if (jsonDB.events[i].access !== req.cookies.access) {
        return res.redirect('/login');
    };
    let fArray = []
    jsonDB.events[i].feedback.forEach(feedback => {
        let f = generate.eventFeedbackHtml(feedback.feedback, feedback.name)
        fArray.push(f)
    });
    // res.render('dashboard', {code: req.query.code, eventName: jsonDB.events[getEvent.index(req.query.code)].eventName, fblength: jsonDB.events[i].feedback.length , feedback: fArray.join(' ')});
    generate.webPage(res, 'dashboard', { code: req.query.code, eventName: jsonDB.events[getEvent.index(req.query.code)].eventName, fblength: jsonDB.events[i].feedback.length, feedback: fArray.join(' ') });
});

app.post('/newsession', (req, res) => {
    res.clearCookie('code'); res.clearCookie('access');
    const code = generate.eventCode();
    const accessCode = generate.randomHex();
    const passwordHash = generate.passwordHash(req.body.password);
    jsonDB.events.push(generate.eventJSON(htmlEscape(req.body.eventName), passwordHash, code, accessCode));
    fs.writeFile(jsonFilePath, JSON.stringify(jsonDB, null, 2), (err) => { if (err) console.log(err) });
    res.cookie('code', code, { maxAge: 86400000, httpOnly: true });
    res.cookie('access', accessCode, { maxAge: 86400000, httpOnly: true });
    res.redirect(`/dashboard?code=${code}`);
    // console.log(req.body)
})

app.post('/join', (req, res) => {
    const code = req.body.code;
    res.redirect(`/feedback?code=${code}`);
})

app.post('/login', (req, res) => {
    const code = parseInt(req.body.code)
    if (!getEvent.availableCode().includes(code)) return generate.webPage(res, 'login', { error: generate.errorHtml('Kode yang anda masukkan tidak ditemukan!') });
    bcrypt.compare(req.body.password, getEvent.passwordHash(code), (err, result) => {
        if (err) console.log(err);
        if (result) {
            const accessCode = generate.randomHex();
            const eventIndex = getEvent.index(code);
            res.clearCookie('code'); res.clearCookie('access');
            jsonDB.events[eventIndex].access = accessCode;
            fs.writeFile(jsonFilePath, JSON.stringify(jsonDB, null, 2), (err) => { if (err) console.log(err) });

            res.cookie('code', code, { maxAge: 86400000, httpOnly: true });
            res.cookie('access', accessCode, { maxAge: 86400000, httpOnly: true });
            res.redirect('/dashboard?code=' + code);
        } else {
            // res.render('login', {error: generate.errorHtml('Password yang anda masukkan salah!')});
            generate.webPage(res, login, { error: generate.errorHtml('Password yang anda masukkan salah!') });
        }
    });
});

app.get('/feedback', (req, res) => {
    if (req.query.code === NaN || req.query.code === undefined) {
        // return res.render('join', {error: generate.errorHtml("Masukkan Code terlebih dahulu")});
        return generate.webPage(res, 'join', { error: generate.errorHtml("Masukkan Code terlebih dahulu") })
    } else if (!getEvent.availableCode().includes(parseInt(req.query.code))) {
        // return res.render('join', {error : generate.errorHtml("Code yang anda masukkan salah!") });
        return generate.webPage(res, 'join', { error: generate.errorHtml("Code yang anda masukkan salah!") })
    }
    const code = parseInt(req.query.code);
    const eventIndex = getEvent.index(code);
    const eventName = jsonDB.events[eventIndex].eventName;
    // res.render('feedback', {eventName : eventName });
    generate.webPage(res, 'feedback', { eventName: eventName })
});

app.post('/feedback/send', (req, res) => {
    res.redirect('/thanks');
    const code = req.query.code;
    let name = req.body.name == "" ? "Anonim" : htmlEscape(req.body.name);
    const eventIndex = getEvent.index(code);
    const feedbackMessage = generate.eventFeedback(name, htmlEscape(req.body.feedback));
    jsonDB.events[eventIndex].feedback.push(feedbackMessage)
    fs.writeFile(jsonFilePath, JSON.stringify(jsonDB, null, 2), (err) => { if (err) console.log(err) });


    if (req.body.name.length === 0) name = 'Anonymous';

    // console.log(req.body);
    // console.log(feedbackMessage);
})

app.use((req, res) => res.status(404).render('404'));

const generate = {
    eventJSON: function (eventName, passwordHash, code, access) {
        return {
            eventName: eventName,
            passwordHash: passwordHash,
            code: code,
            feedback: [],
            access: access
        };
    },
    eventFeedback: function (name, feedback) {
        return {
            name: name,
            feedback: feedback
        }
    },
    eventFeedbackHtml: function (feedback, author) {
        return `<div class='feedback'><div class="feedback-content">${feedback}</div> <div class="feedback-author">Ditulis Oleh <span id='author'>${author}</span></div></div>`
    },
    errorHtml: function (errormessage) {
        return `<div class="error"> <span style="color: #ea3323;" class="material-symbols-outlined">info</span><p>${errormessage}</p></div>`
    },
    eventCode: function () {
        let randomInt;
        const existingCodes = getEvent.availableCode();
        do {
            randomInt = Math.floor(100000 + Math.random() * 900000);
        } while (existingCodes.includes(randomInt));
        return randomInt;
    },
    randomHex: function () {
        return Math.random().toString(16).substring(2);
    },
    passwordHash: function (pass) {
        return bcrypt.hashSync(pass, 10);
    },
    webPage: function (res, htmlFile, data) {
        const dataFinal = Object.assign({ nav: generate.navHtml }, data)
        return res.render(htmlFile, dataFinal)
    },
    navHtml: function () {
        return `<nav class="navbar main-grad text-white flex flex-row items-center pl-2 gap-3 fixed inset-x-0 justify-between">
        <div id="title" class="brand flex items-center gap-3">
            <div id="menu" class="h-fit">
                <div id="hamburger-btn" class="hamburger-btn lg:hidden hover:bg-slate-100/15 px-1 rounded-sm">
                    <span class=""></span>
                    <span class=""></span>
                    <span class=""></span>
                </div>
                <div id="hider" class="fixed inset-x-0 hidden bottom-0 bg-slate-950/45">
                    <ul id="sidebar" class="bg-[#6e3f2c] fixed left-0 right-0 w-[60%] sm:w-1/2 md:w-2/5 rounded-r-lg transition-all [&_li:first-child]:mt-2 [&_li:not(:first-child)]:my-2 [&_a]:pl-3 [&_a]:py-3 [&_li]:text-lg h-dvh -translate-x-full [&_a:hover]:bg-secondary-orange/20 [&_a]:rounded-r-full [&_a]:block [&_a]:w-[98%]">
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/Help">Bantuan</a></li>
                        </ul> 
                        <ul>
                            <li class=""><a href="/login">Login</a></li>
                            <li class=""><a href="/new">Buat Sesi Baru</a></li>
                            <li><a href="/join">Masukkan Code</a></li>
                        </ul>
                    </ul>
                </div>
            </div>
            <h2 class="cursor-pointer logo select-none brand text-[1.6rem]"><span>Annon</span><span>Feed</span></h2>
            <div class="border-sep h-8 hidden lg:block"></div>
            <div class="text-base font-normal text-gray-300 items-center hover:text-white [&>div]:hover:border-white [&>div#arrow]:hover:translate-y-[0.18rem] relative [&>div#drop-nav]:hover:block pr-3 cursor-pointer hidden lg:block">
                <span>Page title</span>
                <div id="arrow" class="w-2 h-2 inline-block border-gray-300 border-r border-b rotate-45 -translate-y-0.5 transition-transform ml-2"></div>
                <div id="drop-nav" class="absolute w-max py-3 bg-slate-800 text-slate-50 rounded-md -bottom-[11.6rem] hidden">
                    <ul class="[&>li]:py-1 [&>li:hover]:bg-slate-50/30 [&_a]:pl-3 [&_a]:pr-8 [&_a]:block [&_a]:w-full">
                        <li><a href="/">Home</a></li>
                        <li><a href="/help">Bantuan</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/create">Buat Sesi Baru</a></li>
                        <li><a href="join">Masukkan Code</a></li>
                    </ul>
                </div> 
            </div>
        </div>
        
        
        <div class=" pl-5 px-2 h-full flex items-center gap-3.5 pr-3">
            <a href="/login" class="hover:text-slate-50/70 hover:underline hidden md:block">Login</a>
            <a href="/new" class="text-md py-1.5 px-2.5 rounded-[5px] border-2 border-gray-100 text-slate-50 my-3 hover:border-gray-50/70 hover:text-gray-50/70 hidden md:block">Buat Sesi Baru</a>
            <div class="border-sep h-12"></div>
            <a href="/join" class="text-md py-1.5 px-2.5 rounded-[5px] border-2 border-gray-100 text-slate-50 my-3 hover:border-gray-50/70 hover:text-gray-50/70">Masukkan Kode</a>
        </div>
        
    </nav>`
    }
}

const getEvent = {
    index: function (code) {
        return jsonDB.events.findIndex(event => event.code === parseInt(code));
    },
    availableCode: function () {
        return jsonDB.events.map((event) => event.code);
    },
    passwordHash: function (code) {
        const i = getEvent.index(code)
        return jsonDB.events[i].passwordHash
    }
}

function htmlEscape(text) {
    return String(text)
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

app.listen(port, () => {
    console.log(`Aplikasi berjalan di http://localhost:${port}`);
});