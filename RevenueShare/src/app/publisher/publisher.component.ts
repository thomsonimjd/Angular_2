import {Component, OnInit} from '@angular/core';
import {HttpService} from "../service/http-service.service";

@Component({
  selector: 'app-publisher',
  template: `
<h1>Publisher Maintenance</h1>
        <table>
              <tr ngfor="let pub of publishers">
                  <td>{{pub}}</td>
              </tr>
        </table>
    `,
// templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css'],
  providers: [HttpService]
})
export class PublisherComponent implements OnInit {

  publishers:JSON[]=[];
  constructor(private _httpService: HttpService) {
  }

  defaultHost: string = "http://localhost:8800"

  ngOnInit() {
    this.getAllPublishers();
  }

  getAllPublishers() {
    this._httpService.httGet(this.defaultHost + "/publisher/get").subscribe(
      data => {
        console.log("success in retrieving publishers")
        if (data.status) {
          this.publishers=data.data;
        } else {
          alert(data.msg)
        }
      },
      error => {
        console.log("Error in retrieving publishers")
        alert("Error in retrieving publishers")
      },
      () => console.log("finished")
    );
  }
}
