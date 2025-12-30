export default function (res, htmlFile, pageTitle, data = {}) {
    return res.render(htmlFile, Object.assign({ pageTitle }, data));
}
