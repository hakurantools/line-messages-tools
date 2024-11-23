const form = document.getElementById("generateForm");
const currentLink = document.getElementById("currentLink");

// フォーム送信時の処理
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const baseMessage = document.getElementById("baseMessage").value;
  const repeatCount = parseInt(document.getElementById("repeatCount").value);

  // サーバーにリクエストを送信
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ baseMessage, repeatCount }),
  });

  if (response.ok) {
    // 新しいリンクを取得して表示
    fetchLink();
  } else {
    currentLink.textContent = "リンク生成に失敗しました。";
  }
});

// サーバーからリンクを取得
async function fetchLink() {
  const response = await fetch("/");
  if (response.ok) {
    const data = await response.json();
    currentLink.textContent = data.link;
    currentLink.href = data.link;
  } else {
    currentLink.textContent = "リンクの取得に失敗しました。";
  }
}
