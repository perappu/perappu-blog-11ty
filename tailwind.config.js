
/** @type {import('tailwindcss/typography').Config} */
/** @type {import('tailwindcss/plugin').Config} */

import pluginTypography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */

const textShadow = () => (function({ matchUtilities, theme }) {
	matchUtilities(
	  {
		'text-shadow': (value) => ({
		  textShadow: value,
		}),
	  },
	  { values: theme('textShadow') }
	)
  })

export default {
	content: ['./_site/**/*.html', './_src/_includes/layouts/*.{md,html,njk}', './_src/content/**/*.{md,html,njk}'],
	theme: {
		extend: {
		  backgroundImage: {
			"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			"gradient-conic":
			  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
		  },
		},
	  },
  plugins: [pluginTypography,
		textShadow()],
}