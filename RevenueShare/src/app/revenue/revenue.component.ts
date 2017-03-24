import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {HttpService} from "../service/http-service.service";
import {isNull} from "util";
import {TSMap} from "typescript-map";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {Overlay} from "angular2-modal";
import {RevenueShare} from "../model/revenue-share";
import {isNumeric} from "rxjs/util/isNumeric";

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css'],
  providers: [HttpService],
})
export class RevenueComponent implements OnInit {
  onSpinner: boolean;
  form_id: number;
  form_mobitechId: string;
  form_verticalType: string;
  form_subId: string;
  form_country: string;
  form_revShare: number;

  revenueShares: RevenueShare[] = [];
  mobitechIds: string[] = [];

  defaultHost: string = "";

  ngOnInit(): any {
    this.onSpinner = true;
    this.getAllRevenueShares();
    this.getAllMobitechIds();
  }

  /*constructor(private _httpService: HttService) {
   }*/
  constructor(private _httpService: HttpService, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

  promptMessage: string = '';
  confirmResult: boolean = null;


  /*Saving a new Revenue share*/
  saveNewRevenueShare() {
    this.onSpinner = true;

    var revenue = JSON.stringify({
      id: this.form_id,
      mobitechId: this.form_mobitechId,
      publisherSubId: this.form_subId,
      countryCode: this.form_country,
      verticalType: this.form_verticalType,
      revenueShare: this.form_revShare
    });

    this._httpService.httPost(revenue, this.defaultHost + "/reports/new/revenue_share").subscribe(
      data => {
        if (data.status) {
          this.form_id = null;
          this.getAllRevenueShares();
          this.onSpinner = false;
          this.alertBox("Success", "saved to DB Success!")
        } else {
          this.onSpinner = false;
          this.alertBox("Error", "Error in adding to DB")
        }
        this.rest();
      },
      error => {
        this.onSpinner = false;
        this.alertBox("Error", "Error while adding to DB")
      },
      () => console.log("finished get service")
    );


  }

  rest() {
    this.form_subId = '';
    this.form_mobitechId = '';
    this.form_country = '';
    this.form_id = null;
    this.form_verticalType = null;
    this.form_revShare = null;
  }

  /*Receiving all revenue shares*/
  getAllRevenueShares() {
    this.revenueShares = [];
    this._httpService.httGet(this.defaultHost + "/reports/revenue_shares").subscribe(
      data => {
        this.getSerializedRevenueShare(data.data);
        this.onSpinner = false;
      },
      error => {
        this.onSpinner = false;
        this.alertBox("Error", "Error while retrieving Revenue shares");
      },
      () => console.log("finished get service")
    );
  }

  /*Recieving all the mobitech ids*/
  getAllMobitechIds() {
    this.mobitechIds = [];
    this._httpService.httGet(this.defaultHost + "/reports/publisher/mobitechid").subscribe(
      data => {
        this.getSerializedMobitechIds(data.data);
        this.onSpinner = false;
      },
      error => {
        this.alertBox("Error", "Error while retrieving Mobitech Id's");
        this.onSpinner = false;
      },
      () => console.log("finished get service")
    );

  }

  /*Editing the revenue share*/
  onClickEdit(rev) {
    // this.alertBox("Edit","Testing!!");
    this.form_subId = rev.publisherSubId;
    this.form_mobitechId = rev.mobitechId;
    this.form_country = rev.countryCode;
    this.form_id = rev.id;
    this.form_verticalType = rev.verticalType;
    this.form_revShare = rev.revenueShare;
  }

  /*Deleting a revenue share*/
  onClickDelete(id) {
    this.onSpinner = true;
    this.form_id = id;
    this._httpService.httDelete(this.defaultHost + "/reports/delete/" + this.form_id).subscribe(
      data => {
        if (data.status) {
          this.form_id = null;
          this.getAllRevenueShares();
          this.onSpinner = false;
          this.alertBox("Success", "Revenue Share Successfully!!")
          /*alert("Deleted Successfully!");*/
        } else {
          this.onSpinner = false;
          this.alertBox("Error", data.msg)
        }
      },
      error => {
        this.onSpinner = false;
        this.alertBox("Error", "Error while deleting!!");
      },
      () => console.log("finished get service")
    );
    this.rest();

  }


  /*serializing the revenue data*/
  getSerializedRevenueShare(data) {
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        var revenue = new RevenueShare();
        revenue = data[i];
        this.revenueShares.push(revenue);
      }
    }
  }

  /*serializing the mobitech ids*/
  getSerializedMobitechIds(data) {
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        var id: string;
        id = data[i];
        this.mobitechIds.push(id);
      }
    }
  }

  getRpmData(rev: RevenueShare) {
    this.onSpinner = true

    var url: string = this.defaultHost + "/reports/rpm/" + rev.mobitechId + "?";
    var rpmMap;

    if (!isNull(rev.publisherSubId))
      url = url + "sub_id=" + rev.publisherSubId + "&";
    if (!isNull(rev.countryCode))
      url = url + "country=" + rev.countryCode;

    this._httpService.httGet(url).subscribe(
      data => {
        rpmMap = new TSMap<String,number>().fromJSON(data.data);
        if (!isNull(rpmMap)) {
          rev.currentRPM = rpmMap.get("current");
          rev.lastRPM = rpmMap.get("last");
          this.onSpinner = false;
          this.alertBox("Info", data.msg);
        } else {
          this.onSpinner = false;
          this.alertBox("Error", data.msg);
        }

      },
      error => {
        this.onSpinner = false;
        this.alertBox("Error", "Error while retrieving RPM");
      },
      () => console.log("finished get service"));


  }

  findRequiredRPM(rev: RevenueShare, required_rpm: number) {
    this.onSpinner = true;

    var url: string = this.defaultHost + "/reports/get/current_imp_and_rev/" + rev.mobitechId + "?";
    var rpmMap;
    var revenue_by_target_rpm: number;
    var rev_ratio: number;
    var impression: number;
    var revenue: number;
    if (!isNull(rev.publisherSubId))
      url = url + "sub_id=" + rev.publisherSubId + "&";
    if (!isNull(rev.countryCode))
      url = url + "country=" + rev.countryCode;

    this._httpService.httGet(url).subscribe(
      data => {
        if (data.status) {
          rpmMap = new TSMap<String,number>().fromJSON(data.data);
          impression = <number> rpmMap.get("impression");
          revenue = <number>rpmMap.get("revenue");
          revenue_by_target_rpm = (impression / 1000) * required_rpm;

          if (revenue_by_target_rpm == 0 || revenue == 0)
            rev_ratio = 0;
          else
            rev_ratio = revenue_by_target_rpm / revenue;

          this.onSpinner = false;
          this.alertBox("Required RPM Info", "In order to have RPM of " + required_rpm + " set revenue share to: " + rev_ratio)

        } else {
          this.onSpinner = false;
          this.alertBox("Error", data.msg);
        }

      },
      error => {
        this.onSpinner = false;
        this.alertBox("Error", "Error while retrieving RPM");
      },
      () => console.log("finished get service"));

  }

  getRequiredRPMCalculated(rev: RevenueShare) {
    var rpm = prompt("Please required RPM", "");
    if (!isNumeric(rpm))
      this.alertBox("Error", "Please provide only numbers");
    else if (isNull(rpm))
      this.alertBox("Error", "Please provide RPM");
    else
      this.findRequiredRPM(rev, rpm);
  }

  alertBox(title: string, msg: any) {
    this.modal.alert()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .title(title)
      .body(msg)
      .open();
  }
}


