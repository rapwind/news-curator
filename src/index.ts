import * as dotenv from "dotenv";

import Cache from "./Cache";
import Repos from "./repos";

import Message from "./messages/SlackMessage";

dotenv.config();

const cache = new Cache();

const keywords = process.env.KEYWORDS.replace(/\s+/g, "").split(",");

Repos.forEach(Repo => {
    const repo = new Repo(keywords);
    repo.fetch.list().subscribe({
        error: err => {
            // console.error(err);
        },
        next: i => {
            cache.set(i).subscribe({
                error: err => {
                    // console.error(err);
                },
                next: d => {
                    const msg = new Message(repo.fetch.detail(d));
                    msg.send();
                    // console.info(msg);
                }
            });
        }
    });
});
