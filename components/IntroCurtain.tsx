/** Rideau d'ouverture : le nom apparaît, puis le rideau se lève. Une seule fois par visite. */
export default function IntroCurtain() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('wp-intro')){document.documentElement.dataset.intro='seen'}else{sessionStorage.setItem('wp-intro','1')}}catch(e){document.documentElement.dataset.intro='seen'}",
        }}
      />
      <div aria-hidden className="wp-intro pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-night text-bone">
        <span className="wp-intro-word font-display text-3xl uppercase sm:text-6xl">Atelier Nama</span>
      </div>
    </>
  );
}
