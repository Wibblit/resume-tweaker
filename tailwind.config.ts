import type { Config } from "tailwindcss";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			ltwave: ["LTWave", "sans-serif"]
  		},
  		typography: '() => ({\n        customcolor : {\n          css: {\n            "--tw-prose-body": "var(--color-foreground)",\n            "--tw-prose-headings": "var(--color-foreground)",\n            "--tw-prose-lead": "var(--color-foreground)",\n            "--tw-prose-links": "var(--color-foreground)",\n            "--tw-prose-bold": "var(--color-foreground)",\n            "--tw-prose-counters": "var(--color-foreground)",\n            "--tw-prose-bullets": "var(--color-foreground)",\n            "--tw-prose-hr": "var(--color-foreground)",\n            "--tw-prose-quotes": "var(--color-foreground)",\n            "--tw-prose-quote-borders": "var(--color-foreground)",\n            "--tw-prose-captions": "var(--color-foreground)",\n            "--tw-prose-code": "var(--color-foreground)",\n            "--tw-prose-pre-code": "var(--color-foreground)",\n            "--tw-prose-pre-bg": "var(--color-background)",\n            "--tw-prose-th-borders": "var(--color-foreground)",\n            "--tw-prose-td-borders": "var(--color-foreground)",\n          },\n        },\n      })',
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
			"background-shine": {
				"from": {
					"backgroundPosition": "0 0"
				},
				"to": {
					"backgroundPosition": "-200% 0"
				}
			},
			'fade-in-top-to-bottom': {
				'0%': {
					opacity: "0",
					transform: 'translateY(-50px)',
				},
				'100%': {
					opacity: "1",
					transform: 'translateY(0)',
				},
			},'fade-out-bottom-to-top': {
				'0%': {
					opacity: "1",
					transform: 'translateY(0px)',
				},
				'100%': {
					opacity: "0",
					transform: 'translateY(-50)',
				},
			},
			'marquee': {
				'0%': { transform: 'translateX(0%)' },
				'100%': { transform: 'translateX(-100%)' }
			  },
			  'marquee-reverse': {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(0%)' }
			  },
			  'marquee-vertical': {
				'0%': { transform: 'translateY(0%)' },
				'100%': { transform: 'translateY(-100%)' }
			  },
			  'marquee-vertical-reverse': {
				'0%': { transform: 'translateY(-100%)' },
				'100%': { transform: 'translateY(0%)' }
			  }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			"background-shine": "background-shine 2s linear infinite",
			'fade-in-top-to-bottom': 'fade-in-top-to-bottom 0.3s ease-out forwards',
			'fade-out-bottom-to-top': 'fade-out-bottom-to-top 0.3s ease-in forwards',
			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        	'marquee-vertical-reverse': 'marquee-vertical-reverse var(--duration) linear infinite',
        	'marquee': 'marquee var(--duration) linear infinite',
        	'marquee-reverse': 'marquee-reverse var(--duration) linear infinite',
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    addVariablesForColors,
  ],
};
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
export default config;
