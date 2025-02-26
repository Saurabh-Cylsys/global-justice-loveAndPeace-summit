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

// Common function to create styled links
function createStyledLink(link, href) {
  const aTag = document.createElement('a');
  aTag.href = href;
  aTag.textContent = link.label;
  aTag.style.display = 'block';
  aTag.style.padding = '8px 12px';
  aTag.style.textDecoration = 'none';
  aTag.style.color = '#333';
  aTag.style.transition = 'all 0.3s ease';
  
  // Add hover effect
  aTag.addEventListener('mouseenter', () => {
    aTag.style.backgroundColor = '#f0f0f0';
    aTag.style.color = '#000';
    aTag.style.paddingLeft = '15px';
  });
  
  aTag.addEventListener('mouseleave', () => {
    aTag.style.backgroundColor = 'transparent';
    aTag.style.color = '#333';
    aTag.style.paddingLeft = '12px';
  });
  
  // Add click handling
  aTag.addEventListener('click', (e) => {
    if (link.fragment) {
      e.preventDefault();
      const targetElement = document.getElementById(link.fragment);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    }
  });
  
  return aTag;
}

// Update summit links
const link1 = document.getElementById('summitLinks-container');
if (link1) {
  summitLinks.forEach(link => {
    const href = `assets/static/the-summit.html${link.fragment ? '#' + link.fragment : ''}`;
    link1.appendChild(createStyledLink(link, href));
  });
}
const mobileLink1 = document.getElementById('summitLinks-container2');
if (mobileLink1) {
  summitLinks.forEach(link => {
    const href = `assets/static/the-summit.html${link.fragment ? '#' + link.fragment : ''}`;
    mobileLink1.appendChild(createStyledLink(link, href));
  });
}

// partnersLinks
const partnersLinks = [
  { label: 'Corporate Partners', fragment: undefined },
  { label: 'Causes we Support', fragment: 'p3' },
  { label: 'Event, Media & PR Agency', fragment: 'p4' },
  { label: 'Service Partners', fragment: 'p5' }
];

// Update partners links
const link2 = document.getElementById('partnersLinks-container');
if (link2) {
  partnersLinks.forEach(link => {
    const href = `assets/static/partners.html${link.fragment ? '#' + link.fragment : ''}`;
    link2.appendChild(createStyledLink(link, href));
  });
}
const mobilelink2 = document.getElementById('partnersLinks-container2');
if (mobilelink2) {
  partnersLinks.forEach(link => {
    const href = `assets/static/partners.html${link.fragment ? '#' + link.fragment : ''}`;
    mobilelink2.appendChild(createStyledLink(link, href));
  });
}

// awardsLinks
const awardsLinks = [
  { label: 'Award Categories', fragment: undefined },
    { label: 'Nominees', fragment: 'aw2' },
    { label: 'Awards Research Committee', fragment: 'aw3' },
];

// Update awards links
const link3 = document.getElementById('awardsLinks-container');
if (link3) {
  awardsLinks.forEach(link => {
    const href = `assets/static/awards.html${link.fragment ? '#' + link.fragment : ''}`;
    link3.appendChild(createStyledLink(link, href));
  });
}
const mobilelink3 = document.getElementById('awardsLinks-container2');
if (mobilelink3) {
  awardsLinks.forEach(link => {
    const href = `assets/static/awards.html${link.fragment ? '#' + link.fragment : ''}`;
    mobilelink3.appendChild(createStyledLink(link, href));
  });
}
// peacekeeperLinks
const peacekeeperLinks = [
  { label: 'The Movement', fragment: undefined },
    { label: 'I am Peacekeeper', fragment: 'pe2' },
    { label: 'Sign Up Now', fragment: 'pe3' },
    { label: '7 Human Values', fragment: 'pe4' },
    { label: 'Song and Graphics', fragment: 'pe5' },
];

// Update peacekeeper links
const link4 = document.getElementById('peacekeeperLinks-container');
if (link4) {
  peacekeeperLinks.forEach(link => {
    const href = `assets/static/world-peacekeepers-movement.html${link.fragment ? '#' + link.fragment : ''}`;
    link4.appendChild(createStyledLink(link, href));
  });
}

const mobilelink4 = document.getElementById('peacekeeperLinks-container2');
if (mobilelink4) {
  peacekeeperLinks.forEach(link => {
    const href = `assets/static/world-peacekeepers-movement.html${link.fragment ? '#' + link.fragment : ''}`;
    mobilelink4.appendChild(createStyledLink(link, href));
  });
}

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

// Update download links
const link5 = document.getElementById('downloadLinks-container');
if (link5) {
  downloadLinks.forEach(link => {
    const href = `assets/static/DownloadCenter.html${link.fragment ? '#' + link.fragment : ''}`;
    link5.appendChild(createStyledLink(link, href));
  });
}
const mobilelink5 = document.getElementById('downloadLinks-container2');
if (mobilelink5) {
  downloadLinks.forEach(link => {
    const href = `assets/static/DownloadCenter.html${link.fragment ? '#' + link.fragment : ''}`;
    mobilelink5.appendChild(createStyledLink(link, href));
  });
}