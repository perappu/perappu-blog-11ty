/** @type {import('tailwindcss').Config} */
/** @type {import('postcss').Config} */
/** @type {import('autoprefixer').Config} */
/** @type {import('cssnano').Config} */

import tocPlugin from "eleventy-plugin-toc"
import markdownit from "markdown-it"
import anchor from "markdown-it-anchor"
import { DateTime } from "luxon";
import markdownItAttrs from 'markdown-it-attrs';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default async function (eleventyConfig) {

	const postcssFilter = (cssCode, done) => {
		// we call PostCSS here.
		postCss([tailwind(import('./tailwind.config')), autoprefixer(), cssnano({ preset: 'default' })])
			.process(cssCode, {
				// path to our CSS file
				from: './src/_includes/assets/tailwind.css'
			})
			.then(
				(r) => done(null, r.css),
				(e) => done(e, null)
			);
	};

	eleventyConfig.addCollection("posts", function (collectionApi) {
		return collectionApi.getFilteredByGlob("content/posts/*.md")
			.sort((a, b) => b.data.date - a.data.date);;
	});

	eleventyConfig.addFilter("postDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
	});

	eleventyConfig.addPlugin(tocPlugin, { ul: "false" });

	eleventyConfig.setLibrary("md", markdownit({ html: true }).use(anchor).use(markdownItAttrs, {
		// optional, these are default options
		leftDelimiter: '{',
		rightDelimiter: '}',
		allowedAttributes: []  // empty array = all attributes are allowed
	}));

	eleventyConfig.setInputDirectory("_src");

	eleventyConfig.addPassthroughCopy({ './_includes/assets/content/img/**.*': '/assets/content/img/' });
	eleventyConfig.addPassthroughCopy({ './content/content/img/**/**.*': '/content/img/' });
	eleventyConfig.addPassthroughCopy({ "./_includes/assets/favicon.ico": "/" });
	eleventyConfig.addPassthroughCopy({ "./_includes/assets/fslightbox.js": "/" });

	eleventyConfig.addWatchTarget('/_includes/assets/tailwind.css');
	eleventyConfig.addWatchTarget('/content/**/*.*');

	eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter);
	eleventyConfig.setLayoutsDirectory("_includes/layouts");

	//image optimization settings
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["webp", "gif"],
		widths: ["auto"],
		sharpOptions: {
			animated: true,
		},
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
			pictureAttributes: {},
			fallback: "largest",
		},
	});

};