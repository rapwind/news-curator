import * as dotenv from "dotenv";
import * as request from "superagent";

import MessageImpl from "./MessageImpl";

dotenv.config();

export default class SlackMessage extends MessageImpl {
    public getAttachmentBody = `{
        "attachments": [
            {
                "color": "${this.detail.color}",
                "author_name": "${this.detail.name}",
                "author_link": "${this.detail.siteUrl}",
                "author_icon": "${this.detail.icon}",
                "title": "${this.detail.title}",
                "title_link": "${this.detail.url}",
                "text": "${this.detail.text}",
                "ts": ${this.detail.publishedAt.unix()},
                "footer": "${this.detail.author}"
            }
        ]
    }`;

    public send() {
        return request
            .post(process.env.SLACK_INCOMING_HOOK_URL)
            .send(this.getAttachmentBody)
            .set("accept", "json")
            .end();
    }
}
