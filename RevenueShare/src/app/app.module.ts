import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {RevenueComponent} from "./revenue/revenue.component";
import {Ng2PaginationModule} from "ng2-pagination";
import {BootstrapModalModule} from "angular2-modal/plugins/bootstrap";
import {ModalModule} from "angular2-modal";
import { PublisherComponent } from './publisher/publisher.component';


@NgModule({
  declarations: [
    AppComponent,
    RevenueComponent,
    PublisherComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2PaginationModule,
    BootstrapModalModule,
    ModalModule.forRoot(),
  ],

  bootstrap: [AppComponent],
  providers: []
})
export class AppModule {
}
