const remark_html = require('remark-html');
const remark_markdown = require('remark-parse');
const remark_unified = require('unified');
var sanitizeHtml = require('sanitize-html');

function log10(str) {
    const leadingDigits = parseInt(str.substring(0, 4));
    const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
    const n = str.length - 1;
    return n + (log - parseInt(log));
}

const repLog10 = rep2 => {
    if (rep2 == null) return rep2;
    let rep = String(rep2);
    const neg = rep.charAt(0) === '-';
    rep = neg ? rep.substring(1) : rep;

    let out = log10(rep);
    if (isNaN(out)) out = 0;
    out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
    out = (neg ? -1 : 1) * out;
    out = out * 9 + 25; // 9 points per magnitude. center at 25
    // base-line 0 to darken and < 0 to auto hide (grep rephide)
    out = parseInt(out);
    return out;
};


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function parse_imgs(text) {
    let finaltext = "";
    const split = text.split("<img");

    if (split.length > 1) {
        for (let i = 0; i < split.length; i++) {
            if (i === 0) {
                finaltext += split[0].substring(0, split[0].length);
                continue;
            }

            let image =  split[i].substr(6)
            image = image.substr(0, image.indexOf('"'));

            finaltext += "<a style='overflow-wrap: break-word;' href='"+image + "'>image</a> ";

        }
        return finaltext;
    }

    return text;
}

function count_votes(votes)
{
    let upvotes = 0;
    let downvotes = 0;

    votes.map(vote => {
        if (vote.percent > 0)
            upvotes += 1;
        else
            downvotes += 1;
    });

    return {upvotes : upvotes, downvotes : downvotes};

}


function parse_text(text)
{
    return new Promise(resolve => {
        remark_unified()
            .use(remark_markdown)
            .use(remark_html)
            .process(text, function (err, file) {
                if (err) {
                    console.error(err);
                    return resolve("[Comment failed to load]")
                }

                text = String(file);
                text = replaceAll(text, "\n", "<br/>");
                text = text.replace(/(@[a-zA-Z-]{3,16})/ig, "<a href='https://steemit.com/$1'>$1</a>");
                let cleaned_html = sanitizeHtml(text, {
                    allowedTags: ['a', 'b', 'i', 'strong', 'em', 'strike', 'br', 'img', 'div', 'center'],
                    allowedAttributes: {
                        'a': [ 'href' ],
                        'img' : ['src'],
                        'div' : ['class']
                    }
                });

                cleaned_html = parse_imgs(cleaned_html);


                return resolve(cleaned_html);
            })
    });
}

function compare_votes(a,b) {
    if (a.value < b.value)
        return 1;
    if (a.value > b.value)
        return -1;
    return 0;
}

module.exports = {
    repLog10,
    parse_text,
    compare_votes
}