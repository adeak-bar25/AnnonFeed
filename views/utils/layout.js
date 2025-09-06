<<<<<<< Updated upstream:mod/generate.js
const fs = require('fs');
const getEvent = require('./getEvent')
const bcrypt = require('bcrypt');

const jsonFilePath = './data/database.json';
const jsonDB = function(){
    return JSON.parse(fs.readFileSync(jsonFilePath))
};

// console.log(getEvent)

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
        return `<div class="feedback"><div class="feedback-content">${feedback}</div><div class="feedback-author ">Ditulis Oleh <span class="author">${author}</span></div></div>`
    },
    errorHtml: function (errormessage) {
        return `<div class="error flex gap-2 bg-red-500/40 p-2 rounded-md my-2"> <span style="color: #ea3323;" class="material-symbols-outlined">info</span><p>${errormessage}</p></div>`
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
    webPage: function (res, htmlFile, pageTitle, data) {
        const dataFinal = Object.assign({ nav: generate.navHtml(pageTitle) }, data)
        return res.render(htmlFile, dataFinal)
    },
    navHtml: function (pageTitle) {
        return `<nav class="navbar main-grad text-white flex flex-row items-center pl-2 gap-3 fixed inset-x-0 justify-between z-50">
=======
export const errorElm = (errormessage) => {
    return `<div class="error flex gap-2 bg-red-500/40 p-2 rounded-md my-2"> <span style="color: #ea3323;" class="material-symbols-outlined">info</span><p>${errormessage}</p></div>`;
};

export const eventFeedbackElm = (feedback, author) => {
    return `<div class="feedback"><div class="feedback-content">${feedback}</div><div class="feedback-author ">Ditulis Oleh <span class="author">${author}</span></div></div>`;
};

export const headHtml = (pageTitle) => {
    return `    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="css/style.css">
                    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <meta name="apple-mobile-web-app-title" content="MyWebSite" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <script src="script.js" defer></script>
                    <title>${pageTitle} | AnnonFeed</title>`;
};

export const navBarElm = function (pageTitle) {
    return `<nav class="navbar main-grad text-white flex flex-row items-center pl-2 gap-3 fixed inset-x-0 justify-between z-50">
>>>>>>> Stashed changes:views/utils/layout.js
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
<<<<<<< Updated upstream:mod/generate.js
                        </ul> 
=======
                        </ul>
>>>>>>> Stashed changes:views/utils/layout.js
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
                <span>${pageTitle}</span>
                <div id="arrow" class="w-2 h-2 inline-block border-gray-300 border-r border-b rotate-45 -translate-y-0.5 transition-transform ml-2"></div>
                <div id="drop-nav" class="absolute w-max py-3 bg-slate-800 text-slate-50 rounded-md -bottom-[11.6rem] hidden">
                    <ul class="[&>li]:py-1 [&>li:hover]:bg-slate-50/30 [&_a]:pl-3 [&_a]:pr-8 [&_a]:block [&_a]:w-full">
                        <li><a href="/">Home</a></li>
                        <li><a href="/help">Bantuan</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/new">Buat Sesi Baru</a></li>
                        <li><a href="join">Masukkan Code</a></li>
                    </ul>
<<<<<<< Updated upstream:mod/generate.js
                </div> 
            </div>
        </div>
        
        
=======
                </div>
            </div>
        </div>


>>>>>>> Stashed changes:views/utils/layout.js
        <div class=" pl-5 px-2 h-full flex items-center gap-3.5 pr-3">
            <a href="/login" class="hover:text-slate-50/70 hover:underline hidden md:block">Login</a>
            <a href="/new" class="text-md py-1.5 px-2.5 rounded-[5px] border-2 border-gray-100 text-slate-50 my-3 hover:border-gray-50/70 hover:text-gray-50/70 hidden md:block">Buat Sesi Baru</a>
            <div class="border-sep h-12"></div>
            <a href="/join" class="text-md py-1.5 px-2.5 rounded-[5px] border-2 border-gray-100 text-slate-50 my-3 hover:border-gray-50/70 hover:text-gray-50/70 max-xs:text-xs">Masukkan Kode</a>
        </div>
<<<<<<< Updated upstream:mod/generate.js
        
    </nav>`
    }
}

module.exports = generate
=======

    </nav>`;
};
>>>>>>> Stashed changes:views/utils/layout.js
