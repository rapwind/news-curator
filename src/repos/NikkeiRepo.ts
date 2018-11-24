import * as moment from "moment";

import Fetch, { IFetch } from "./Fetch";
import RepoInterface from "./IRepo";

export default class NikkeiRepo implements RepoInterface {
    public fetch: IFetch;
    public keywords: string[];

    public defaultData = {
        color: "#0a385b",
        icon:
            "https://assets.nikkei.jp/release/v2.0.15/parts/ds/images/ico/pin_favicon.ico",
        name: "日本経済新聞",
        siteUrl: "https://www.nikkei.com/"
    };

    constructor(keywords: string[]) {
        this.fetch = new Fetch(this);
        this.keywords = keywords;
    }

    public query = (q: string) => ({
        param: { keyword: q },
        url: "https://r.nikkei.com/search"
    });

    public listParser(e: Cheerio) {
        return e.find(".search__result-item");
    }

    public listItemParser(e: Cheerio) {
        return {
            publishedAt: moment(e.find(".nui-date").attr("datetime")),
            title: e
                .find(".nui-card__title a")
                .text()
                .replace(/^ +| +$|\n|\r|\t/gm, ""),
            type: "nikkei",
            url: e.find(".nui-card__title a").attr("href")
        };
    }

    public itemParser(e: Cheerio) {
        return {
            author: "",
            text: e
                .find("#CONTENTS_MAIN")
                .find(".cmn-article_text")
                .text()
                .replace(/( |　)|\n|\r|\t/gm, "")
        };
    }
}
