export class RevenueShare {
  private _id: number;
  private _mobitechId: string;
  private _publisherSubId: string;
  private _countryCode: string;
  private _verticalType: number;
  private _revenueShare: number;
  private _lastRPM: number;
  private _currentRPM: number;
  private _req_rpm:number;

  constructor() {
  }

  get req_rpm(): number {
    return this._req_rpm;
  }

  set req_rpm(value: number) {
    this._req_rpm = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get mobitechId(): string {
    return this._mobitechId;
  }

  set mobitechId(value: string) {
    this._mobitechId = value;
  }

  get publisherSubId(): string {
    return this._publisherSubId;
  }

  set publisherSubId(value: string) {
    this._publisherSubId = value;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  set countryCode(value: string) {
    this._countryCode = value;
  }

  get verticalType(): number {
    return this._verticalType;
  }

  set verticalType(value: number) {
    this._verticalType = value;
  }

  get revenueShare(): number {
    return this._revenueShare;
  }

  set revenueShare(value: number) {
    this._revenueShare = value;
  }

  get lastRPM(): number {
    return this._lastRPM;
  }

  set lastRPM(value: number) {
    this._lastRPM = value;
  }

  get currentRPM(): number {
    return this._currentRPM;
  }

  set currentRPM(value: number) {
    this._currentRPM = value;
  }
}
