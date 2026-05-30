export function LanguageScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var l=localStorage.getItem('yanis-language');if(l==='en'||l==='am'){document.documentElement.lang=l;document.documentElement.dataset.language=l}}catch(e){}})();`,
      }}
    />
  )
}
