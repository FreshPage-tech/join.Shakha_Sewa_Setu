export type ShakhaChapter = {
  name: string
  city: string
  state: string
  address: string
  day: string
  time: string
  timing: string
  detailUrl: string
}

export const SHAKHA_DATA: Record<string, Record<string, ShakhaChapter[]>> = {
  "Arizona": {
    "Chandler": [
      {
        "name": "Kesari Shakha - Chandler",
        "city": "Chandler",
        "state": "Arizona",
        "address": "Chandler AZ",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kesari-shakha-chandler"
      }
    ],
    "Glendale": [
      {
        "name": "Jija Mata Shakha - Phoenix",
        "city": "Glendale",
        "state": "Arizona",
        "address": "Glendale AZ",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Friday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=jija-mata-shakha-phoenix"
      }
    ],
    "Scottsdale": [
      {
        "name": "Shivaji Shakha - Scottsdale",
        "city": "Scottsdale",
        "state": "Arizona",
        "address": "Scottsdale AZ",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivaji-shakha-scottsdale"
      }
    ]
  },
  "Arkansas": {
    "Bentonville": [
      {
        "name": "Chaithanya",
        "city": "Bentonville",
        "state": "Arkansas",
        "address": "Bentonville AR",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Friday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=chaithanya-shakha"
      }
    ]
  },
  "California": {
    "Arcadia": [
      {
        "name": "Dharani Shakha - Arcadia",
        "city": "Arcadia",
        "state": "California",
        "address": "Arcadia CA",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Dharani"
      }
    ],
    "Brentwood": [
      {
        "name": "Rudra Shakha - Brentwood",
        "city": "Brentwood",
        "state": "California",
        "address": "Brentwood CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Brenwood_Shakha"
      }
    ],
    "Burbank": [
      {
        "name": "Parashuram Shakha - Burbank",
        "city": "Burbank",
        "state": "California",
        "address": "Burbank CA",
        "day": "Weekly on Saturday",
        "time": "12:00pm to 13:30pm",
        "timing": "Weekly on Saturday from 12:00pm to 13:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=parashuram-shakha-burbank"
      }
    ],
    "Campbell": [
      {
        "name": "Shivaji Shakha - Campbell",
        "city": "Campbell",
        "state": "California",
        "address": "Campbell CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivaji-shakha-campbell"
      }
    ],
    "Cerritos": [
      {
        "name": "Abhimanyu Shakha - Cerritos",
        "city": "Cerritos",
        "state": "California",
        "address": "Cerritos CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=abhimanyu-shakha-cerritos"
      }
    ],
    "Chino": [
      {
        "name": "Narasimha Shakha - Chino",
        "city": "Chino",
        "state": "California",
        "address": "Chino CA",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=narasimha-shakha-chino"
      }
    ],
    "Cupertino": [
      {
        "name": "Kapila Shakha - Cupertino",
        "city": "Cupertino",
        "state": "California",
        "address": "Cupertino CA",
        "day": "Weekly on Saturday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Saturday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kapila-shakha"
      }
    ],
    "Dublin": [
      {
        "name": "Durga Shakha - Dublin",
        "city": "Dublin",
        "state": "California",
        "address": "Dublin CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=durga-shakha-dublin"
      }
    ],
    "Fairfield": [
      {
        "name": "Sri Bhavani Shakha Fair Field",
        "city": "Fairfield",
        "state": "California",
        "address": "Fairfield CA",
        "day": "Weekly on Sunday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Sunday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bhavani"
      }
    ],
    "Folsom": [
      {
        "name": "Sri Krishna (Folsom)",
        "city": "Folsom",
        "state": "California",
        "address": "Folsom CA",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sri-krishna-folsom"
      }
    ],
    "Fremont": [
      {
        "name": "Arjuna Shakha - Centerville",
        "city": "Fremont",
        "state": "California",
        "address": "Fremont CA",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=arjuna-shakha-centerville"
      },
      {
        "name": "Arundhati Shakha -Ardenwood",
        "city": "Fremont",
        "state": "California",
        "address": "Fremont CA",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=arundhati-shakha-ardenwood"
      },
      {
        "name": "Keshav Shakha - Fremont",
        "city": "Fremont",
        "state": "California",
        "address": "Fremont CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=keshav-shakha-fremont"
      },
      {
        "name": "Satchidananda Shakha - Irvington",
        "city": "Fremont",
        "state": "California",
        "address": "Fremont CA",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 19:00pm",
        "timing": "Weekly on Sunday from 17:00pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Rupal"
      },
      {
        "name": "WarmSpring",
        "city": "Fremont",
        "state": "California",
        "address": "Fremont CA",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 19:00pm",
        "timing": "Weekly on Sunday from 17:00pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Warmsprings"
      }
    ],
    "Irvine": [
      {
        "name": "Bhagini Nivedita Shakha - Irvine",
        "city": "Irvine",
        "state": "California",
        "address": "Irvine CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bhagini-nivedita-shakha-irvine"
      },
      {
        "name": "Khudiram Bose Yuva Shakha",
        "city": "Irvine",
        "state": "California",
        "address": "Irvine CA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:00pm",
        "timing": "Weekly on Friday from 19:00pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=khudiram-bose-yuva-shakha"
      },
      {
        "name": "Krishnadev Raaya Shakha-Irvine",
        "city": "Irvine",
        "state": "California",
        "address": "Irvine CA",
        "day": "Weekly on Friday",
        "time": "18:15pm to 19:45pm",
        "timing": "Weekly on Friday from 18:15pm to 19:45pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=krishnadev-raaya-shakha-irvine"
      },
      {
        "name": "Netaji Subhash Shakha - Irvine",
        "city": "Irvine",
        "state": "California",
        "address": "Irvine CA",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:00pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=netaji-subhash-shakha-irvine"
      },
      {
        "name": "Sanjeevani Shakha",
        "city": "Irvine",
        "state": "California",
        "address": "Irvine CA",
        "day": "Weekly on Saturday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Saturday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Sanjeevani"
      }
    ],
    "Lathrop": [
      {
        "name": "Mahaveer Shakha",
        "city": "Lathrop",
        "state": "California",
        "address": "Lathrop CA",
        "day": "Weekly on Sunday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Sunday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Mahaveer"
      }
    ],
    "Milpitas": [
      {
        "name": "Parashuram",
        "city": "Milpitas",
        "state": "California",
        "address": "Milpitas CA",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=parashuram"
      }
    ],
    "Oak Park": [
      {
        "name": "Veer Savarkar Shakha - Oak Park",
        "city": "Oak Park",
        "state": "California",
        "address": "Oak Park CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=veer-savarkar-shakha-oak-park"
      }
    ],
    "Orangevale": [
      {
        "name": "Sacramento Proudha Shakha",
        "city": "Orangevale",
        "state": "California",
        "address": "Orangevale CA",
        "day": "Every other Week on Sunday",
        "time": "09:30am to 10:30am",
        "timing": "Every other Week on Sunday from 09:30am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sac_proudha"
      }
    ],
    "Pleasanton": [
      {
        "name": "Avantika (Trivalley Kishore)",
        "city": "Pleasanton",
        "state": "California",
        "address": "Pleasanton CA",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Avantika"
      },
      {
        "name": "Sanskruti Shakha - Pleasanton",
        "city": "Pleasanton",
        "state": "California",
        "address": "Pleasanton CA",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sanskruti-shakha-pleasanton"
      }
    ],
    "Rancho Cordova": [
      {
        "name": "Sri Hari ( Rancho Cordova)",
        "city": "Rancho Cordova",
        "state": "California",
        "address": "Rancho Cordova CA",
        "day": "Weekly on Sunday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Sunday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sri-hari-rancho-cordova"
      }
    ],
    "Rocklin": [
      {
        "name": "Sri Shivaji Kishor Shakha (Roseville)",
        "city": "Rocklin",
        "state": "California",
        "address": "Rocklin CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivaji-kishor-shakha-roseville"
      }
    ],
    "Roseville": [
      {
        "name": "Sri Ram (Roseville)",
        "city": "Roseville",
        "state": "California",
        "address": "Roseville CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sri-ram-roseville"
      }
    ],
    "Sacramento": [
      {
        "name": "Sri Durga Shakha (Natomas -Sacramento)",
        "city": "Sacramento",
        "state": "California",
        "address": "Sacramento CA",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sri-durga-shakha-natomas-sacramento"
      }
    ],
    "San Diego": [
      {
        "name": "Nivedita Shakha - San Diego",
        "city": "San Diego",
        "state": "California",
        "address": "San Diego CA",
        "day": "Weekly on Saturday",
        "time": "15:00pm to 16:30pm",
        "timing": "Weekly on Saturday from 15:00pm to 16:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=nivedita-shakha-san-diego"
      },
      {
        "name": "Shivaji Shakha - San Diego",
        "city": "San Diego",
        "state": "California",
        "address": "San Diego CA",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:30pm",
        "timing": "Weekly on Friday from 18:30pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivaji-shakha-san-diego"
      },
      {
        "name": "Vivekananda Shakha - San Diego",
        "city": "San Diego",
        "state": "California",
        "address": "San Diego CA",
        "day": "Weekly on Saturday",
        "time": "10:30am to 12:30pm",
        "timing": "Weekly on Saturday from 10:30am to 12:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekananda-shakha-san-diego"
      }
    ],
    "San Jose": [
      {
        "name": "Jijamata Shakha - Beryassa",
        "city": "San Jose",
        "state": "California",
        "address": "San Jose CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=jijamata-shakha-beryassa"
      },
      {
        "name": "Nayakidevi Shakha",
        "city": "San Jose",
        "state": "California",
        "address": "San Jose CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=nayakidevi-shakha"
      },
      {
        "name": "Rani Avantibai Shakha",
        "city": "San Jose",
        "state": "California",
        "address": "San Jose CA",
        "day": "Weekly on Sunday",
        "time": "11:15am to 12:45pm",
        "timing": "Weekly on Sunday from 11:15am to 12:45pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=san-jose-kishore-shakha"
      },
      {
        "name": "Rani Lakshmibai - San Jose Evergreen",
        "city": "San Jose",
        "state": "California",
        "address": "San Jose CA",
        "day": "Weekly on Sunday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Sunday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=rani-lakshmibai-san-jose-evergreen"
      }
    ],
    "San Ramon": [
      {
        "name": "Ayodhya Shakha - San Ramon",
        "city": "San Ramon",
        "state": "California",
        "address": "San Ramon CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=ayodhya-shakha-san-ramon"
      },
      {
        "name": "Chanakya Shakha - San Ramon",
        "city": "San Ramon",
        "state": "California",
        "address": "San Ramon CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=chanakya-shakha-san-ramon"
      },
      {
        "name": "Kailash Kishor Shakha (Contra Costa)",
        "city": "San Ramon",
        "state": "California",
        "address": "San Ramon CA",
        "day": "Weekly on Sunday",
        "time": "09:45am to 11:15am",
        "timing": "Weekly on Sunday from 09:45am to 11:15am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kailash-kishor-shakha-contra-costa"
      }
    ],
    "Santa Clara": [
      {
        "name": "Sudhanva Yuva Shaka - Santa Clara",
        "city": "Santa Clara",
        "state": "California",
        "address": "Santa Clara CA",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sudhanva-yuva-shaka-santa-clara"
      }
    ],
    "Saratoga": [
      {
        "name": "Saratoga Prayatna Shakha",
        "city": "Saratoga",
        "state": "California",
        "address": "Saratoga CA",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=saratoga-prayatna-shakha"
      }
    ],
    "Sunnyvale": [
      {
        "name": "Arjun Shakha - Sunnyvale",
        "city": "Sunnyvale",
        "state": "California",
        "address": "Sunnyvale CA",
        "day": "Weekly on Sunday",
        "time": "15:30pm to 17:00pm",
        "timing": "Weekly on Sunday from 15:30pm to 17:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=arjun-shakha-sunnyvale"
      },
      {
        "name": "Baal Ganesh Shakha - Sunnyvale",
        "city": "Sunnyvale",
        "state": "California",
        "address": "Sunnyvale CA",
        "day": "Weekly on Saturday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Saturday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=baal-ganesh-shakha-sunnyvale"
      },
      {
        "name": "Nachiketa Kishor Shaka - Santa Clara",
        "city": "Sunnyvale",
        "state": "California",
        "address": "Sunnyvale CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kishor-shaka"
      },
      {
        "name": "Omkara Yuva Shakha - Sunnyvale",
        "city": "Sunnyvale",
        "state": "California",
        "address": "Sunnyvale CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=omkara-yuva-shakha-sunnyvale"
      },
      {
        "name": "Samarth Shakha - Sunnyvale",
        "city": "Sunnyvale",
        "state": "California",
        "address": "Sunnyvale CA",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=samarth-shakha-sunnyvale"
      },
      {
        "name": "Shaurya Yuva Shakha - Sunnyvale",
        "city": "Sunnyvale",
        "state": "California",
        "address": "Sunnyvale CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shaurya-yuva-shakha-sunnyvale"
      }
    ],
    "Temecula": [
      {
        "name": "Shri Ram",
        "city": "Temecula",
        "state": "California",
        "address": "Temecula CA",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=hsstemecula"
      }
    ],
    "Temple City": [
      {
        "name": "Durga Shakha - Temple City",
        "city": "Temple City",
        "state": "California",
        "address": "Temple City CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=durga-shakha-temple-city"
      }
    ],
    "Tracy": [
      {
        "name": "BrahmaGiri Shakha",
        "city": "Tracy",
        "state": "California",
        "address": "Tracy CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=brahmagiri-shakha"
      },
      {
        "name": "Gauri Shakha",
        "city": "Tracy",
        "state": "California",
        "address": "Tracy CA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=GauriShaka"
      },
      {
        "name": "Kailas Shakha - Mountain House",
        "city": "Tracy",
        "state": "California",
        "address": "Tracy CA",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kailas-shakha-mountain-house"
      },
      {
        "name": "Prakriti Shaka",
        "city": "Tracy",
        "state": "California",
        "address": "Tracy CA",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 19:00pm",
        "timing": "Weekly on Sunday from 17:00pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=prakriti-kishore-shaka"
      }
    ]
  },
  "Colorado": {
    "CO": [
      {
        "name": "Vidyaranya Shakha - Aurora",
        "city": "CO",
        "state": "Colorado",
        "address": "CO",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vidyaranya-shakha-aurora"
      }
    ],
    "Colorado Springs": [
      {
        "name": "Hanuman Shakha - Colorado Springs",
        "city": "Colorado Springs",
        "state": "Colorado",
        "address": "Colorado Springs CO",
        "day": "Weekly on Sunday",
        "time": "10:45am to 12:15pm",
        "timing": "Weekly on Sunday from 10:45am to 12:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=hanuman-shakha-colorado-springs"
      }
    ],
    "Denver": [
      {
        "name": "Vishwashanti Shakha",
        "city": "Denver",
        "state": "Colorado",
        "address": "Denver CO",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:30pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vishwashanti-shakha"
      }
    ],
    "Erie": [
      {
        "name": "Shivaji Shakha - Broomfield",
        "city": "Erie",
        "state": "Colorado",
        "address": "Erie CO",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:45am",
        "timing": "Weekly on Sunday from 10:00am to 11:45am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivaji-shakha-broomfield"
      }
    ]
  },
  "Connecticut": {
    "Glastonbury": [
      {
        "name": "Anandi Shakha",
        "city": "Glastonbury",
        "state": "Connecticut",
        "address": "Glastonbury CT",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=glastonbury-shakha"
      }
    ],
    "Milford": [
      {
        "name": "Rameshwar Shakha",
        "city": "Milford",
        "state": "Connecticut",
        "address": "Milford CT",
        "day": "Weekly on Sunday",
        "time": "11:00am to 12:30pm",
        "timing": "Weekly on Sunday from 11:00am to 12:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=RM"
      }
    ],
    "Newington": [
      {
        "name": "Eklavya Shakha",
        "city": "Newington",
        "state": "Connecticut",
        "address": "Newington CT",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=eklavya-shakha"
      }
    ],
    "South Windsor": [
      {
        "name": "Samartha Shakha",
        "city": "South Windsor",
        "state": "Connecticut",
        "address": "South Windsor CT",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=samartha-shakha"
      }
    ],
    "Wilton": [
      {
        "name": "Vivekananda Shakha",
        "city": "Wilton",
        "state": "Connecticut",
        "address": "Wilton CT",
        "day": "Weekly on Sunday",
        "time": "11:00am to 12:30pm",
        "timing": "Weekly on Sunday from 11:00am to 12:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekananda-shakha29"
      }
    ]
  },
  "Delaware": {
    "Claymont": [
      {
        "name": "Shiva Shakti Shakha",
        "city": "Claymont",
        "state": "Delaware",
        "address": "Claymont DE",
        "day": "Weekly on Saturday",
        "time": "14:00pm to 15:30pm",
        "timing": "Weekly on Saturday from 14:00pm to 15:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=ShivaShaktiShakha"
      }
    ]
  },
  "Florida": {
    "Casselberry": [
      {
        "name": "Arjun Shakha - Orlando",
        "city": "Casselberry",
        "state": "Florida",
        "address": "Casselberry FL",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=arjun-shakha-orlando"
      }
    ],
    "Fort Lauderdale": [
      {
        "name": "Sangam Shakha - Fort Lauderdale",
        "city": "Fort Lauderdale",
        "state": "Florida",
        "address": "Fort Lauderdale FL",
        "day": "Every other Week on Sunday",
        "time": "12:15pm to 13:30pm",
        "timing": "Every other Week on Sunday from 12:15pm to 13:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sangam-shakha-fort-lauderdale"
      }
    ],
    "Jacksonville": [
      {
        "name": "Jacksonville Shivaji Shakha",
        "city": "Jacksonville",
        "state": "Florida",
        "address": "Jacksonville FL",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=jacksonville-shivaji-shakha"
      }
    ],
    "Orlando": [
      {
        "name": "Anand Shakha South Orlando",
        "city": "Orlando",
        "state": "Florida",
        "address": "Orlando FL",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=anand-shakha-south-orlando"
      }
    ],
    "Saint Augustine": [
      {
        "name": "Jagruthi",
        "city": "Saint Augustine",
        "state": "Florida",
        "address": "Saint Augustine FL",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=jagruthi45"
      }
    ],
    "Tampa": [
      {
        "name": "Abhimanyu Shakha",
        "city": "Tampa",
        "state": "Florida",
        "address": "Tampa FL",
        "day": "Weekly on Sunday",
        "time": "11:00am to 12:30pm",
        "timing": "Weekly on Sunday from 11:00am to 12:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=abhimanyu-shakha22"
      }
    ]
  },
  "Georgia": {
    "Alpharetta": [
      {
        "name": "Narasimha Kishore Milan",
        "city": "Alpharetta",
        "state": "Georgia",
        "address": "Alpharetta GA",
        "day": "Every other Week on Saturday",
        "time": "15:30pm to 17:00pm",
        "timing": "Every other Week on Saturday from 15:30pm to 17:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Kishore"
      },
      {
        "name": "Shivaji Shakha",
        "city": "Alpharetta",
        "state": "Georgia",
        "address": "Alpharetta GA",
        "day": "Weekly on Saturday",
        "time": "10:45am to 12:15pm",
        "timing": "Weekly on Saturday from 10:45am to 12:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivaji-shakha37"
      }
    ],
    "Atlanta": [
      {
        "name": "Lakshmi Bai Sevika Milan",
        "city": "Atlanta",
        "state": "Georgia",
        "address": "Atlanta GA",
        "day": "Monthly on Thursday",
        "time": "19:00pm to 20:30pm",
        "timing": "Monthly on Thursday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Gazebos"
      }
    ],
    "Augusta": [
      {
        "name": "Agasthya Shakha",
        "city": "Augusta",
        "state": "Georgia",
        "address": "Augusta GA",
        "day": "Weekly on Saturday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Saturday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bhavinisingh"
      }
    ],
    "Bloomingdale": [
      {
        "name": "Jai Hanuman",
        "city": "Bloomingdale",
        "state": "Georgia",
        "address": "Bloomingdale GA",
        "day": "Weekly on Sunday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Sunday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Jaihanuman"
      }
    ],
    "Cumming": [
      {
        "name": "Bharat Mata Shakha",
        "city": "Cumming",
        "state": "Georgia",
        "address": "Cumming GA",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bharat-mata-shakha"
      }
    ],
    "Dawsonville": [
      {
        "name": "Madhav Shakha",
        "city": "Dawsonville",
        "state": "Georgia",
        "address": "Dawsonville GA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=madhavshakha2025"
      }
    ],
    "Smyrna": [
      {
        "name": "Jai Ganesh Shakha",
        "city": "Smyrna",
        "state": "Georgia",
        "address": "Smyrna GA",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=jai-ganesh-shakha"
      }
    ],
    "Suwanee": [
      {
        "name": "Shri Krishna Shakha",
        "city": "Suwanee",
        "state": "Georgia",
        "address": "Suwanee GA",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shri-krishna-shakha"
      }
    ]
  },
  "Illinois": {
    "Aurora": [
      {
        "name": "Ekalavya Kishore Shakha",
        "city": "Aurora",
        "state": "Illinois",
        "address": "Aurora IL",
        "day": "Weekly on Sunday",
        "time": "14:30pm to 16:00pm",
        "timing": "Weekly on Sunday from 14:30pm to 16:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=NaperAuroraKishore"
      },
      {
        "name": "Vivekananda Shakha - NaperAurora",
        "city": "Aurora",
        "state": "Illinois",
        "address": "Aurora IL",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekananda-shakha-naperaurora"
      }
    ],
    "Bartlett": [
      {
        "name": "Bartlett Shakha",
        "city": "Bartlett",
        "state": "Illinois",
        "address": "Bartlett IL",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bartletthss"
      }
    ],
    "Bensenville": [
      {
        "name": "Pradnya Shakha - Bensenville",
        "city": "Bensenville",
        "state": "Illinois",
        "address": "Bensenville IL",
        "day": "Monthly on Sunday",
        "time": "15:00pm to 17:30pm",
        "timing": "Monthly on Sunday from 15:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=pradnya-shakha-bensenville"
      }
    ],
    "Bloomington": [
      {
        "name": "Bloomington Balagokulam",
        "city": "Bloomington",
        "state": "Illinois",
        "address": "Bloomington IL",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bloomington-balagokulam"
      },
      {
        "name": "Patanjali Shakha",
        "city": "Bloomington",
        "state": "Illinois",
        "address": "Bloomington IL",
        "day": "Weekly on Sunday",
        "time": "08:00am to 09:00am",
        "timing": "Weekly on Sunday from 08:00am to 09:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=patanjali-shakha"
      }
    ],
    "Buffalo Grove": [
      {
        "name": "Anjaneya Kishore Shakha",
        "city": "Buffalo Grove",
        "state": "Illinois",
        "address": "Buffalo Grove IL",
        "day": "Weekly on Friday",
        "time": "19:30pm to 21:00pm",
        "timing": "Weekly on Friday from 19:30pm to 21:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=KishoreBG"
      },
      {
        "name": "Paanchajanya Shakha - Buffalo Grove",
        "city": "Buffalo Grove",
        "state": "Illinois",
        "address": "Buffalo Grove IL",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=paanchajanya-shakha-buffalo-grove"
      }
    ],
    "Chicago": [
      {
        "name": "Vayam Shakha",
        "city": "Chicago",
        "state": "Illinois",
        "address": "Chicago IL",
        "day": "Weekly on Sunday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Sunday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=chicago-downtown-shakha"
      }
    ],
    "Naperville": [
      {
        "name": "Narasimha Shakha",
        "city": "Naperville",
        "state": "Illinois",
        "address": "Naperville IL",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=NarasimhaNaperville"
      }
    ],
    "Normal": [
      {
        "name": "IL Wesleyan University Hindu YUVA",
        "city": "Normal",
        "state": "Illinois",
        "address": "Normal IL",
        "day": "Every other Week",
        "time": "00:00am to 00:00am",
        "timing": "Every other Week from 00:00am to 00:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=il-wesleyan-university-hindu-yuva"
      }
    ],
    "Peoria": [
      {
        "name": "Peoria Shakha",
        "city": "Peoria",
        "state": "Illinois",
        "address": "Peoria IL",
        "day": "Weekly on Friday",
        "time": "18:30pm to 19:30pm",
        "timing": "Weekly on Friday from 18:30pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=peoria-shakha"
      }
    ],
    "Schaumburg": [
      {
        "name": "Abhimanyu Shakha - Schaumburg",
        "city": "Schaumburg",
        "state": "Illinois",
        "address": "Schaumburg IL",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=abhimanyu-shakha-schaumburg"
      }
    ],
    "Urbana": [
      {
        "name": "UIUC Yuva Shakha",
        "city": "Urbana",
        "state": "Illinois",
        "address": "Urbana IL",
        "day": "Weekly on Thursday",
        "time": "18:30pm to 19:30pm",
        "timing": "Weekly on Thursday from 18:30pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=uiuc-yuva-shakha"
      }
    ]
  },
  "Indiana": {
    "Bloomington": [
      {
        "name": "Sudarshan Shakha (Bloomington, IN)",
        "city": "Bloomington",
        "state": "Indiana",
        "address": "Bloomington IN",
        "day": "Weekly on Saturday",
        "time": "13:00pm to 14:30pm",
        "timing": "Weekly on Saturday from 13:00pm to 14:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=SudarshanShakha"
      }
    ],
    "Carmel": [
      {
        "name": "Sadhana Shakha (Carmel, IN)",
        "city": "Carmel",
        "state": "Indiana",
        "address": "Carmel IN",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sadhana-shakha-carmel-in"
      }
    ],
    "Columbus": [
      {
        "name": "Shivray Shakha (Columbus, IN)",
        "city": "Columbus",
        "state": "Indiana",
        "address": "Columbus IN",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivray-shakha-columbus-in"
      }
    ],
    "Fishers": [
      {
        "name": "Samskruti Shakha (Fishers, IN)",
        "city": "Fishers",
        "state": "Indiana",
        "address": "Fishers IN",
        "day": "Weekly on Sunday",
        "time": "10:30am to 11:45am",
        "timing": "Weekly on Sunday from 10:30am to 11:45am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=samskruti-shakha-fishers-in"
      }
    ],
    "Greenwood": [
      {
        "name": "Sanskar Shakha (Greenwood, IN)",
        "city": "Greenwood",
        "state": "Indiana",
        "address": "Greenwood IN",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sanskar-shakha-greenwood-in"
      }
    ],
    "West Lafayette": [
      {
        "name": "Hindu YUVA Purdue",
        "city": "West Lafayette",
        "state": "Indiana",
        "address": "West Lafayette IN",
        "day": "Daily",
        "time": "18:00pm to 19:00pm",
        "timing": "Daily from 18:00pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=hindu-yuva-purdue"
      }
    ]
  },
  "Iowa": {
    "Ames": [
      {
        "name": "Ames Yuva Shakha",
        "city": "Ames",
        "state": "Iowa",
        "address": "Ames IA",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Friday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=ames-yuva-shakha"
      }
    ],
    "North Liberty": [
      {
        "name": "Shiv-Shakti Shakha Iowa city",
        "city": "North Liberty",
        "state": "Iowa",
        "address": "North Liberty IA",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Friday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bhattrajan"
      }
    ]
  },
  "Kansas": {
    "Overland Park": [
      {
        "name": "Parashuram Shakha",
        "city": "Overland Park",
        "state": "Kansas",
        "address": "Overland Park KS",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Kansas-City-Shakha"
      }
    ]
  },
  "Kentucky": {
    "Louisville": [
      {
        "name": "Omkar Sayam Shakha (Louisville, KY)",
        "city": "Louisville",
        "state": "Kentucky",
        "address": "Louisville KY",
        "day": "Every other Week on Sunday",
        "time": "18:30pm to 20:30pm",
        "timing": "Every other Week on Sunday from 18:30pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=omkar-sayam-shakha-louisville-ky"
      }
    ]
  },
  "Maryland": {
    "Bethesda": [
      {
        "name": "Adiyogi Shakha",
        "city": "Bethesda",
        "state": "Maryland",
        "address": "Bethesda MD",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=adiyogi-shakha"
      }
    ],
    "Ellicott City": [
      {
        "name": "Chaitanya Shakha",
        "city": "Ellicott City",
        "state": "Maryland",
        "address": "Ellicott City MD",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=chaitanya-shakha"
      },
      {
        "name": "Shalivahana Shakha",
        "city": "Ellicott City",
        "state": "Maryland",
        "address": "Ellicott City MD",
        "day": "Weekly on Friday",
        "time": "19:15pm to 20:45pm",
        "timing": "Weekly on Friday from 19:15pm to 20:45pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shalivahana-shakha"
      }
    ],
    "Frederick": [
      {
        "name": "Veer Anjaneya Shakha",
        "city": "Frederick",
        "state": "Maryland",
        "address": "Frederick MD",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=veeranjaneya"
      }
    ]
  },
  "Massachusetts": {
    "Billerica": [
      {
        "name": "Azad shakha",
        "city": "Billerica",
        "state": "Massachusetts",
        "address": "Billerica MA",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=azad-shakha"
      }
    ],
    "Boylston": [
      {
        "name": "Abhimanyu Shakha",
        "city": "Boylston",
        "state": "Massachusetts",
        "address": "Boylston MA",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=abhimanyu-shakha4"
      }
    ],
    "Burlington": [
      {
        "name": "Satsang Shakha",
        "city": "Burlington",
        "state": "Massachusetts",
        "address": "Burlington MA",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=satsang-shakha"
      }
    ],
    "Cambridge": [
      {
        "name": "Aditi Shaka (Boston YUVA)",
        "city": "Cambridge",
        "state": "Massachusetts",
        "address": "Cambridge MA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:15pm",
        "timing": "Weekly on Friday from 19:00pm to 20:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=aditi-shaka-boston-yuva"
      }
    ],
    "North Attleboro": [
      {
        "name": "Shakti Shakha",
        "city": "North Attleboro",
        "state": "Massachusetts",
        "address": "North Attleboro MA",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shakti-shakha3"
      }
    ]
  },
  "Michigan": {
    "Canton": [
      {
        "name": "Nalanda Shakha (Canton)",
        "city": "Canton",
        "state": "Michigan",
        "address": "Canton MI",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=nalanda-shakha10"
      }
    ],
    "Farmington": [
      {
        "name": "Agastya Milan",
        "city": "Farmington",
        "state": "Michigan",
        "address": "Farmington MI",
        "day": "Every other Week on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Every other Week on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=agastya"
      },
      {
        "name": "Sharada Milan",
        "city": "Farmington",
        "state": "Michigan",
        "address": "Farmington MI",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sharadashakha"
      }
    ],
    "Novi": [
      {
        "name": "Lachit Shakha (Farmington/Novi )",
        "city": "Novi",
        "state": "Michigan",
        "address": "Novi MI",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=lachit-shakha-farmingtonnovi-"
      }
    ],
    "Troy": [
      {
        "name": "Chanakya Shakha (Troy)",
        "city": "Troy",
        "state": "Michigan",
        "address": "Troy MI",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=chanakya-shakha11"
      }
    ]
  },
  "Minnesota": {
    "Minneapolis": [
      {
        "name": "UMN Yuva Shakha",
        "city": "Minneapolis",
        "state": "Minnesota",
        "address": "Minneapolis MN",
        "day": "Weekly on Friday",
        "time": "18:30pm to 19:30pm",
        "timing": "Weekly on Friday from 18:30pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=umn-yuva-shakha"
      }
    ],
    "MN": [
      {
        "name": "Vasudha Shakha - Eagan",
        "city": "MN",
        "state": "Minnesota",
        "address": "MN",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vasudha-shakha-eagan"
      },
      {
        "name": "Yog Shakha - Eagan",
        "city": "MN",
        "state": "Minnesota",
        "address": "MN",
        "day": "Weekly on Saturday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Saturday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=yog-shakha-eagan"
      }
    ],
    "Rochester": [
      {
        "name": "Hindu Chintan Kendra - Vedanta Discussion",
        "city": "Rochester",
        "state": "Minnesota",
        "address": "Rochester MN",
        "day": "Monthly on Sunday",
        "time": "16:00pm to 18:00pm",
        "timing": "Monthly on Sunday from 16:00pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=hindu-chintan-kendra-vedanta-discussion"
      }
    ]
  },
  "Missouri": {
    "Saint Louis": [
      {
        "name": "Chanakya",
        "city": "Saint Louis",
        "state": "Missouri",
        "address": "Saint Louis MO",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Friday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=chanakya43"
      }
    ]
  },
  "Nevada": {
    "Las Vegas": [
      {
        "name": "Kuber Shakha - Las Vegas",
        "city": "Las Vegas",
        "state": "Nevada",
        "address": "Las Vegas NV",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kuber-shakha-las-vegas"
      }
    ]
  },
  "New Hampshire": {
    "Nashua": [
      {
        "name": "Ramkrishna Shakha",
        "city": "Nashua",
        "state": "New Hampshire",
        "address": "Nashua NH",
        "day": "Weekly on Sunday",
        "time": "04:30am to 18:00pm",
        "timing": "Weekly on Sunday from 04:30am to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=ramkrishna-shakha"
      }
    ]
  },
  "New Jersey": {
    "Chesterfield": [
      {
        "name": "Sanskruti",
        "city": "Chesterfield",
        "state": "New Jersey",
        "address": "Chesterfield NJ",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sanskruti-shakha"
      },
      {
        "name": "Veer",
        "city": "Chesterfield",
        "state": "New Jersey",
        "address": "Chesterfield NJ",
        "day": "Every other Week on Saturday",
        "time": "15:00pm to 16:30pm",
        "timing": "Every other Week on Saturday from 15:00pm to 16:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kishore-shakha-south-jersey"
      }
    ],
    "Cranbury": [
      {
        "name": "Kapila",
        "city": "Cranbury",
        "state": "New Jersey",
        "address": "Cranbury NJ",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=wwp"
      }
    ],
    "Edison": [
      {
        "name": "Bhakti",
        "city": "Edison",
        "state": "New Jersey",
        "address": "Edison NJ",
        "day": "Weekly on Thursday",
        "time": "18:45pm to 20:15pm",
        "timing": "Weekly on Thursday from 18:45pm to 20:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bhakti-shakha"
      },
      {
        "name": "Keshav",
        "city": "Edison",
        "state": "New Jersey",
        "address": "Edison NJ",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=keshav-shakha32"
      },
      {
        "name": "Mahadev",
        "city": "Edison",
        "state": "New Jersey",
        "address": "Edison NJ",
        "day": "Weekly on Sunday",
        "time": "14:00pm to 15:30pm",
        "timing": "Weekly on Sunday from 14:00pm to 15:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kishor-shakha-central-jersey"
      },
      {
        "name": "Rani LakshmiBai",
        "city": "Edison",
        "state": "New Jersey",
        "address": "Edison NJ",
        "day": "Weekly on Friday",
        "time": "19:30pm to 21:00pm",
        "timing": "Weekly on Friday from 19:30pm to 21:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=rani-lakshmibai"
      },
      {
        "name": "Sarvagna",
        "city": "Edison",
        "state": "New Jersey",
        "address": "Edison NJ",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sarvagna-shakha"
      }
    ],
    "Jersey City": [
      {
        "name": "Vivekananda Shakha",
        "city": "Jersey City",
        "state": "New Jersey",
        "address": "Jersey City NJ",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:15pm",
        "timing": "Weekly on Friday from 19:00pm to 20:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekananda-shakha24"
      }
    ],
    "Kendall Park": [
      {
        "name": "Pranavanand",
        "city": "Kendall Park",
        "state": "New Jersey",
        "address": "Kendall Park NJ",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=pranavanand-shakha"
      }
    ],
    "Mahwah": [
      {
        "name": "Paramhansa Shakha",
        "city": "Mahwah",
        "state": "New Jersey",
        "address": "Mahwah NJ",
        "day": "Weekly on Saturday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Saturday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=paramhansa-shakha"
      }
    ],
    "Milltown": [
      {
        "name": "Shakti Shakha",
        "city": "Milltown",
        "state": "New Jersey",
        "address": "Milltown NJ",
        "day": "Every other Week",
        "time": "00:00am to 00:00am",
        "timing": "Every other Week from 00:00am to 00:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shakti-shakha19"
      }
    ],
    "Parsippany": [
      {
        "name": "Maa Bhavani Shakha",
        "city": "Parsippany",
        "state": "New Jersey",
        "address": "Parsippany NJ",
        "day": "Weekly on Saturday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Saturday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Maabhavani"
      },
      {
        "name": "Shakti Shakha - Kishore",
        "city": "Parsippany",
        "state": "New Jersey",
        "address": "Parsippany NJ",
        "day": "Weekly on Sunday",
        "time": "11:00am to 00:30am",
        "timing": "Weekly on Sunday from 11:00am to 00:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=njmkishores"
      },
      {
        "name": "Sri Krishna Shakha",
        "city": "Parsippany",
        "state": "New Jersey",
        "address": "Parsippany NJ",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sri-krishna-shakha17"
      }
    ],
    "Somerset": [
      {
        "name": "Dr. Anandi Bai Yuva Shakha",
        "city": "Somerset",
        "state": "New Jersey",
        "address": "Somerset NJ",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=dr-anandi-bai-yuva-shakha"
      }
    ],
    "Towaco": [
      {
        "name": "Shri Ram Shakha",
        "city": "Towaco",
        "state": "New Jersey",
        "address": "Towaco NJ",
        "day": "Weekly on Sunday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Sunday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shriramshakha"
      }
    ]
  },
  "New York": {
    "Elmsford": [
      {
        "name": "Kishore Shakha",
        "city": "Elmsford",
        "state": "New York",
        "address": "Elmsford NY",
        "day": "Every other Week on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Every other Week on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kishore-shakha"
      }
    ],
    "Jamaica": [
      {
        "name": "Sad-Karma Shakha",
        "city": "Jamaica",
        "state": "New York",
        "address": "Jamaica NY",
        "day": "Weekly on Monday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Monday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sad-karma-shakha"
      }
    ],
    "New York": [
      {
        "name": "Gayatri Sevika Shakha",
        "city": "New York",
        "state": "New York",
        "address": "New York NY",
        "day": "Monthly on Saturday",
        "time": "00:00am to 00:00am",
        "timing": "Monthly on Saturday from 00:00am to 00:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=gayatri-sevika-shakha"
      }
    ],
    "Selden": [
      {
        "name": "Jai Hanuman Shakha",
        "city": "Selden",
        "state": "New York",
        "address": "Selden NY",
        "day": "Every other Week on Sunday",
        "time": "15:00pm to 16:30pm",
        "timing": "Every other Week on Sunday from 15:00pm to 16:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=jai-hanuman-shakha"
      }
    ],
    "White Plains": [
      {
        "name": "Gayatri Shakha",
        "city": "White Plains",
        "state": "New York",
        "address": "White Plains NY",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=gayatri-shakha41"
      },
      {
        "name": "Shivaji Shakha",
        "city": "White Plains",
        "state": "New York",
        "address": "White Plains NY",
        "day": "Weekly on Friday",
        "time": "19:15pm to 20:45pm",
        "timing": "Weekly on Friday from 19:15pm to 20:45pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivaji-shakha6"
      }
    ],
    "Yorktown Heights": [
      {
        "name": "Kuber Shakha",
        "city": "Yorktown Heights",
        "state": "New York",
        "address": "Yorktown Heights NY",
        "day": "Weekly on Friday",
        "time": "19:15pm to 20:45pm",
        "timing": "Weekly on Friday from 19:15pm to 20:45pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kubershakha"
      }
    ]
  },
  "North Carolina": {
    "Apex": [
      {
        "name": "Adi Shankaracharya Shakha",
        "city": "Apex",
        "state": "North Carolina",
        "address": "Apex NC",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=adi-shankaracharya-shakha"
      }
    ],
    "Cary": [
      {
        "name": "Sagarmatha Shakha",
        "city": "Cary",
        "state": "North Carolina",
        "address": "Cary NC",
        "day": "Weekly on Sunday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Sunday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sagarmatha-nepali-bandhu-shakha"
      },
      {
        "name": "Vivekananda Shakha",
        "city": "Cary",
        "state": "North Carolina",
        "address": "Cary NC",
        "day": "Weekly on Sunday",
        "time": "17:30pm to 19:00pm",
        "timing": "Weekly on Sunday from 17:30pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekananda-shakha9"
      }
    ],
    "Charlotte": [
      {
        "name": "Kundalini Shakha",
        "city": "Charlotte",
        "state": "North Carolina",
        "address": "Charlotte NC",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kundalini-shakha"
      },
      {
        "name": "Manikarnika Shakha",
        "city": "Charlotte",
        "state": "North Carolina",
        "address": "Charlotte NC",
        "day": "Monthly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Monthly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=manikarnika"
      },
      {
        "name": "Omkar Shakha",
        "city": "Charlotte",
        "state": "North Carolina",
        "address": "Charlotte NC",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=omkar-shakha48"
      }
    ],
    "Fuquay Varina": [
      {
        "name": "Holly Springs Fuquay Varina",
        "city": "Fuquay Varina",
        "state": "North Carolina",
        "address": "Fuquay Varina NC",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=hsfv"
      }
    ],
    "Harrisburg": [
      {
        "name": "Aadi Shakti Shakha",
        "city": "Harrisburg",
        "state": "North Carolina",
        "address": "Harrisburg NC",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=aadi-shakti-shakha"
      }
    ],
    "Matthews": [
      {
        "name": "Shreeram",
        "city": "Matthews",
        "state": "North Carolina",
        "address": "Matthews NC",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=hsscharlotteshreeram"
      }
    ],
    "Winston Salem": [
      {
        "name": "Vedic Shakha",
        "city": "Winston Salem",
        "state": "North Carolina",
        "address": "Winston Salem NC",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 06:30am",
        "timing": "Weekly on Sunday from 17:00pm to 06:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vedic-shakha"
      }
    ]
  },
  "Ohio": {
    "Dayton": [
      {
        "name": "Pushpak Shakha, Dayton",
        "city": "Dayton",
        "state": "Ohio",
        "address": "Dayton OH",
        "day": "Weekly on Saturday",
        "time": "11:00am to 12:15pm",
        "timing": "Weekly on Saturday from 11:00am to 12:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Pushpak-dayton"
      }
    ],
    "Dublin": [
      {
        "name": "Pratap Shakha, Dublin",
        "city": "Dublin",
        "state": "Ohio",
        "address": "Dublin OH",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=pratap-shakha-dublin"
      }
    ],
    "Lewis Center": [
      {
        "name": "Bharathi Shakha (Lewis Center)",
        "city": "Lewis Center",
        "state": "Ohio",
        "address": "Lewis Center OH",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bharathi-shakha-lewis-center"
      }
    ],
    "Mason": [
      {
        "name": "Gajanan Shakha",
        "city": "Mason",
        "state": "Ohio",
        "address": "Mason OH",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=gajanan-shakha"
      },
      {
        "name": "Karthikeya Shakha",
        "city": "Mason",
        "state": "Ohio",
        "address": "Mason OH",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=karthikeya"
      }
    ],
    "Reynoldsburg": [
      {
        "name": "Saraswati Shakha",
        "city": "Reynoldsburg",
        "state": "Ohio",
        "address": "Reynoldsburg OH",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Friday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=saraswati-shakha38"
      }
    ],
    "Solon": [
      {
        "name": "Sindhu Family Shakha",
        "city": "Solon",
        "state": "Ohio",
        "address": "Solon OH",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sindhu-family-shakha"
      }
    ]
  },
  "Oregon": {
    "Hillsboro": [
      {
        "name": "Sapta Sindhu Shakha",
        "city": "Hillsboro",
        "state": "Oregon",
        "address": "Hillsboro OR",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=SaptaSindhuShakha"
      },
      {
        "name": "Takshashila Shakha",
        "city": "Hillsboro",
        "state": "Oregon",
        "address": "Hillsboro OR",
        "day": "Weekly on Wednesday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Wednesday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=TakshashilaShakha"
      }
    ],
    "Portland": [
      {
        "name": "Hirkani Shakha - Portland",
        "city": "Portland",
        "state": "Oregon",
        "address": "Portland OR",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=hirkani-shakha-portland"
      }
    ]
  },
  "Pennsylvania": {
    "Allentown": [
      {
        "name": "Valmiki Shakha",
        "city": "Allentown",
        "state": "Pennsylvania",
        "address": "Allentown PA",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=valmiki-shakha-lehigh-valley-area"
      }
    ],
    "Audubon": [
      {
        "name": "Meera Shakha",
        "city": "Audubon",
        "state": "Pennsylvania",
        "address": "Audubon PA",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=meera-shakha"
      }
    ],
    "Clarks Summit": [
      {
        "name": "Parashuram Shakha",
        "city": "Clarks Summit",
        "state": "Pennsylvania",
        "address": "Clarks Summit PA",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Friday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=parashuram-shakha"
      }
    ],
    "Exton": [
      {
        "name": "Sri Krishna Shakha",
        "city": "Exton",
        "state": "Pennsylvania",
        "address": "Exton PA",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sri-krishna-shakha2"
      }
    ],
    "Lansdale": [
      {
        "name": "ShriRam Shakha",
        "city": "Lansdale",
        "state": "Pennsylvania",
        "address": "Lansdale PA",
        "day": "Weekly on Saturday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Saturday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shriram-shakha"
      }
    ],
    "Mc Donald": [
      {
        "name": "Nalanda Shakha",
        "city": "Mc Donald",
        "state": "Pennsylvania",
        "address": "Mc Donald PA",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=nalanda-shakha44"
      }
    ],
    "Monroeville": [
      {
        "name": "Ayyappa Shakha",
        "city": "Monroeville",
        "state": "Pennsylvania",
        "address": "Monroeville PA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=ayyappa-shakha"
      }
    ],
    "Philadelphia": [
      {
        "name": "Kalam Shakha",
        "city": "Philadelphia",
        "state": "Pennsylvania",
        "address": "Philadelphia PA",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kalam-shakha"
      }
    ],
    "Pittsburgh": [
      {
        "name": "Arjun Shakha",
        "city": "Pittsburgh",
        "state": "Pennsylvania",
        "address": "Pittsburgh PA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=arjun-shakha18"
      }
    ],
    "Royersford": [
      {
        "name": "Kaveri Shakha",
        "city": "Royersford",
        "state": "Pennsylvania",
        "address": "Royersford PA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=KaveriShakha"
      }
    ],
    "Sewickley": [
      {
        "name": "Veer Hanuman Shakha",
        "city": "Sewickley",
        "state": "Pennsylvania",
        "address": "Sewickley PA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=veer-hanuman-shakha"
      }
    ],
    "Wexford": [
      {
        "name": "Raghuveer Shakha",
        "city": "Wexford",
        "state": "Pennsylvania",
        "address": "Wexford PA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=raghuveer-shakha"
      }
    ]
  },
  "South Carolina": {
    "Columbia": [
      {
        "name": "Lokmanya Shakha",
        "city": "Columbia",
        "state": "South Carolina",
        "address": "Columbia SC",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=lokmanya-shakha"
      }
    ]
  },
  "Tennessee": {
    "Memphis": [
      {
        "name": "Vivekananda Shakha",
        "city": "Memphis",
        "state": "Tennessee",
        "address": "Memphis TN",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekananda-shakha20"
      }
    ],
    "Nolensville": [
      {
        "name": "Maitree",
        "city": "Nolensville",
        "state": "Tennessee",
        "address": "Nolensville TN",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=maitree"
      }
    ]
  },
  "Texas": {
    "Allen": [
      {
        "name": "Prayag Shakha",
        "city": "Allen",
        "state": "Texas",
        "address": "Allen TX",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:45am",
        "timing": "Weekly on Sunday from 10:00am to 11:45am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=prayag-shakha"
      }
    ],
    "Anna": [
      {
        "name": "Dhriti",
        "city": "Anna",
        "state": "Texas",
        "address": "Anna TX",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Dhriti"
      }
    ],
    "Aubrey": [
      {
        "name": "Samskriti",
        "city": "Aubrey",
        "state": "Texas",
        "address": "Aubrey TX",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Samskriti"
      }
    ],
    "Austin": [
      {
        "name": "Chandragupta Shakha",
        "city": "Austin",
        "state": "Texas",
        "address": "Austin TX",
        "day": "Weekly on Saturday",
        "time": "16:30pm to 17:30pm",
        "timing": "Weekly on Saturday from 16:30pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=chandragupta_yuvashakha"
      },
      {
        "name": "Maharana Pratap Shakha",
        "city": "Austin",
        "state": "Texas",
        "address": "Austin TX",
        "day": "Weekly on Friday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Friday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=maharana-pratap-shakha"
      },
      {
        "name": "Riata Apts Balagokulam",
        "city": "Austin",
        "state": "Texas",
        "address": "Austin TX",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:00pm",
        "timing": "Weekly on Friday from 18:00pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=riata-apts-shaka"
      }
    ],
    "Cedar Park": [
      {
        "name": "Arjun Shakha",
        "city": "Cedar Park",
        "state": "Texas",
        "address": "Cedar Park TX",
        "day": "Weekly on Sunday",
        "time": "16:15pm to 18:15pm",
        "timing": "Weekly on Sunday from 16:15pm to 18:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=arjun-shakha26"
      }
    ],
    "Cypress": [
      {
        "name": "Vayu Shakha (NHV)",
        "city": "Cypress",
        "state": "Texas",
        "address": "Cypress TX",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:15am",
        "timing": "Weekly on Sunday from 09:30am to 11:15am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Vayu-shakha"
      }
    ],
    "Dallas": [
      {
        "name": "Kesari Shakha - (Yuva)",
        "city": "Dallas",
        "state": "Texas",
        "address": "Dallas TX",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Richardson_Yuva_Shakha"
      }
    ],
    "Flower Mound": [
      {
        "name": "Sanskaar (Flower Mound)",
        "city": "Flower Mound",
        "state": "Texas",
        "address": "Flower Mound TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:00pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sanskaar-flower-mound"
      }
    ],
    "Frisco": [
      {
        "name": "Agni",
        "city": "Frisco",
        "state": "Texas",
        "address": "Frisco TX",
        "day": "Weekly on Sunday",
        "time": "15:30pm to 17:15pm",
        "timing": "Weekly on Sunday from 15:30pm to 17:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=agni-shakha-kishore"
      },
      {
        "name": "Pragathi",
        "city": "Frisco",
        "state": "Texas",
        "address": "Frisco TX",
        "day": "Weekly on Saturday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Saturday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=pragathi-shakha"
      }
    ],
    "Fulshear": [
      {
        "name": "Abhimanyu",
        "city": "Fulshear",
        "state": "Texas",
        "address": "Fulshear TX",
        "day": "Weekly on Sunday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Sunday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=abhimanyu"
      }
    ],
    "Houston": [
      {
        "name": "Dhruv",
        "city": "Houston",
        "state": "Texas",
        "address": "Houston TX",
        "day": "Weekly on Saturday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Saturday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=dhruv"
      },
      {
        "name": "Shaurya",
        "city": "Houston",
        "state": "Texas",
        "address": "Houston TX",
        "day": "Weekly on Friday",
        "time": "18:00pm to 19:15pm",
        "timing": "Weekly on Friday from 18:00pm to 19:15pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=yuva"
      }
    ],
    "Irving": [
      {
        "name": "Anand (Irving)",
        "city": "Irving",
        "state": "Texas",
        "address": "Irving TX",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=anand-irving"
      },
      {
        "name": "Raudra",
        "city": "Irving",
        "state": "Texas",
        "address": "Irving TX",
        "day": "Weekly on Friday",
        "time": "17:00pm to 17:30pm",
        "timing": "Weekly on Friday from 17:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Raudra"
      },
      {
        "name": "Vijay (Irving)",
        "city": "Irving",
        "state": "Texas",
        "address": "Irving TX",
        "day": "Weekly on Sunday",
        "time": "17:00pm to 18:30pm",
        "timing": "Weekly on Sunday from 17:00pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vijay-irving"
      },
      {
        "name": "Vikrant Kishore Shakha(Irving)",
        "city": "Irving",
        "state": "Texas",
        "address": "Irving TX",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Vikrant"
      }
    ],
    "Katy": [
      {
        "name": "Kailash Shakha",
        "city": "Katy",
        "state": "Texas",
        "address": "Katy TX",
        "day": "Weekly on Sunday",
        "time": "16:30pm to 18:30pm",
        "timing": "Weekly on Sunday from 16:30pm to 18:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kailash-shakha13"
      }
    ],
    "Keller": [
      {
        "name": "Adarsh (Keller)",
        "city": "Keller",
        "state": "Texas",
        "address": "Keller TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:00pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=adarsh-keller"
      },
      {
        "name": "Parakrami Kishor Shakha",
        "city": "Keller",
        "state": "Texas",
        "address": "Keller TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:00pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=parakrami-kishor-shakha"
      }
    ],
    "Mckinney": [
      {
        "name": "Chetana",
        "city": "Mckinney",
        "state": "Texas",
        "address": "Mckinney TX",
        "day": "Weekly on Saturday",
        "time": "08:15am to 22:00pm",
        "timing": "Weekly on Saturday from 08:15am to 22:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Chetana-McKinney"
      },
      {
        "name": "Garud",
        "city": "Mckinney",
        "state": "Texas",
        "address": "Mckinney TX",
        "day": "Weekly on Friday",
        "time": "19:30pm to 21:00pm",
        "timing": "Weekly on Friday from 19:30pm to 21:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Garud"
      },
      {
        "name": "Maitri",
        "city": "Mckinney",
        "state": "Texas",
        "address": "Mckinney TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:45pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:45pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=maitri-frisco"
      }
    ],
    "Pearland": [
      {
        "name": "Meenakshi",
        "city": "Pearland",
        "state": "Texas",
        "address": "Pearland TX",
        "day": "Weekly on Sunday",
        "time": "13:45pm to 15:45pm",
        "timing": "Weekly on Sunday from 13:45pm to 15:45pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=meenakshi"
      }
    ],
    "Plano": [
      {
        "name": "Anubhava (Jyestha)",
        "city": "Plano",
        "state": "Texas",
        "address": "Plano TX",
        "day": "Every other Week on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Every other Week on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Anubhava"
      },
      {
        "name": "Jagruthi",
        "city": "Plano",
        "state": "Texas",
        "address": "Plano TX",
        "day": "Weekly on Sunday",
        "time": "15:30pm to 17:00pm",
        "timing": "Weekly on Sunday from 15:30pm to 17:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=jagruthi42"
      },
      {
        "name": "Kranti Shakha",
        "city": "Plano",
        "state": "Texas",
        "address": "Plano TX",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Kranti"
      },
      {
        "name": "Prerana (Plano)",
        "city": "Plano",
        "state": "Texas",
        "address": "Plano TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Prerana-plano"
      },
      {
        "name": "Shaurya Shakha (Kishore Plano Shakha)",
        "city": "Plano",
        "state": "Texas",
        "address": "Plano TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shaurya-shakha-kishore-plano-shakha"
      }
    ],
    "Prosper": [
      {
        "name": "Unnati",
        "city": "Prosper",
        "state": "Texas",
        "address": "Prosper TX",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:15am",
        "timing": "Weekly on Sunday from 09:30am to 11:15am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Unnati"
      }
    ],
    "San Antonio": [
      {
        "name": "Abhimanyu Shakha",
        "city": "San Antonio",
        "state": "Texas",
        "address": "San Antonio TX",
        "day": "Weekly on Saturday",
        "time": "18:00pm to 19:00pm",
        "timing": "Weekly on Saturday from 18:00pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=abhimanyu-shakha53"
      },
      {
        "name": "Rani Ahilyabai Holkar Shakha",
        "city": "San Antonio",
        "state": "Texas",
        "address": "San Antonio TX",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=StoneOak_Shaka"
      },
      {
        "name": "Shivaji Shakha",
        "city": "San Antonio",
        "state": "Texas",
        "address": "San Antonio TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:00pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shivaji-shakha36"
      },
      {
        "name": "Vivekananda Shakha (San Antonio)",
        "city": "San Antonio",
        "state": "Texas",
        "address": "San Antonio TX",
        "day": "Weekly on Saturday",
        "time": "09:00am to 10:30am",
        "timing": "Weekly on Saturday from 09:00am to 10:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekananda-shakha-san-antonio"
      }
    ],
    "Sugar Land": [
      {
        "name": "Ahilya",
        "city": "Sugar Land",
        "state": "Texas",
        "address": "Sugar Land TX",
        "day": "Weekly on Sunday",
        "time": "09:15am to 11:00am",
        "timing": "Weekly on Sunday from 09:15am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Ahilya"
      },
      {
        "name": "Lakshmibai",
        "city": "Sugar Land",
        "state": "Texas",
        "address": "Sugar Land TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Lakshmibai"
      },
      {
        "name": "Madhav Shakha",
        "city": "Sugar Land",
        "state": "Texas",
        "address": "Sugar Land TX",
        "day": "Weekly on Sunday",
        "time": "09:00am to 10:45am",
        "timing": "Weekly on Sunday from 09:00am to 10:45am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=madhav-shakha14"
      },
      {
        "name": "Tanaji Shakha",
        "city": "Sugar Land",
        "state": "Texas",
        "address": "Sugar Land TX",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 18:00pm",
        "timing": "Weekly on Sunday from 16:00pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=tanaji-shakha"
      }
    ]
  },
  "Utah": {
    "South Jordan": [
      {
        "name": "Salt Lake City",
        "city": "South Jordan",
        "state": "Utah",
        "address": "South Jordan UT",
        "day": "Weekly on Sunday",
        "time": "17:30pm to 19:00pm",
        "timing": "Weekly on Sunday from 17:30pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=salt-lake-city"
      }
    ]
  },
  "Virginia": {
    "Alexandria": [
      {
        "name": "Yuva Shakha",
        "city": "Alexandria",
        "state": "Virginia",
        "address": "Alexandria VA",
        "day": "Weekly on Wednesday",
        "time": "19:30pm to 20:30pm",
        "timing": "Weekly on Wednesday from 19:30pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=yuva-shakha47"
      }
    ],
    "Ashburn": [
      {
        "name": "Vivekananda Shakha",
        "city": "Ashburn",
        "state": "Virginia",
        "address": "Ashburn VA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekananda-shakha34"
      }
    ],
    "Chantilly": [
      {
        "name": "Hanuman Shakha",
        "city": "Chantilly",
        "state": "Virginia",
        "address": "Chantilly VA",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=hanuman-shakha"
      },
      {
        "name": "RamaKrishna Shakha",
        "city": "Chantilly",
        "state": "Virginia",
        "address": "Chantilly VA",
        "day": "Weekly on Friday",
        "time": "19:15pm to 20:45pm",
        "timing": "Weekly on Friday from 19:15pm to 20:45pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=ramakrishna-shakha"
      }
    ],
    "Falls Church": [
      {
        "name": "Chanakya Shakha",
        "city": "Falls Church",
        "state": "Virginia",
        "address": "Falls Church VA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=chanakya-shakha7"
      }
    ],
    "Herndon": [
      {
        "name": "OmKar Shakha",
        "city": "Herndon",
        "state": "Virginia",
        "address": "Herndon VA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=omkar-shakha31"
      }
    ],
    "Richmond": [
      {
        "name": "Guru Govind Shakha",
        "city": "Richmond",
        "state": "Virginia",
        "address": "Richmond VA",
        "day": "Weekly on Friday",
        "time": "19:00pm to 20:30pm",
        "timing": "Weekly on Friday from 19:00pm to 20:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Gurugovind"
      }
    ],
    "VA": [
      {
        "name": "Kishor Shakha",
        "city": "VA",
        "state": "Virginia",
        "address": "VA",
        "day": "Weekly on Sunday",
        "time": "15:00pm to 16:00pm",
        "timing": "Weekly on Sunday from 15:00pm to 16:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=kishor-shakha"
      }
    ]
  },
  "Washington": {
    "Bothell": [
      {
        "name": "Shri Krishna Shakha (Bothell)",
        "city": "Bothell",
        "state": "Washington",
        "address": "Bothell WA",
        "day": "Weekly on Saturday",
        "time": "16:30pm to 18:00pm",
        "timing": "Weekly on Saturday from 16:30pm to 18:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=shri-krishna-shakha-bothell"
      }
    ],
    "Issaquah": [
      {
        "name": "Bhagat Singh Shakha (Sammamish)",
        "city": "Issaquah",
        "state": "Washington",
        "address": "Issaquah WA",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bhagat-singh-shakha-sammamish"
      }
    ],
    "Kent": [
      {
        "name": "Swami Vivekananda Shakha (Kent)",
        "city": "Kent",
        "state": "Washington",
        "address": "Kent WA",
        "day": "Weekly on Saturday",
        "time": "18:00pm to 19:30pm",
        "timing": "Weekly on Saturday from 18:00pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=swami-vivekananda-shakha-kent"
      }
    ],
    "Maple Valley": [
      {
        "name": "Savitribai Phule",
        "city": "Maple Valley",
        "state": "Washington",
        "address": "Maple Valley WA",
        "day": "Weekly on Saturday",
        "time": "17:30pm to 19:00pm",
        "timing": "Weekly on Saturday from 17:30pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=savitri"
      }
    ],
    "Redmond": [
      {
        "name": "Subramanya Bharathi Shakha (Bellevue)",
        "city": "Redmond",
        "state": "Washington",
        "address": "Redmond WA",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=subramanya-bharathi-shakha-bellevue"
      }
    ],
    "Seattle": [
      {
        "name": "Adi Shankaracharya",
        "city": "Seattle",
        "state": "Washington",
        "address": "Seattle WA",
        "day": "Weekly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=seattleyuva"
      }
    ],
    "West Richland": [
      {
        "name": "Trishul Shakha",
        "city": "West Richland",
        "state": "Washington",
        "address": "West Richland WA",
        "day": "Weekly on Sunday",
        "time": "10:30am to 12:00pm",
        "timing": "Weekly on Sunday from 10:30am to 12:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=tricities-shakha"
      }
    ]
  },
  "Wisconsin": {
    "Brookfield": [
      {
        "name": "Sanskriti Shakha (Milwaukee)",
        "city": "Brookfield",
        "state": "Wisconsin",
        "address": "Brookfield WI",
        "day": "Weekly on Friday",
        "time": "18:30pm to 20:00pm",
        "timing": "Weekly on Friday from 18:30pm to 20:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=sanskriti-shakha-milwaukee"
      }
    ],
    "Middleton": [
      {
        "name": "Shourya Shakha Middleton",
        "city": "Middleton",
        "state": "Wisconsin",
        "address": "Middleton WI",
        "day": "Weekly on Friday",
        "time": "18:30pm to 19:30pm",
        "timing": "Weekly on Friday from 18:30pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=MiddletonWI"
      }
    ],
    "Sun Prairie": [
      {
        "name": "RaniLakshmibai shakha(Madison)",
        "city": "Sun Prairie",
        "state": "Wisconsin",
        "address": "Sun Prairie WI",
        "day": "Weekly on Wednesday",
        "time": "18:15pm to 19:30pm",
        "timing": "Weekly on Wednesday from 18:15pm to 19:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=ranilakshmibai-shakhamadison"
      }
    ]
  },
  "British Columbia": {
    "Any City": [
      {
        "name": "Bhairavi Shakha - BC",
        "city": "Any City",
        "state": "British Columbia",
        "address": "Any City BC",
        "day": "Weekly on Sunday",
        "time": "16:00pm to 17:30pm",
        "timing": "Weekly on Sunday from 16:00pm to 17:30pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=bhairavi-shakha-bc"
      },
      {
        "name": "Guru Tegh bahadur Yuva Shakha",
        "city": "Any City",
        "state": "British Columbia",
        "address": "Any City BC",
        "day": "Weekly on Saturday",
        "time": "17:30pm to 19:00pm",
        "timing": "Weekly on Saturday from 17:30pm to 19:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=guru-tegh-bahadur-yuva-shakha"
      },
      {
        "name": "Madhav Shakha - BC",
        "city": "Any City",
        "state": "British Columbia",
        "address": "Any City BC",
        "day": "Weekly on Friday",
        "time": "09:00am to 10:15am",
        "timing": "Weekly on Friday from 09:00am to 10:15am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=madhav-shakha-bc"
      },
      {
        "name": "UBC Hindu YUVA",
        "city": "Any City",
        "state": "British Columbia",
        "address": "Any City BC",
        "day": "Monthly on Sunday",
        "time": "10:00am to 11:30am",
        "timing": "Monthly on Sunday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=ubc-hindu-yuva"
      }
    ],
    "BC": [
      {
        "name": "Vivekanand Shakha - BC",
        "city": "BC",
        "state": "British Columbia",
        "address": "BC",
        "day": "Weekly on Sunday",
        "time": "09:30am to 11:00am",
        "timing": "Weekly on Sunday from 09:30am to 11:00am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=vivekanand-shakha-bc"
      }
    ]
  },
  "Maharashtra": {
    "Mumbai": [
      {
        "name": "Test shakha",
        "city": "Mumbai",
        "state": "Maharashtra",
        "address": "Mumbai",
        "day": "Daily on Friday",
        "time": "10:00am to 22:00pm",
        "timing": "Daily on Friday from 10:00am to 22:00pm",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=usershakha"
      }
    ],
    "Nagpur": [
      {
        "name": "Test 1 Shakha",
        "city": "Nagpur",
        "state": "Maharashtra",
        "address": "Nagpur",
        "day": "Weekly on Thursday",
        "time": "10:00am to 11:30am",
        "timing": "Weekly on Thursday from 10:00am to 11:30am",
        "detailUrl": "https://www.hssus.org/chapter-detail/?username=Test1Shakha"
      }
    ]
  }
}

export const US_STATES = Object.keys(SHAKHA_DATA)
