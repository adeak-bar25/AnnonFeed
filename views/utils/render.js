import * as layout from "./layout.js";

export default function (res, htmlFile, pageTitle, data = {}) {
    return res.render(
        htmlFile,
        Object.assign(
            {
                head: layout.headHtml(pageTitle),
                nav: layout.navBarElm(pageTitle)
            },
            data
        )
    );
}
