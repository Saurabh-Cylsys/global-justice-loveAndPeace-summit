// function removeClass(){
//   let element = document.getElementById('offcanvasScrolling');
// if (element.classList.contains('show')) {
//     element.classList.remove('show');
// }
// }

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("logo").style.width = "37%";
    document.getElementById("logo").style.top = "0";
    document.getElementById("logo").style.position = "relative";
  } else {
    document.getElementById("logo").style.width = "100%";
    document.getElementById("logo").style.top = "0rem";
    document.getElementById("logo").style.position = "absolute";
  }
}


// download brochures script start
function downloadPDF(language) {
  const fileUrls = {
      English: 'assets/UIComponents/files/GJLPS-Brochure-01-ENGLISH-241227.pdf',
      Mandarin: 'assets/UIComponents/files/GJLPS-Brochure-02-MANDARIN.pdf',
      Hindi: 'assets/UIComponents/files/GJLPS-Brochure-03-HINDI-241120.pdf',
      Spain: 'assets/UIComponents/files/GJLPS-Brochure-04-SPANISH.pdf',
      French: 'assets/UIComponents/files/GJLPS-Brochure-05-FRENCH-241212.pdf',
      Arabic: 'assets/UIComponents/files/GJLPS-Brochure-06-ARABIC-241211.pdf',
      Bengali: 'assets/UIComponents/files/GJLPS-Brochure-07-BENGALI-241211.pdf',
      Portuguese: 'assets/UIComponents/files/GJLPS-Brochure-08-PORTUGUESE.pdf',
      Russian: 'assets/UIComponents/files/GJLPS-Brochure-09-RUSSIAN-241205.pdf',
      Urdu: 'assets/UIComponents/files/GJLPS-Brochure-10-URDU-241211.pdf',
      Indonesian: 'assets/UIComponents/files/GJLPS-Brochure-11-INDONESIAN-241213.pdf',
      German: 'assets/UIComponents/files/GJLPS-Brochure-12-GERMAN-241211.pdf',
  };

  const fileUrl = fileUrls[language];
  if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = `GJLPS-Brochure-${language.toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  } else {
      alert('File not found for the selected language.');
  }
}
// download brochures script end

// links URL's

// partnersLinks
const summitLinks = [
  { label: 'Highlights of Summit', fragment: undefined },
    { label: 'Chairman', fragment: 'ts2' },
    { label: 'Speakers (Peace Ambassadors)', fragment: 'ts3' },
    { label: 'Delegates', fragment: 'ts4' },
    { label: 'Goals of Summit', fragment: 'ts5' },
    { label: 'Agenda', fragment: 'ts6' },
    { label: 'Themes', fragment: 'ts7' },
    { label: 'Structured Networking', fragment: 'ts8' },
    { label: 'Venue', fragment: 'ts9' },
];

const link1 = document.getElementById('summitLinks-container');

summitLinks.forEach(link => {
  const aTag = document.createElement('a');
  aTag.href = `the-summit.html${link.fragment ? '#' + link.fragment : ''}`;
  aTag.textContent = link.label;
  aTag.style.display = 'block'; // Makes links appear on new lines
  link1.appendChild(aTag);
});

// partnersLinks
const partnersLinks = [
  { label: 'Corporate Partners', fragment: undefined },
  { label: 'Causes we Support', fragment: 'p3' },
  { label: 'Event, Media & PR Agency', fragment: 'p4' },
  { label: 'Service Partners', fragment: 'p5' }
];

const link2 = document.getElementById('partnersLinks-container');

partnersLinks.forEach(link => {
  const aTag = document.createElement('a');
  aTag.href = `partners.html${link.fragment ? '#' + link.fragment : ''}`;
  aTag.textContent = link.label;
  aTag.style.display = 'block'; // Makes links appear on new lines
  link2.appendChild(aTag);
});

// awardsLinks
const awardsLinks = [
  { label: 'Award Categories', fragment: undefined },
    { label: 'Nominees', fragment: 'aw2' },
    { label: 'Awards Research Committee', fragment: 'aw3' },
];

const link3 = document.getElementById('awardsLinks-container');

awardsLinks.forEach(link => {
  const aTag = document.createElement('a');
  aTag.href = `awards.html${link.fragment ? '#' + link.fragment : ''}`;
  aTag.textContent = link.label;
  aTag.style.display = 'block'; // Makes links appear on new lines
  link3.appendChild(aTag);
});

// peacekeeperLinks
const peacekeeperLinks = [
  { label: 'The Movement', fragment: undefined },
    { label: 'I am Peacekeeper', fragment: 'pe2' },
    { label: 'Sign Up Now', fragment: 'pe3' },
    { label: '7 Human Values', fragment: 'pe4' },
    { label: 'Song and Graphics', fragment: 'pe5' },
];

const link4 = document.getElementById('peacekeeperLinks-container');

peacekeeperLinks.forEach(link => {
  const aTag = document.createElement('a');
  aTag.href = `world-peacekeepers-movement.html${link.fragment ? '#' + link.fragment : ''}`;
  aTag.textContent = link.label;
  aTag.style.display = 'block'; // Makes links appear on new lines
  link4.appendChild(aTag);
});

// downloadLinks
const downloadLinks = [
  { label: 'Mission & Pledge', fragment: undefined },
    { label: 'The Summit of 28', fragment: 'dc2' },
    { label: 'The Number 28', fragment: 'dc3' },
    { label: '7 Pillars of Justice', fragment: 'dc4' },
    { label: '7 Causes of World Conflict', fragment: 'dc5' },
    { label: '7 Quotes of Inner Peace', fragment: 'dc6' },
    { label: '28 Gems of World Peace', fragment: 'dc7' },
    { label: 'We are One', fragment: 'dc8' },
    { label: 'Chairs for Delegates', fragment: 'dc9' },
    { label: '28 Poems', fragment: 'dc10' },
    { label: '28 Sayings', fragment: 'dc11' },
];

const link5 = document.getElementById('downloadLinks-container');

downloadLinks.forEach(link => {
  const aTag = document.createElement('a');
  aTag.href = `DownloadCenter.html${link.fragment ? '#' + link.fragment : ''}`;
  aTag.textContent = link.label;
  aTag.style.display = 'block'; // Makes links appear on new lines
  link5.appendChild(aTag);
});