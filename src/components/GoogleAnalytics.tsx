// src/components/GoogleAnalytics.tsx
export default function GoogleAnalytics() {
    if (import.meta.env.MODE !== 'production') return null;

    return (
        <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-C979VZBPDX"></script>
            <script
                innerHTML={`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-C979VZBPDX');`}
            />
        </>
    );
}
