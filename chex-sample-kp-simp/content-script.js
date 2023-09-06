const APPID = 'gUxspU.xg66pvU6W5OJMz0vH10FYB.FT4sWcQomZrtmPD6sG.14VlAuMdCGoBuIeMyOpRtlJBlc-';
async function yapikp(query) {
    const url = "https://jlp.yahooapis.jp/KeyphraseService/V2/extract" + "?appid=" + encodeURIComponent(APPID);
    const res = await fetch(url, {
        method: 'POST',
	mode: 'cors',
        body: JSON.stringify({
            "id": "A123",
	    "jsonrpc" : "2.0",
	    "method" : "jlp.keyphraseservice.extract",
            "params" : { "q" : query }
        }),
    });
    return res.json();
}

document.onmouseup = async function() {
    const selected_text = window.getSelection().toString();
    if (! selected_text) return;
    const j = await yapikp(selected_text);
    const s = j['result']['phrases'].map(x => x['text']).join(" / ");
    if (! s.length) return;
    alert(s);
};
