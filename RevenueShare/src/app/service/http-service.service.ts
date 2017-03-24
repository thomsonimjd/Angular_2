import "rxjs/add/operator/map";
import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, RequestMethod, Request, Response} from "@angular/http";

@Injectable()
export class HttpService {

  constructor(private _http: Http) {
  }
  httGet(url: string) {
    return this._http.get(url)
      .map(res => res.json());
  }

  httDelete(url: string) {
    return this._http.delete(url)
      .map(res => res.json());
  }

  httPost(object: any, url: string) {
    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: object
    });

    return this._http.request(new Request(requestOptions))
      .map((res: Response) => {
        if (res) {
          return {status: res.status, json: res.json()}
        }
      });
  }

}
