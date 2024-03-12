import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  constructor() {}
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    async function initMap(): Promise<void> {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      let map: google.maps.Map;
      let markersArr: Array<any> = [];
      let mapMarkers: Array<any> = [
        {
          position: {
            lat:41.097255,
            lng:-84.262551
          },
          label: {
            color: 'black',
            text: 'Terry Dockery Investigations and Security Services'
          },
          title: 'Main Office',
          info: '300 Oak St, Continental, OH, 45831',
          options: {
            animation: google.maps.Animation.BOUNCE,
          }
        },
        {
          position: {
            lat:41.0149902517173,
            lng:-84.0502639111812
          },
          label: {
            color: 'black',
            text: 'Service Area'
          },
          title: 'Terry Dockery Investigations and Security Services',
          info: 'Ottawa, OH, Putnam County, 45875',
          options: {
            animation: google.maps.Animation.BOUNCE,
          }
        },
        {
          position: {
            lat:41.646464836971916,
            lng:-83.53340770525851
          },
          label: {
            color: 'black',
            text: "Service Area"
          },
          title: 'Terry Dockery Investigations and Security Services',
          info: 'Toledo, OH, Locus County, All 31 zip codes',
          options: {
            animation: google.maps.Animation.BOUNCE,
          }
        },
        {
          position: {
            lat:40.735712050206665,
            lng:-84.10262203128673
          },
          label: {
            color: 'black',
            text: "Service Area"
          },
          title: 'Terry Dockery Investigations and Security Services',
          info: 'Lima, OH, Allen County, 45801, 45804, 45805',
          options: {
            animation: google.maps.Animation.BOUNCE,
          }
        },
        {
          position: {
            lat:41.043680929746166,
            lng:-83.6495902743783,
          },
          label: {
            color: 'black',
            text: "Service Area"
          },
          title: 'Terry Dockery Investigations and Security Services',
          info: 'Findlay, OH, Hancock County, 45839, 45840',
          options: {
            animation: google.maps.Animation.BOUNCE,
          }
        },
      ];

      map = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat:41.097255, lng:-84.262551 },
        zoom: 8,
      });

      const infoWindow = new google.maps.InfoWindow();

      mapMarkers.forEach((marker) => {
        const nMarker = new google.maps.Marker({
          map,
          draggable: false,
          animation: marker.options.animation,
          position: {
            lat: marker.position.lat,
            lng: marker.position.lng,
          },
          title: `${marker.title}\n ${marker.info}\n`,
          label: marker.label
        });
        nMarker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(nMarker.getTitle());
          infoWindow.open(nMarker.getMap(), nMarker);
        });
        markersArr.push(nMarker);
      });
    };

    async function googleCheck(): Promise<void> {
      if ((window as any).google && (window as any).google.maps) {
        initMap();
      } else {
        setTimeout(() => googleCheck(), 250);
      };
    };
    googleCheck();
  };
};
