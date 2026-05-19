
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: '#dc2626',
                'surface-tint': '#bb152c',
                'on-primary': '#ffffff',
                'secondary-container': '#fee2e2',
                'on-secondary-container': '#991b1b',

                // Adaptación de fondo
                background: {
                    DEFAULT: '#f8f9fa',
                    dark: '#0f1112' // Fondo premium oscuro
                },
                'on-background': {
                    DEFAULT: '#191c1d',
                    dark: '#e1e3e4'
                },

                surface: {
                    DEFAULT: '#f8f9fa',
                    dark: '#171a1b'
                },
                'surface-container-lowest': {
                    DEFAULT: '#ffffff',
                    dark: '#222526' // Tarjetas en modo oscuro
                },
                'surface-container': {
                    DEFAULT: '#edeeef',
                    dark: '#1c1f20'
                },
                'surface-variant': {
                    DEFAULT: '#e1e3e4',
                    dark: '#2a2e30'
                },

                'on-surface': {
                    DEFAULT: '#191c1d',
                    dark: '#e1e3e4'
                },
                'on-surface-variant': {
                    DEFAULT: '#5b403f',
                    dark: '#a0a5a8'
                },

                outline: {
                    DEFAULT: '#8f6f6e',
                    dark: '#404446'
                },
                'outline-variant': {
                    DEFAULT: '#e4bebc',
                    dark: '#2d3133'
                },

                error: '#ba1a1a',
                'brand-red': '#E63946',
                'primary-fixed': '#ffdad8',
                'primary-container': '#db313f'
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
                full: '9999px'
            },
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
                xl: '32px',
                gutter: '24px',
                'container-margin': '20px',
                unit: '8px'
            },
            fontFamily: {
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
                h1: ['"Plus Jakarta Sans"', 'sans-serif'],
                h2: ['"Plus Jakarta Sans"', 'sans-serif'],
                h3: ['"Plus Jakarta Sans"', 'sans-serif'],
                caption: ['"Plus Jakarta Sans"', 'sans-serif'],
                'body-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
                'body-md': ['"Plus Jakarta Sans"', 'sans-serif'],
                'label-bold': ['"Plus Jakarta Sans"', 'sans-serif']
            },
            fontSize: {
                display: ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
                h1: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '800' }],
                h2: ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
                h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
                caption: ['0.75rem', { lineHeight: '1.2', fontWeight: '500' }],
                'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '500' }],
                'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
                'label-bold': ['0.875rem', { lineHeight: '1.2', fontWeight: '700' }]
            }
        }
    }
};