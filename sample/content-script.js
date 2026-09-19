// 左上にボタンを設置する
let btn = document.createElement('button');
btn.style.position = "absolute";
btn.style.fontSize = "x-large";
btn.style.top = "0";
btn.style.left = "0";
btn.style.zIndex = "1000000";
btn.innerHTML = '赤くする';
document.body.style.position = "relative";
document.body.appendChild(btn);

// ボタンを押した時の処理: 全ての要素の背景を赤色にする
btn.addEventListener('click', () =>
    document.querySelectorAll('*').forEach(
        e => e.style.backgroundColor = 'red'
    )
);
