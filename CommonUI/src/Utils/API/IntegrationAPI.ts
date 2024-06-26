import { HTTP_PROTOCOL, INTEGRATION_HOSTNAME } from "../../Config";
import BaseAPI from "./API";

class BackendAPI extends BaseAPI {
  public constructor() {
    super(HTTP_PROTOCOL, INTEGRATION_HOSTNAME);
  }
}

export default new BackendAPI();
