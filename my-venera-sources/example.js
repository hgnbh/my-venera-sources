/**
 * Venera 漫画源最小模板
 *
 * 使用方法：
 *   1. 复制本文件，改名为你的网站名（比如 kanman.js）
 *   2. 修改 name / key / url 三个字段
 *   3. 把下面的 https://example.com 换成目标网站的真实地址
 *   4. 用浏览器 F12 查看目标站的 DOM 结构，替换 querySelector 里的选择器
 *   5. 在 index.json 里加一条记录
 *
 * API 文档：
 *   https://github.com/venera-app/venera/blob/master/doc/comic_source.md
 *   https://github.com/venera-app/venera/blob/master/doc/js_api.md
 */

class ExampleSource extends ComicSource {
  // ===== 必填：基础信息 =====
  name = "示例漫画源";
  key = "example";                       // 全局唯一，别和别人重复
  version = "1.0.0";
  minAppVersion = "1.0.0";
  // 本文件公开访问地址（push 到 GitHub 后用 jsDelivr 生成）
  url = "https://cdn.jsdelivr.net/gh/你的用户名/你的仓库名@main/example.js";

  // 站点常量（按需修改）
  static baseUrl = "https://example.com";
  static headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "zh-CN,zh;q=0.9",
  };

  // ===== 探索页（App 首页展示） =====
  explore = [
    {
      title: "最新更新",
      type: "multiPageComicList",
      load: async (page) => {
        let res = await Network.get(
          `${ExampleSource.baseUrl}/list?page=${page}`,
          ExampleSource.headers
        );
        let doc = new HtmlDocument(res.body);
        let comics = doc.querySelectorAll(".book-item").map(
          (e) =>
            new Comic({
              id: e.querySelector("a").attributes["href"], // 漫画详情页 URL
              title: e.querySelector(".title").text.trim(),
              cover: e.querySelector("img").attributes["src"],
            })
        );
        return { comics, maxPage: 20 };
      },
    },
  ];

  // ===== 搜索 =====
  search = {
    load: async (keyword, options, page) => {
      let res = await Network.get(
        `${ExampleSource.baseUrl}/search?q=${encodeURIComponent(keyword)}&page=${page}`,
        ExampleSource.headers
      );
      let doc = new HtmlDocument(res.body);
      let comics = doc.querySelectorAll(".book-item").map(
        (e) =>
          new Comic({
            id: e.querySelector("a").attributes["href"],
            title: e.querySelector(".title").text.trim(),
            cover: e.querySelector("img").attributes["src"],
          })
      );
      return { comics, maxPage: 1 };
    },
    optionList: [],
  };

  // ===== 漫画详情 + 章节 =====
  comic = {
    loadInfo: async (id) => {
      let res = await Network.get(id, ExampleSource.headers);
      let doc = new HtmlDocument(res.body);

      // 章节列表：Map<章节URL, 章节名>
      let chapters = new Map();
      doc.querySelectorAll(".chapter-list a").forEach((a) => {
        chapters.set(a.attributes["href"], a.text.trim());
      });

      return new ComicDetails({
        title: doc.querySelector("h1").text.trim(),
        cover: doc.querySelector(".cover img").attributes["src"],
        description: doc.querySelector(".desc")?.text?.trim() ?? "",
        chapters: chapters,
      });
    },

    loadEp: async (comicId, epId) => {
      let res = await Network.get(epId, {
        ...ExampleSource.headers,
        referer: comicId,
      });
      let doc = new HtmlDocument(res.body);
      let images = doc
        .querySelectorAll(".reader img")
        .map((e) => e.attributes["data-src"] || e.attributes["src"])
        .filter((u) => u && /\.(jpg|jpeg|png|webp)/i.test(u));
      return { images };
    },

    // 图片防盗链时在这里加 Referer
    onImageLoad: (url, comicId, epId) => {
      return {
        headers: {
          "Referer": `${ExampleSource.baseUrl}/`,
          "User-Agent": ExampleSource.headers["User-Agent"],
        },
      };
    },
  };
}
