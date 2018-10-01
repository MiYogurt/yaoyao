import MDIT from 'markdown-it';
import twemoji from 'twemoji';
import hljs from 'highlight.js';

const md = new MDIT({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    }
});

md.use(require("markdown-it-anchor"))
md.use(require("markdown-it-table-of-contents"))
md.use(require('markdown-it-container'))
md.use(require('markdown-it-emoji'))

md.renderer.rules.emoji = function (token, idx) {
    return twemoji.parse(token[idx].content);
};

export default md

