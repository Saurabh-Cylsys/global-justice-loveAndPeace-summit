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
    {
      "S_No": 1,
      "View": '',
      "Profile_Photo": null,
      "Name": "Arjuna Ranatunga, Deshamanya",
      "Country": "SRI LANKA",
      "Credentials": "Cricketer & Politician"
    },
    {
      "S_No": 2,
      "View": '',
      "Profile_Photo": null,
      "Name": "Banagala Upatissa Thero, Most Venerable ",
      "Country": "SRI LANKA",
      "Credentials": "President of Mahabodhi Society, Sri Lanka : Buddhist Religious Leader"
    },
    {
      "S_No": 3,
      "View": '',
      "Profile_Photo": null,
      "Name": "Binod Kumar Chaudhary  ",
      "Country": "NEPAL",
      "Credentials": "President, Chaudhary Group : Industrialist, Member of House of Representatives of Nepal"
    },
    {
      "S_No": 4,
      "View": '',
      "Profile_Photo": null,
      "Name": "Ekaterina Zagladina",
      "Country": "RUSSIA ",
      "Credentials": "President of the Permanent Secretariat of the World Summit of Nobel Peace Laureates"
    },
    {
      "S_No": 5,
      "View": '',
      "Profile_Photo": null,
      "Name": "Esha Deol",
      "Country": "INDIA ",
      "Credentials": "Actress"
    },
    {
      "S_No": 6,
      "View": '',
      "Profile_Photo": null,
      "Name": "Feizi Masrour Milani, Dr.",
      "Country": "BRAZIL",
      "Credentials": "Elected Representative, National Spiritual Assembly of the Bahais of Brazil"
    },
    {
      "S_No": 7,
      "View": 'habil',
      "Profile_Photo": 'speaker7.png',
      "Name": "Habil Khorakiwala, Dr.",
      "Country": "INDIA",
      "Credentials": "Industrialist : Chairman, Wockhardt Group"
    },
    {
      "S_No": 8,
      "View": '',
      "Profile_Photo": null,
      "Name": "Helena Lemaletian, Senator, Ambassador",
      "Country": "KENYA",
      "Credentials": "Politician ( Member of Parliament ), Royalty ( Queen of the North Kenya ), Beauty Queen ( Miss Commonwealth Kenya, 2018 )"
    },

    {
      "S_No": 9,
      "View": '',
      "Profile_Photo": null,
      "Name": "Kailash Satyarthi",
      "Country": "INDIA",
      "Credentials": "Social Activist, Nobel Peace Laureate 2014"
    },
    {
      "S_No": 10,
      "View": '',
      "Profile_Photo": null,
      "Name": "Leymah Gbowee",
      "Country": "LIBERIA",
      "Credentials": "Nobel Peace Laureate 2011"
    },
    {
      "S_No": 11,
      "View": '',
      "Profile_Photo": null,
      "Name": "Lokesh Ji Muni Acharya, His Holiness",
      "Country": "INDIA",
      "Credentials": "Founder, Ahimsa Vishwa Bharti & World Peace Ambassador, Jain Religion Spiritual Leader"
    },
    {
      "S_No": 12,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mahawa Simou Diouf, Judge President of the Court of Justice of WAEMU (West African Monetary & Economic Union)",
      "Country": "BURKINA FASO",
      "Credentials": "Head of Association of Judges of 8 countries in West Africa"
    },
    {
      "S_No": 13,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mario-Max Schaumburg-Lippe, His Highness, Dr. Prince",
      "Country": "DENMARK",
      "Credentials": "Royalty, TV Host, Philanthropist"
    },
    {
      "S_No": 14,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mary Kom",
      "Country": "INDIA",
      "Credentials": "Boxer, 6 times World Champion"
    },
    {
      "S_No": 15,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mohammed Abd-Salam, His Excellency, Judge",
      "Country": "EGYPT",
      "Credentials": "Secretary General of the Muslim Council of Elders & Co-President of Religions for Peace"
    },
    {
      "S_No": 16,
      "View": 'asif',
      "Profile_Photo": 'speaker8.png',
      "Name": "Mohammed Asif Ali, Nawabzada",
      "Country": "INDIA",
      "Credentials": "Royalty Heir Apparent to the Prince of Arcot"
    },
    {
      "S_No": 17,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mohan Mubasinghe, Prof",
      "Country": "SRI LANKA",
      "Credentials": "Nobel Peace Laureate 2007"
    },
    {
      "S_No": 18,
      "View": '',
      "Profile_Photo": null,
      "Name": "Mustapha Njie",
      "Country": "GAMBIA",
      "Credentials": "Industrialist : Chairman, TAF Global"
    },
    {
      "S_No": 19,
      "View": 'nadir',
      "Profile_Photo": 'speaker2.png',
      "Name": "Nadir Godrej",
      "Country": "INDIA",
      "Credentials": "Industrialist, Chairman, Godrej Industries"
    },
    {
      "S_No": 20,
      "View": '',
      "Profile_Photo": null,
      "Name": "Oheneba Nana Kwame Obeng 2, His Royal Highness",
      "Country": "GHANA",
      "Credentials": "Royalty, The Royal House of Sefwi Obeng-Mim"
    },
    {
      "S_No": 21,
      "View": '',
      "Profile_Photo": null,
      "Name": "Ouided Bouchamaoui",
      "Country": "TUNISIA",
      "Credentials": "Nobel Peace Laureate 2015"
    },
    {
      "S_No": 22,
      "View": '',
      "Profile_Photo": null,
      "Name": "Paco Soleil",
      "Country": "SPAIN",
      "Credentials": "Artist, Peace Painter (live performance)"
    },
    {
      "S_No": 23,
      "View": '',
      "Profile_Photo": null,
      "Name": "P V Sindhu",
      "Country": "INDIA",
      "Credentials": "Badminton World Champion (2019) (final confirmation based on tournament schedule)"
    },
    {
      "S_No": 24,
      "View": 'rina',
      "Profile_Photo": 'speaker6.png',
      "Name": "Rina Telesphore, Dr, His Royal Highness, The Prince",
      "Country": "MADAGASCAR",
      "Credentials": "Royalty, Pastor, Philanthropist"
    },
    {
      "S_No": 25,
      "View": 'romona',
      "Profile_Photo": 'speaker9.png',
      "Name": "Romona Murad Dr., Her Royal Highness Princess Dato Seri",
      "Country": "MALAYSIA",
      "Credentials": "Royalty, Philanthropist, Peace Activist"
    },
    {
      "S_No": 26,
      "View": '',
      "Profile_Photo": null,
      "Name": "Rui Duarte de Barros, His Excellency",
      "Country": "GUINEA BISSAU",
      "Credentials": "Prime Minister"
    },
    {
      "S_No": 27,
      "View": '',
      "Profile_Photo": null,
      "Name": "Satpal Singh Khalsa, Bhai Saheb",
      "Country": "USA",
      "Credentials": "Ambassador of Sikh Dharma"
    },
    {
      "S_No": 28,
      "View": '',
      "Profile_Photo": null,
      "Name": "Tehemton  Burjor Mirza, Dastur",
      "Country": "INDIA",
      "Credentials": "High Priest, Shreeji Pak Iranshah Atash Behram, Udvada : Zoroastrian Religion Leader"
    },
    {
      "S_No": 29,
      "View": '',
      "Profile_Photo": null,
      "Name": "Thich Nhat Tu, Most Venerable, Dr.",
      "Country": "VIETNAM",
      "Credentials": "Vice-President, Vietnam Buddhist Sangha & Permanent Vice-Chancellor, Vietnam Buddhist Society : Buddhist Religion Leader"
    },
    {
      "S_No": 30,
      "View": '',
      "Profile_Photo": null,
      "Name": "Venkatramani R, Honorable",
      "Country": "INDIA",
      "Credentials": "The Attorney General of India"
    },
    {
      "S_No": 31,
      "View": '',
      "Profile_Photo": null,
      "Name": "Zayed Khan",
      "Country": "INDIA",
      "Credentials": "Producer & Actor"
    }
  ]

  getSpeakersListData() {
    return [
      {
        speakers: [
          {
            "S_No": 1,
            "View": '',
            "Profile_Photo": null,
            "Name": "Arjuna Ranatunga, Deshamanya",
            "Country": "SRI LANKA",
            "Credentials": "Cricketer & Politician"
          },
          {
            "S_No": 2,
            "View": '',
            "Profile_Photo": null,
            "Name": "Banagala Upatissa Thero, Most Venerable ",
            "Country": "SRI LANKA",
            "Credentials": "President of Mahabodhi Society, Sri Lanka : Buddhist Religious Leader"
          },
          {
            "S_No": 3,
            "View": '',
            "Profile_Photo": null,
            "Name": "Binod Kumar Chaudhary  ",
            "Country": "NEPAL",
            "Credentials": "President, Chaudhary Group : Industrialist, Member of House of Representatives of Nepal"
          }
        ]
      },


      {
        speakers: [

          {
            "S_No": 4,
            "View": '',
            "Profile_Photo": null,
            "Name": "Ekaterina Zagladina",
            "Country": "RUSSIA ",
            "Credentials": "President of the Permanent Secretariat of the World Summit of Nobel Peace Laureates"
          },
          {
            "S_No": 5,
            "View": '',
            "Profile_Photo": null,
            "Name": "Esha Deol",
            "Country": "INDIA ",
            "Credentials": "Actress"
          },
          {
            "S_No": 6,
            "View": '',
            "Profile_Photo": null,
            "Name": "Feizi Masrour Milani, Dr.",
            "Country": "BRAZIL",
            "Credentials": "Elected Representative, National Spiritual Assembly of the Bahais of Brazil"
          },
        ]
      },

      {
        speakers: [

          {
            "S_No": 7,
            "View": 'habil',
            "Profile_Photo": 'speaker7.png',
            "Name": "Habil Khorakiwala, Dr.",
            "Country": "INDIA",
            "Credentials": "Industrialist : Chairman, Wockhardt Group"
          },
          {
            "S_No": 8,
            "View": '',
            "Profile_Photo": null,
            "Name": "Helena Lemaletian, Senator, Ambassador",
            "Country": "KENYA",
            "Credentials": "Politician ( Member of Parliament ), Royalty ( Queen of the North Kenya ), Beauty Queen ( Miss Commonwealth Kenya, 2018 )"
          },

          {
            "S_No": 9,

            "View": '',
            "Profile_Photo": null,
            "Name": "Kailash Satyarthi",
            "Country": "INDIA",
            "Credentials": "Social Activist, Nobel Peace Laureate 2014"
          },
        ]
      },
      {
        speakers: [
          {
            "S_No": 10,
            "View": '',
            "Profile_Photo": null,
            "Name": "Leymah Gbowee",
            "Country": "LIBERIA",
            "Credentials": "Nobel Peace Laureate 2011"
          },
          {
            "S_No": 11,
            "View": '',
            "Profile_Photo": null,
            "Name": "Lokesh Ji Muni Acharya, His Holiness",
            "Country": "INDIA",
            "Credentials": "Founder, Ahimsa Vishwa Bharti & World Peace Ambassador, Jain Religion Spiritual Leader"
          },
          {
            "S_No": 12,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mahawa Simou Diouf, Judge President of the Court of Justice of WAEMU (West African Monetary & Economic Union)",
            "Country": "BURKINA FASO",
            "Credentials": "Head of Association of Judges of 8 countries in West Africa"
          },
        ]
      },
      {
        speakers: [
          {
            "S_No": 13,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mario-Max Schaumburg-Lippe, His Highness, Dr. Prince",
            "Country": "DENMARK",
            "Credentials": "Royalty, TV Host, Philanthropist"
          },
          {
            "S_No": 14,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mary Kom",
            "Country": "INDIA",
            "Credentials": "Boxer, 6 times World Champion"
          },
          {
            "S_No": 15,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mohammed Abd-Salam, His Excellency, Judge",
            "Country": "EGYPT",
            "Credentials": "Secretary General of the Muslim Council of Elders & Co-President of Religions for Peace"
          },
        ]
      },
      {
        speakers: [

          {
            "S_No": 16,
            "View": 'asif',
            "Profile_Photo": 'speaker8.png',
            "Name": "Mohammed Asif Ali, Nawabzada",
            "Country": "INDIA",
            "Credentials": "Royalty Heir Apparent to the Prince of Arcot"
          },
          {
            "S_No": 17,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mohan Mubasinghe, Prof",
            "Country": "SRI LANKA",
            "Credentials": "Nobel Peace Laureate 2007"
          },
          {
            "S_No": 18,
            "View": '',
            "Profile_Photo": null,
            "Name": "Mustapha Njie",
            "Country": "GAMBIA",
            "Credentials": "Industrialist : Chairman, TAF Global"
          },
        ]
      },
      {
        speakers: [

          {
            "S_No": 19,
            "View": 'nadir',
            "Profile_Photo": 'speaker2.png',
            "Name": "Nadir Godrej",
            "Country": "INDIA",
            "Credentials": "Industrialist, Chairman, Godrej Industries"
          },
          {
            "S_No": 20,
            "View": '',
            "Profile_Photo": null,
            "Name": "Oheneba Nana Kwame Obeng 2, His Royal Highness",
            "Country": "GHANA",
            "Credentials": "Royalty, The Royal House of Sefwi Obeng-Mim"
          },
          {
            "S_No": 21,
            "View": '',
            "Profile_Photo": null,
            "Name": "Ouided Bouchamaoui",
            "Country": "TUNISIA",
            "Credentials": "Nobel Peace Laureate 2015"
          },
        ]
      },
      {
        speakers: [
          {
            "S_No": 22,
            "View": '',
            "Profile_Photo": null,
            "Name": "Paco Soleil",
            "Country": "SPAIN",
            "Credentials": "Artist, Peace Painter (live performance)"
          },
          {
            "S_No": 23,
            "View": '',
            "Profile_Photo": null,
            "Name": "P V Sindhu",
            "Country": "INDIA",
            "Credentials": "Badminton World Champion (2019) (final confirmation based on tournament schedule)"
          },
          {
            "S_No": 24,
            "View": 'rina',
            "Profile_Photo": 'speaker6.png',
            "Name": "Rina Telesphore, Dr, His Royal Highness, The Prince",
            "Country": "MADAGASCAR",
            "Credentials": "Royalty, Pastor, Philanthropist"
          },
        ]
      },
      {
        speakers: [

          {
            "S_No": 25,
            "View": 'romona',
            "Profile_Photo": 'speaker9.png',
            "Name": "Romona Murad Dr., Her Royal Highness Princess Dato Seri",
            "Country": "MALAYSIA",
            "Credentials": "Royalty, Philanthropist, Peace Activist"
          },
          {
            "S_No": 26,
            "View": '',
            "Profile_Photo": null,
            "Name": "Rui Duarte de Barros, His Excellency",
            "Country": "GUINEA BISSAU",
            "Credentials": "Prime Minister"
          },
          {
            "S_No": 27,
            "View": '',
            "Profile_Photo": null,
            "Name": "Satpal Singh Khalsa, Bhai Saheb",
            "Country": "USA",
            "Credentials": "Ambassador of Sikh Dharma"
          },
        ]
      },

      {
        speakers: [

          {
            "S_No": 28,
            "View": '',
            "Profile_Photo": null,
            "Name": "Tehemton  Burjor Mirza, Dastur",
            "Country": "INDIA",
            "Credentials": "High Priest, Shreeji Pak Iranshah Atash Behram, Udvada : Zoroastrian Religion Leader"
          },
          {
            "S_No": 29,
            "View": '',
            "Profile_Photo": null,
            "Name": "Thich Nhat Tu, Most Venerable, Dr.",
            "Country": "VIETNAM",
            "Credentials": "Vice-President, Vietnam Buddhist Sangha & Permanent Vice-Chancellor, Vietnam Buddhist Society : Buddhist Religion Leader"
          },
          {
            "S_No": 30,
            "View": '',
            "Profile_Photo": null,
            "Name": "Venkatramani R, Honorable",
            "Country": "INDIA",
            "Credentials": "The Attorney General of India"
          },
        ]
      },

      {
        speakers: [
          {
            "S_No": 31,
            "View": '',
            "Profile_Photo": null,
            "Name": "Zayed Khan",
            "Country": "INDIA",
            "Credentials": "Producer & Actor"
          }
        ]
      },

    ]
  }
}
