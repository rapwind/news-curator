import * as moment from "moment";

import Fetch, { IFetch } from "./Fetch";
import RepoInterface from "./IRepo";

export default class WSJRepo implements RepoInterface {
    public fetch: IFetch;
    public keywords: string[];

    public defaultData = {
        color: "#000000",
        icon: "http://www.wsj.com/apple-touch-icon.png",
        name: "THE WALL STREET JOURNAL",
        siteUrl: "http://jp.wsj.com/"
    };

    constructor(keywords: string[]) {
        this.fetch = new Fetch(this);
        // OR検索が可能のため、キーワードはひとつに纏める
        this.keywords = [keywords.join(" ")];
    }

    public query = (q: string) => ({
        param: {
            andor: "OR",
            daysback: "2d",
            isAdvanced: true,
            keywords: q,
            "max-date": moment()
                .utcOffset(9)
                .format("YYYY/MM/DD"),
            "min-date": moment()
                .utcOffset(9)
                .add(-2, "d")
                .format("YYYY/MM/DD"),
            sort: "date-desc"
        },
        url: "http://jp.wsj.com/search/term.html"
    });

    public listParser(e: Cheerio) {
        return e.find(".hedSumm").children("li");
    }

    public listItemParser(e: Cheerio) {
        const title = e
            .find(".headline")
            .text()
            .replace(/^ +| +$|\n|\r|\t/gm, "");
        const linkUrl = e.find(".headline a").attr("href");

        if (linkUrl === undefined) {
            return;
        } else {
            // WSJはタイムスタンプが一覧に出ないので記事を取得してパースする
            return this.fetch.detail({
                title,
                type: "wsj",
                url: linkUrl
            });
        }
    }

    public itemParser(e: Cheerio) {
        const timeRegexp = new RegExp(
            "([0-9]{4}) 年 ([0-9]{1,2}) 月 ([0-9]{1,2}) 日 ([0-9]{1,2}):([0-9]{1,2})",
            "g"
        );
        const timeText = e.find("time.timestamp").text();
        const timeArray = timeRegexp.exec(timeText);
        return {
            author: "",
            publishedAt: moment(
                new Date(
                    parseInt(timeArray[1], 10),
                    parseInt(timeArray[2], 10) - 1,
                    parseInt(timeArray[3], 10),
                    parseInt(timeArray[4], 10),
                    parseInt(timeArray[5], 10)
                )
            ).utcOffset(9, true),
            text: e
                .find(".wsj-snippet-body")
                .text()
                .replace(/( |　)|\n|\r|\t/gm, "")
        };
    }
}
