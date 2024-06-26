import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY ='50vEZwM1h6btza4IQEHTgqjM2xlNmr4K'


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:     string = GIPHY_API_KEY;
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(
    private http: HttpClient
  ) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }


  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes(tag) ) {
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }


  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }


  private loadLocalStorage(): void {
    if ( !localStorage.getItem('history') ) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );

    if ( this._tagsHistory.length === 0 ) return;

    this.searchTag( this._tagsHistory[0] );
  }


  async searchTag( tag: string ): Promise<void> {
    if ( tag.length === 0 ) return;

    this.organizeHistory(tag);

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=50vEZwM1h6btza4IQEHTgqjM2xlNmr4K&q=valorant&limit=1')
    //   .then( res => res.json() )
    //   .then( data => console.log(data) )

    // const res = await fetch('https://api.giphy.com/v1/gifs/search?api_key=50vEZwM1h6btza4IQEHTgqjM2xlNmr4K&q=valorant&limit=1');
    // const data = await res.json();
    // console.log(data);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe( (res) => {
        this.gifList = res.data;
      });

  }

}
