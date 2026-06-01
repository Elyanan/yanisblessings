import Script from 'next/script'

const INIT_SCRIPT = `(function(){try{var l=localStorage.getItem('yanis-language');if(l==='en'||l==='am'){document.documentElement.lang=l;document.documentElement.dataset.language=l}}catch(e){}})();`

export function LanguageScript() {
  return (
    <Script
      id="yanis-language-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }}
    />
  )
}
