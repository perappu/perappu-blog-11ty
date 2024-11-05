import { DateTime } from "luxon";

export default {
    layout: "page.njk",
    date: DateTime.fromJSDate(new Date())
};
