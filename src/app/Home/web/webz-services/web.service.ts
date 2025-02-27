import { Injectable } from '@angular/core';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoints.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
  ) { }

  speakersList: any[] = [
    // list 1
    {
      // "S_No": 1,
      "View": '',
      "Profile_Photo": null,
      "Name": "Arjuna Ranatunga, Deshamanya",
      "Country": "SRI LANKA",
      "Credentials": "Cricketer & Politician"
    },
    {
      // "S_No": 1,
      "View": '',
      "Profile_Photo": null,
      "Name": "Baba Ramdev",
      "Country": "INDIA",
      "Credentials": "World Yoga Guru"
    },
    {
      // "S_No": 2,
      "View": '',
      "Profile_Photo": null,
      "Name": "Banagala Upatissa Thero, Most Venerable ",
      "Country": "SRI LANKA",
      "Credentials": "President of Mahabodhi Society, Sri Lanka : Buddhist Religious Leader"
    },
    // list 2
    {
      // "S_No": 3,
      "View": 'binod',
      "Profile_Photo": 'speaker14.png',
      "Name": "Binod Kumar Chaudhary  ",
      "Country": "NEPAL",
      "Credentials": "President, Chaudhary Group : Industrialist, Member of House of Representatives of Nepal"
    },
    {
      // "S_No": 4,
      "View": '',
      "Profile_Photo": null,
      "Name": "Chandra Kumar Bose ",
      "Country": "INDIA",
      "Credentials": "Socio-Political Activist & Convenor, The Open Platform for Netaji : ( grand nephew of Subhash Chandra Bose ) "
    },
    {
      // "S_No": 5,
      "View": '',
      "Profile_Photo": null,
      "Name": "Dalip Singh Rana, The Great Khali",
      "Country": "USA, INDIA",
      "Credentials": "Wrestler : 1st Indian born World Heavyweight Champion, WWE"
    },
    // list 3
    {
      // "S_No": 5,
      "View": '',
      "Profile_Photo": null,
      "Name": "Deepa Malik, Dr.",
      "Country": "INDIA",
      "Credentials": "Sports Champion : Silver Medallist at 2016 Rio Paralympics "
    },
    {
      // "S_No": 6,
      "View": '',
      "Profile_Photo": null,
      "Name": "Ekaterina Zagladina",
      "Country": "RUSSIA ",
      "Credentials": "President of the Permanent Secretariat of the World Summit of Nobel Peace Laureates"
    },
    {
      // "S_No": 7,
      "View": '',
      "Profile_Photo": null,
      "Name": "Esha Deol",
      "Country": "INDIA ",
      "Credentials": "Actress"
    },
    // list 4
    {
      // "S_No": 8,
      "View": '',
      "Profile_Photo": null,
      "Name": "Feizi Masrour Milani, Dr.",
      "Country": "BRAZIL",
      "Credentials": "Elected Representative, National Spiritual Assembly of the Bahais of Brazil"
    },
    {
      // "S_No": 9,
      "View": '',
      "Profile_Photo": null,
      "Name": "Fejzullah Rexhepi, His Excellency",
      "Country": "KOSOVO ",
      "Credentials": "President of the Supreme Court of Kosovo"
    },
    {
      // "S_No": 10,
      "View": 'habil',
      "Profile_Photo": 'speaker7.png',
      "Name": "Habil Khorakiwala, Dr.",
      "Country": "INDIA",
      "Credentials": "Industrialist : Chairman, Wockhardt Group"
    },
    // list 5
    {
      // "S_No": 11,
      "View": '',
      "Profile_Photo": null,
      "Name": "Hassan Babacar Jallow, Lord Chief Justice",
      "Country": "GAMBIA ",
      "Credentials": "Chief Justice of the Supreme Court of Gambia"
    },
    {
      // "S_No": 12,
      "View": '',
      "Profile_Photo": null,
      "Name": "Helena Lemaletian, Senator, Ambassador",
      "Country": "KENYA",
      "Credentials": "Politician ( Member of Parliament ), Royalty ( Queen of the North Kenya ), Beauty Queen ( Miss Commonwealth Kenya, 2018 )"
    },
    {
      // "S_No": 13,
      "View": '',
      "Profile_Photo": null,
      "Name": "Juan Carlos Sainz-Borgo, Dr.",
      "Country": "COSTA RICA",
      "Credentials": "Vice Rector, University of Peace "
    },
    {
      // "S_No": 13,
      "View": '',
      "Profile_Photo": 'speaker1.png',
      "Name": "Kailash Satyarthi",
      "Country": "INDIA",
      "Credentials": "Social Activist, Nobel Peace Laureate 2014"
    },
    // list 6
    {
      // "S_No": 14,
      "View": '',
      "Profile_Photo": null,
      "Name": "Lech Walesa, Ex-President",
      "Country": "POLAND",
      "Credentials": "Politician, Trade Union Activist : Nobel Peace Laureate 1983"
    },
    {
      // "S_No": 15,
      "View": '',
      "Profile_Photo": 'speaker3.png',
      "Name": "Leymah Gbowee",
      "Country": "LIBERIA",
      "Credentials": "Nobel Peace Laureate 2011"
    },
    {
      // "S_No": 16,
      "View": '',
      "Profile_Photo": 'speaker10.png',
      "Name": "Lokesh Ji Muni Acharya, His Holiness",
      "Country": "INDIA",
      "Credentials": "Founder, Ahimsa Vishwa Bharti & World Peace Ambassador, Jain Religion Spiritual Leader"
    },
    // list 7
    {
      // "S_No": 17,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mahawa Simou Diouf, Judge President of the Court of Justice of WAEMU (West African Monetary & Economic Union)",
      "Country": "BURKINA FASO",
      "Credentials": "Head of Association of Judges of 8 countries in West Africa"
    },
    {
      // "S_No": 17,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mahesh Bhupathi",
      "Country": "INDIA",
      "Credentials": "Tennis : Former World Number 1 Doubles Tennis Player, 12 times Grand Slam Doubles Winner "
    },
    {
      // "S_No": 18,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mario-Max Schaumburg-Lippe, His Highness, Dr. Prince",
      "Country": "DENMARK",
      "Credentials": "Royalty, TV Host, Philanthropist"
    },
    // list 8
    {
      // "S_No": 19,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mary Kom",
      "Country": "INDIA",
      "Credentials": "Boxer, 6 times World Champion"
    },
    {
      // "S_No": 20,
      "View": 'salam',
      "Profile_Photo": 'speaker12.png',
      "Name": "Mohammed Abd-Salam, His Excellency, Judge",
      "Country": "EGYPT",
      "Credentials": "Secretary General of the Muslim Council of Elders & Co-President of Religions for Peace"
    },
    {
      // "S_No": 21,
      "View": 'asif',
      "Profile_Photo": 'speaker8.png',
      "Name": "Mohammed Asif Ali, Nawabzada",
      "Country": "INDIA",
      "Credentials": "Royalty Heir Apparent to the Prince of Arcot"
    },
    // list 9
    {
      // "S_No": 17,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mohammad Tawhidi, Imam",
      "Country": "AUSTRALIA",
      "Credentials": "slamic Religious Leader : Vice President, Global Imams Council & Chairman, Senior Imams Committee"
    },
    {
      // "S_No": 22,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mohan Mubasinghe, Prof",
      "Country": "SRI LANKA",
      "Credentials": "Nobel Peace Laureate 2007"
    },
    {
      // "S_No": 23,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mustapha Njie",
      "Country": "GAMBIA",
      "Credentials": "Industrialist : Chairman, TAF Global"
    },
    // list 10
    // {
    //   "View": '',
    //   "Profile_Photo": null,
    //   "Name": "Nadia Murad",
    //   "Country": "IRAQ",
    //   "Credentials": "Social Activist : Nobel Peace Laureates 2018"
    // },
    {
      // "S_No": 25,
      "View": 'nadir',
      "Profile_Photo": 'speaker2.png',
      "Name": "Nadir Godrej",
      "Country": "INDIA",
      "Credentials": "Industrialist, Chairman, Godrej Industries"
    },
    {
      // "S_No": 17,
      "View": '',
      "Profile_Photo": null,
      "Name": "Nii Tackie Tackie Tsuru 2, King, His Royal Majesty ",
      "Country": "GHANA",
      "Credentials": "Royalty"
    },
    // list 11
    {
      // "S_No": 26,
      "View": '',
      "Profile_Photo": 'speaker13.png',
      "Name": "Oheneba Nana Kwame Obeng 2, His Royal Highness",
      "Country": "GHANA",
      "Credentials": "Royalty, The Royal House of Sefwi Obeng-Mim"
    },
    {
      // "S_No": 27,
      "View": '',
      "Profile_Photo": null,
      "Name": "Ouided Bouchamaoui",
      "Country": "TUNISIA",
      "Credentials": "Nobel Peace Laureate 2015"
    },
    {
      // "S_No": 28,
      "View": '',
      "Profile_Photo": null,
      "Name": "Paco Soleil",
      "Country": "SPAIN",
      "Credentials": "Artist, Peace Painter (live performance)"
    },
    // list 12
    {
      // "S_No": 29,
      "View": '',
      "Profile_Photo": null,
      "Name": "P V Sindhu",
      "Country": "INDIA",
      "Credentials": "Badminton World Champion (2019) (final confirmation based on tournament schedule)"
    },
    {
      // "S_No": 30,
      "View": 'rina',
      "Profile_Photo": 'speaker6.png',
      "Name": "Rina Telesphore, Dr, His Royal Highness, The Prince",
      "Country": "MADAGASCAR",
      "Credentials": "Royalty, Pastor, Philanthropist"
    },
    {
      // "S_No": 31,
      "View": 'romona',
      "Profile_Photo": 'speaker9.png',
      "Name": "Romona Murad Dr., Her Royal Highness Princess Dato Seri",
      "Country": "MALAYSIA",
      "Credentials": "Royalty, Philanthropist, Peace Activist"
    },
    // list 13
    {
      // "S_No": 32,
      "View": '',
      "Profile_Photo": 'speaker4.png',
      "Name": "Rui Duarte de Barros, His Excellency",
      "Country": "GUINEA BISSAU",
      "Credentials": "Prime Minister"
    },
    {
      // "S_No": 33,
      "View": '',
      "Profile_Photo": null,
      "Name": "Sanjay Khan",
      "Country": "INDIA",
      "Credentials": "Actor, Producer, Director"
    },
    {
      // "S_No": 33,
      "View": 'satpal',
      "Profile_Photo": 'speaker15.png',
      "Name": "Satpal Singh Khalsa, Bhai Saheb",
      "Country": "USA",
      "Credentials": "Ambassador of Sikh Dharma"
    },
    
    // list 14
    {
      // "S_No": 34,
      "View": '',
      "Profile_Photo": null,
      "Name": "Shirin Ebadi",
      "Country": "IRAN",
      "Credentials": "Social Activist, Judge, Lawyer : Nobel Peace Laureate 2003"
    },
    {
      // "S_No": 34,
      "View": '',
      "Profile_Photo": null,
      "Name": "Soha Ali Khan",
      "Country": "INDIA",
      "Credentials": "Producer & Actress, Royalty"
    },
    {
      // "S_No": 35,
      "View": '',
      "Profile_Photo": null,
      "Name": "Surender Singh Kandhari",
      "Country": "UAE",
      "Credentials": "Industrialist : Chairman, Al Dobowi Group"
    },
    {
      // "S_No": 35,
      "View": '',
      "Profile_Photo": null,
      "Name": "Tehemton  Burjor Mirza, Dastur",
      "Country": "INDIA",
      "Credentials": "High Priest, Shreeji Pak Iranshah Atash Behram, Udvada : Zoroastrian Religion Leader"
    },
    
    // list 15
    {
      // "S_No": 36,
      "View": '',
      "Profile_Photo": null,
      "Name": "Thich Nhat Tu, Most Venerable, Dr.",
      "Country": "VIETNAM",
      "Credentials": "Vice-President, Vietnam Buddhist Sangha & Permanent Vice-Chancellor, Vietnam Buddhist Society : Buddhist Religion Leader"
    },
    {
      // "S_No": 37,
      "View": '',
      "Profile_Photo": null,
      "Name": "Urvashi Rautela",
      "Country": "INDIA",
      "Credentials": "Actor & Model"
    },
    {
      // "S_No": 37,
      "View": '',
      "Profile_Photo": null,
      "Name": "Venkatramani R, Honorable",
      "Country": "INDIA",
      "Credentials": "The Attorney General of India"
    },
    {
      // "S_No": 38,
      "View": '',
      "Profile_Photo": null,
      "Name": "Yasmin Karachiwala",
      "Country": "INDIA",
      "Credentials": "Celebrity Fitness Trainer"
    },
    // list 16
    {
      // "S_No": 39,
      "View": '',
      "Profile_Photo": null,
      "Name": "Zayed Khan",
      "Country": "INDIA",
      "Credentials": "Producer & Actor"
    },
    {
      // "S_No": 39,
      "View": '',
      "Profile_Photo": null,
      "Name": "Jose Manuel Ramos Horta, His Excellency",
      "Country": "EAST TIMOR",
      "Credentials": "President, East Timor & Nobel Peace Laureate, 1996 (ONLINE)"
    }
  ]

  getSpeakersListData() {
    return [
      {
        speakers: [
          {
            // "S_No": 1,
            "View": '',
            "Profile_Photo": null,
            "Name": "Arjuna Ranatunga, Deshamanya",
            "Country": "SRI LANKA",
            "Credentials": "Cricketer & Politician"
          },
          {
            // "S_No": 1,
            "View": '',
            "Profile_Photo": null,
            "Name": "Baba Ramdev",
            "Country": "INDIA",
            "Credentials": "World Yoga Guru"
          },
          {
            // "S_No": 2,
            "View": '',
            "Profile_Photo": null,
            "Name": "Banagala Upatissa Thero, Most Venerable ",
            "Country": "SRI LANKA",
            "Credentials": "President of Mahabodhi Society, Sri Lanka : Buddhist Religious Leader"
          },
        ]
      },


      {
        speakers: [
          {
            // "S_No": 3,
            "View": 'binod',
            "Profile_Photo": 'speaker14.png',
            "Name": "Binod Kumar Chaudhary  ",
            "Country": "NEPAL",
            "Credentials": "President, Chaudhary Group : Industrialist, Member of House of Representatives of Nepal"
          },
          {
            // "S_No": 4,
            "View": '',
            "Profile_Photo": null,
            "Name": "Chandra Kumar Bose ",
            "Country": "INDIA",
            "Credentials": "Socio-Political Activist & Convenor, The Open Platform for Netaji : ( grand nephew of Subhash Chandra Bose ) "
          },
          {
            // "S_No": 5,
            "View": '',
            "Profile_Photo": null,
            "Name": "Dalip Singh Rana, The Great Khali",
            "Country": "USA, INDIA",
            "Credentials": "Wrestler : 1st Indian born World Heavyweight Champion, WWE"
          },
        ]
      },

      {
        speakers: [
          {
            // "S_No": 5,
            "View": '',
            "Profile_Photo": null,
            "Name": "Deepa Malik, Dr.",
            "Country": "INDIA",
            "Credentials": "Sports Champion : Silver Medallist at 2016 Rio Paralympics "
          },
          {
            // "S_No": 6,
            "View": '',
            "Profile_Photo": null,
            "Name": "Ekaterina Zagladina",
            "Country": "RUSSIA ",
            "Credentials": "President of the Permanent Secretariat of the World Summit of Nobel Peace Laureates"
          },
          {
            // "S_No": 7,
            "View": '',
            "Profile_Photo": null,
            "Name": "Esha Deol",
            "Country": "INDIA ",
            "Credentials": "Actress"
          },
        ]
      },
      {
        speakers: [
          {
            // "S_No": 8,
            "View": '',
            "Profile_Photo": null,
            "Name": "Feizi Masrour Milani, Dr.",
            "Country": "BRAZIL",
            "Credentials": "Elected Representative, National Spiritual Assembly of the Bahais of Brazil"
          },
          {
            // "S_No": 9,
            "View": '',
            "Profile_Photo": null,
            "Name": "Fejzullah Rexhepi, His Excellency",
            "Country": "KOSOVO ",
            "Credentials": "President of the Supreme Court of Kosovo"
          },
          {
            // "S_No": 10,
            "View": 'habil',
            "Profile_Photo": 'speaker7.png',
            "Name": "Habil Khorakiwala, Dr.",
            "Country": "INDIA",
            "Credentials": "Industrialist : Chairman, Wockhardt Group"
          },
        ]
      },
      {
        speakers: [
          {
            // "S_No": 11,
            "View": '',
            "Profile_Photo": null,
            "Name": "Hassan Babacar Jallow, Lord Chief Justice",
            "Country": "GAMBIA ",
            "Credentials": "Chief Justice of the Supreme Court of Gambia"
          },
          {
            // "S_No": 12,
            "View": '',
            "Profile_Photo": null,
            "Name": "Helena Lemaletian, Senator, Ambassador",
            "Country": "KENYA",
            "Credentials": "Politician ( Member of Parliament ), Royalty ( Queen of the North Kenya ), Beauty Queen ( Miss Commonwealth Kenya, 2018 )"
          },
          {
            // "S_No": 13,
            "View": '',
            "Profile_Photo": null,
            "Name": "Juan Carlos Sainz-Borgo, Dr.",
            "Country": "COSTA RICA",
            "Credentials": "Vice Rector, University of Peace "
          },
          
        ]
      },
      {
        speakers: [
          {
            // "S_No": 13,
            "View": '',
            "Profile_Photo": 'speaker1.png',
            "Name": "Kailash Satyarthi",
            "Country": "INDIA",
            "Credentials": "Social Activist, Nobel Peace Laureate 2014"
          },
          {
            // "S_No": 14,
            "View": '',
            "Profile_Photo": null,
            "Name": "Lech Walesa, Ex-President",
            "Country": "POLAND",
            "Credentials": "Politician, Trade Union Activist : Nobel Peace Laureate 1983"
          },
          {
            // "S_No": 15,
            "View": '',
            "Profile_Photo": 'speaker3.png',
            "Name": "Leymah Gbowee",
            "Country": "LIBERIA",
            "Credentials": "Nobel Peace Laureate 2011"
          },
          
        ]
      },
      {
        speakers: [
          {
            // "S_No": 16,
            "View": '',
            "Profile_Photo": 'speaker10.png',
            "Name": "Lokesh Ji Muni Acharya, His Holiness",
            "Country": "INDIA",
            "Credentials": "Founder, Ahimsa Vishwa Bharti & World Peace Ambassador, Jain Religion Spiritual Leader"
          },
          {
            // "S_No": 17,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mahawa Simou Diouf, Judge President of the Court of Justice of WAEMU (West African Monetary & Economic Union)",
            "Country": "BURKINA FASO",
            "Credentials": "Head of Association of Judges of 8 countries in West Africa"
          },
          {
            // "S_No": 17,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mahesh Bhupathi",
            "Country": "INDIA",
            "Credentials": "Tennis : Former World Number 1 Doubles Tennis Player, 12 times Grand Slam Doubles Winner "
          },
          
        ]
      },
      {
        speakers: [
          {
            // "S_No": 18,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mario-Max Schaumburg-Lippe, His Highness, Dr. Prince",
            "Country": "DENMARK",
            "Credentials": "Royalty, TV Host, Philanthropist"
          },
          {
            // "S_No": 19,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mary Kom",
            "Country": "INDIA",
            "Credentials": "Boxer, 6 times World Champion"
          },
          {
            // "S_No": 20,
            "View": 'salam',
            "Profile_Photo": 'speaker12.png',
            "Name": "Mohammed Abd-Salam, His Excellency, Judge",
            "Country": "EGYPT",
            "Credentials": "Secretary General of the Muslim Council of Elders & Co-President of Religions for Peace"
          },
          
        ]
      },
      {
        speakers: [
          {
            // "S_No": 21,
            "View": 'asif',
            "Profile_Photo": 'speaker8.png',
            "Name": "Mohammed Asif Ali, Nawabzada",
            "Country": "INDIA",
            "Credentials": "Royalty Heir Apparent to the Prince of Arcot"
          },
          {
            // "S_No": 17,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mohammad Tawhidi, Imam",
            "Country": "AUSTRALIA",
            "Credentials": "slamic Religious Leader : Vice President, Global Imams Council & Chairman, Senior Imams Committee"
          },
          {
            // "S_No": 22,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mohan Mubasinghe, Prof",
            "Country": "SRI LANKA",
            "Credentials": "Nobel Peace Laureate 2007"
          },
          
        ]
      },

      {
        speakers: [
          {
            // "S_No": 23,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mustapha Njie",
            "Country": "GAMBIA",
            "Credentials": "Industrialist : Chairman, TAF Global"
          },
          // {
           
          //   "View": '',
          //   "Profile_Photo": null,
          //   "Name": "Nadia Murad",
          //   "Country": "IRAQ",
          //   "Credentials": "Social Activist : Nobel Peace Laureates 2018"
          // },
          {
            // "S_No": 25,
            "View": 'nadir',
            "Profile_Photo": 'speaker2.png',
            "Name": "Nadir Godrej",
            "Country": "INDIA",
            "Credentials": "Industrialist, Chairman, Godrej Industries"
          },
          {
            // "S_No": 17,
            "View": '',
            "Profile_Photo": null,
            "Name": "Nii Tackie Tackie Tsuru 2, King, His Royal Majesty ",
            "Country": "GHANA",
            "Credentials": "Royalty"
          },
          
        ]
      },

      {
        speakers: [
          
          {
            // "S_No": 26,
            "View": '',
            "Profile_Photo": 'speaker13.png',
            "Name": "Oheneba Nana Kwame Obeng 2, His Royal Highness",
            "Country": "GHANA",
            "Credentials": "Royalty, The Royal House of Sefwi Obeng-Mim"
          },
          {
            // "S_No": 27,
            "View": '',
            "Profile_Photo": null,
            "Name": "Ouided Bouchamaoui",
            "Country": "TUNISIA",
            "Credentials": "Nobel Peace Laureate 2015"
          },
          {
            // "S_No": 28,
            "View": '',
            "Profile_Photo": null,
            "Name": "Paco Soleil",
            "Country": "SPAIN",
            "Credentials": "Artist, Peace Painter (live performance)"
          },
          
        ]
      },

      {
        speakers: [
          
          {
            // "S_No": 29,
            "View": '',
            "Profile_Photo": null,
            "Name": "P V Sindhu",
            "Country": "INDIA",
            "Credentials": "Badminton World Champion (2019) (final confirmation based on tournament schedule)"
          },
          {
            // "S_No": 30,
            "View": 'rina',
            "Profile_Photo": 'speaker6.png',
            "Name": "Rina Telesphore, Dr, His Royal Highness, The Prince",
            "Country": "MADAGASCAR",
            "Credentials": "Royalty, Pastor, Philanthropist"
          },
          {
            // "S_No": 31,
            "View": 'romona',
            "Profile_Photo": 'speaker9.png',
            "Name": "Romona Murad Dr., Her Royal Highness Princess Dato Seri",
            "Country": "MALAYSIA",
            "Credentials": "Royalty, Philanthropist, Peace Activist"
          },
          
        ]
      },
      {
        speakers: [
          
          {
            // "S_No": 32,
            "View": '',
            "Profile_Photo": 'speaker4.png',
            "Name": "Rui Duarte de Barros, His Excellency",
            "Country": "GUINEA BISSAU",
            "Credentials": "Prime Minister"
          },
          {
            // "S_No": 33,
            "View": '',
            "Profile_Photo": null,
            "Name": "Sanjay Khan",
            "Country": "INDIA",
            "Credentials": "Actor, Producer, Director"
          },
          {
            // "S_No": 33,
            "View": 'satpal',
            "Profile_Photo": 'speaker15.png',
            "Name": "Satpal Singh Khalsa, Bhai Saheb",
            "Country": "USA",
            "Credentials": "Ambassador of Sikh Dharma"
          },
          
        ]
      },
      {
        speakers: [
          
          {
            // "S_No": 34,
            "View": '',
            "Profile_Photo": null,
            "Name": "Shirin Ebadi",
            "Country": "IRAN",
            "Credentials": "Social Activist, Judge, Lawyer : Nobel Peace Laureate 2003"
          },
          {
            // "S_No": 34,
            "View": '',
            "Profile_Photo": null,
            "Name": "Soha Ali Khan",
            "Country": "INDIA",
            "Credentials": "Producer & Actress, Royalty"
          },
          {
            // "S_No": 35,
            "View": '',
            "Profile_Photo": null,
            "Name": "Surender Singh Kandhari",
            "Country": "UAE",
            "Credentials": "Industrialist : Chairman, Al Dobowi Group"
          },
          
        ]
      },
      {
        speakers: [
          
          {
            // "S_No": 35,
            "View": '',
            "Profile_Photo": null,
            "Name": "Tehemton  Burjor Mirza, Dastur",
            "Country": "INDIA",
            "Credentials": "High Priest, Shreeji Pak Iranshah Atash Behram, Udvada : Zoroastrian Religion Leader"
          },
          {
            // "S_No": 36,
            "View": '',
            "Profile_Photo": null,
            "Name": "Thich Nhat Tu, Most Venerable, Dr.",
            "Country": "VIETNAM",
            "Credentials": "Vice-President, Vietnam Buddhist Sangha & Permanent Vice-Chancellor, Vietnam Buddhist Society : Buddhist Religion Leader"
          },
          {
            // "S_No": 37,
            "View": '',
            "Profile_Photo": null,
            "Name": "Urvashi Rautela",
            "Country": "INDIA",
            "Credentials": "Actor & Model"
          },
          
          
          
        ]
      },
      {
        speakers:[
          {
            // "S_No": 37,
            "View": '',
            "Profile_Photo": null,
            "Name": "Venkatramani R, Honorable",
            "Country": "INDIA",
            "Credentials": "The Attorney General of India"
          },
          
          {
            // "S_No": 38,
            "View": '',
            "Profile_Photo": null,
            "Name": "Yasmin Karachiwala",
            "Country": "INDIA",
            "Credentials": "Celebrity Fitness Trainer"
          },
          {
            // "S_No": 39,
            "View": '',
            "Profile_Photo": null,
            "Name": "Zayed Khan",
            "Country": "INDIA",
            "Credentials": "Producer & Actor"
          },
        ]
      },
      {
        speakers:[
          
          {
            // "S_No": 39,
            "View": '',
            "Profile_Photo": null,
            "Name": "Jose Manuel Ramos Horta, His Excellency",
            "Country": "EAST TIMOR",
            "Credentials": "President, East Timor & Nobel Peace Laureate, 1996 (ONLINE)"
          }
        ]
      }
    ]
  }
}
