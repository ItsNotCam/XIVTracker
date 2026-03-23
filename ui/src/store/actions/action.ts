import { StoreApi } from "zustand";
import { Store } from "../store";

export default class IPCActionBase {
  constructor(
		protected get: StoreApi<Store>['getState'],
		protected set: StoreApi<Store>['setState']
	) {}
}