function main() {

    let copy_btn = document.createElement('button');
    copy_btn.id = 'copy_btn';
    copy_btn.innerHTML = "JSON";
    copy_btn.onclick = () => conv_and_copy("JSON");
    copy_btn.style.position = "fixed";
    copy_btn.style.top = "0";
    copy_btn.style.zIndex = 10001;
    document.querySelector("noscript").before(copy_btn);
    
    let tsv_btn = document.createElement('button');
    tsv_btn.innerHTML = "TSV";
    tsv_btn.onclick = () => conv_and_copy("TSV");
    tsv_btn.style.position = "fixed";
    tsv_btn.style.top = "1.8rem";
    tsv_btn.style.zIndex = 10001;
    document.querySelector("noscript").before(tsv_btn);

    let text_btn = document.createElement('button');
    text_btn.innerHTML = "Text";
    text_btn.onclick = () => conv_and_copy("Text");
    text_btn.style.position = "fixed";
    text_btn.style.top = "3.6rem";
    text_btn.style.zIndex = 10001;
    document.querySelector("noscript").before(text_btn);

    let disp_num = document.createElement('span');
    disp_num.id = 'num_of_items';
    disp_num.style.position = "fixed";
    disp_num.style.top = "5.4rem";
    disp_num.style.padding = "0 0.5rem";
    disp_num.style.zIndex = 10001;
    disp_num.style.color = "gray";
    disp_num.style.fontWeight = "bold";
    disp_num.style.fontSize = "small";
    document.querySelector("noscript").before(disp_num);
    disp_num.onclick = () => show_viewwindow();
};

main();

let posts_store = {};
let str_to_clipboard = '';

function conv_and_copy(fmt) {
    let jo = Object.values(posts_store);
    jo.sort((a,b) => a.tid - b.tid);
    let copy_str = '';
    if (fmt == 'JSON') {
	copy_str = JSON.stringify(jo, null);
    } else if (fmt == 'TSV') {
	copy_str = jo.map(x => {
	    const oneline = x.text.replace(/\n/g, ' ');
	    return [x.tid, x.screenname, x.name,
		    oneline, x.datetime].join("\t");
	}).join("\n");
    } else if (fmt == 'Text') {
	copy_str = jo.map(x => {
	    const oneline = x.text.replace(/\n/g, ' ');
	    return oneline;
	}).join("\n");
    }
    navigator.clipboard.writeText(copy_str).then(
	() => document.getElementById('num_of_items').innerHTML +=
	    "<br>クリップボードに<br>コピーしました",
        () => alert("クリップボードにコピーできませんでした")
    );
    str_to_clipboard = copy_str;
}

document.onscroll = function() {
    console.log("X to JSON working...");

    const posts = Array.from(
	document.querySelectorAll("div[data-testid=cellInnerDiv] div.r-kzbkwu.r-1iusvr4")
    ).filter(
	e => e.children[0].querySelector("a[dir=ltr]")
    ).forEach(
	e => {
	    let path = e.children[0].querySelector("a[dir=ltr]").getAttribute("href");
	    let [_all, scname, tid] = path.match(/\/([^\/]+)\/status\/([0-9]+)$/);
	    let name = e.children[0].querySelector("div[dir=ltr] span.r-1tl8opc").textContent;
	    const datetime = e.children[0].querySelector("time").getAttribute("datetime");
	    const post = Array.from(e.childNodes).slice(1, e.childElementCount - 1).map(x => {
		let s = x.innerText;
		// "返信先: \n@ohga_pharmacy\nさん"
		s = s.replace(/^返信先: \n(@.+?)\nさん$/, '$1');
		// "引用ツイート\ncarolis\n@bebaaguax\n·\n2021年6月1日\n"
		s = s.replace(/^引用ツイート\n.+?\n(@.+?)\n·\n[0-9].+?\n/, 'RT $1\n');
		return s;
	    }).join("\n");
	    
	    if (tid in posts_store == false)
		posts_store[tid] = {
		    'tid': tid,
		    'name': name,
		    'screenname': scname,
		    'text': post,
		    'datetime': datetime
		};
	}
    );
    
    // 保存された件数の表示
    document.getElementById('num_of_items').innerHTML = Object.keys(posts_store).length;
};


function show_viewwindow() {
    w = window.open("", "ClipboardView","width=600,height=600");
    w.document.open();
    w.document.write(`<html><head><style>
* { padding: 0; margin: 0; font-family: Consolas, Monospace; line-height:2em; }
textarea { width: 100%; height: 100%; padding: 1em; border: none; }
textarea:focus { outline: none; }
</style></head>
<body><textarea>` + str_to_clipboard + "</textarea></body></html>");
    w.document.close();
}
