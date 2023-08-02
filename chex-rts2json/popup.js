document.getElementById("btn-json").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
	target: { tabId: tab.id },
	func: onRun,
	args: ['JSON']
    });
});

document.getElementById("btn-tsv").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
	target: { tabId: tab.id },
	func: onRun,
	args: ['TSV']
    });
});

document.getElementById("btn-text").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
	target: { tabId: tab.id },
	func: onRun,
	args: ['Text']
    });
});

function onRun(fmt) {
    //document.body.style.backgroundColor = "#fcc";

    const posts = Array.from(
	document.querySelectorAll("div.Tweet_Tweet__bq4XS")
    ).map(
	e => {
	    const name = e.querySelector("div.Tweet_info__5pNCA > p > span").textContent;
	    const scname = e.querySelector("div.Tweet_info__5pNCA > p > a").textContent;
	    let reply_id = '';
	    if (e.querySelector("span.Tweet__reply")) {
		reply_id = e.querySelector("span.Tweet__reply > a").textContent;
		e.querySelector("span.Tweet__reply").remove();
	    }
	    const post = e.querySelector(".Tweet_body__XtDoj").textContent;

	    const res = e.querySelector("a.Tweet_icon__ADmHM").getAttribute("data-cl-params").match(/twid:([0-9]+)\D/);
	    const tid = res[1];

	    if (fmt == 'JSON')
		return {'tid': tid, 'name': name, 'screenname': scname,
			'text': post, 'reply_id': reply_id};
	    else if (fmt == 'TSV')
		return [tid, scname, name, post].join("\t");
	    else
		return post;
	}
    );

    //console.log(JSON.stringify(posts, null));
    let ta = document.createElement('textarea');
    ta.id = 'ta';
    if (fmt == 'JSON')
	ta.value = JSON.stringify(posts, null);
    else
	ta.value = posts.join("\n");
    ta.style.position = "fixed";
    ta.style.height = "30em";
    ta.style.width = "10em";
    ta.style.opacity = 0.2;
    ta.style.backgroundColor = "#f0f0f0";
    ta.style.zIndex = 10000;
    ta.style.lineHeight = "1.5em";

    ta.addEventListener ('mouseover',function(){ this.style.opacity=1; });
    ta.addEventListener ('mouseout',function(){ this.style.opacity=0.2; });
    
    if (document.querySelector('textarea#ta'))
	document.querySelector('textarea#ta').remove();
    document.querySelector("div").before(ta);

}

